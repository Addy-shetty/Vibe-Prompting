-- ============================================
-- VIBE PROMPTING - SECURE SCHEMA v3.0
-- Migration: 20241201000000_secure_schema_v3.sql
-- Purpose: Consolidate credit system, add constraints, improve security
-- ============================================

-- Start transaction
BEGIN;

-- ============================================
-- STEP 1: Create new tables first (to avoid conflicts)
-- ============================================

-- New consolidated credits table
CREATE TABLE IF NOT EXISTS public.user_credits_v3 (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 10 CHECK (credits >= 0),
    credits_used_total INTEGER DEFAULT 0 CHECK (credits_used_total >= 0),
    last_purchase_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transaction history (comprehensive audit)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus', 'admin_adjustment')),
    description TEXT,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
    request_id TEXT UNIQUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced security events
CREATE TABLE IF NOT EXISTS public.security_events_v3 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'login_success', 'login_failed', 'logout', 'password_change',
        'email_change', 'mfa_enabled', 'mfa_disabled', 'suspicious_activity',
        'credit_purchase', 'credit_usage', 'data_export', 'account_deleted'
    )),
    severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
    ip_address_hash TEXT,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: Migrate existing data
-- ============================================

-- Migrate credits from profiles table
INSERT INTO public.user_credits_v3 (user_id, credits, credits_used_total, created_at, updated_at)
SELECT 
    p.id as user_id,
    COALESCE(p.credits, 10) as credits,
    COALESCE(uc.total_credits_used, 0) as credits_used_total,
    COALESCE(uc.created_at, p.created_at) as created_at,
    COALESCE(uc.updated_at, p.updated_at) as updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_credits uc ON uc.user_id = u.id
ON CONFLICT (user_id) DO UPDATE SET
    credits = EXCLUDED.credits,
    credits_used_total = EXCLUDED.credits_used_total;

-- Migrate existing request logs (if any)
INSERT INTO public.credit_transactions (
    user_id, amount, type, description, request_id, metadata, created_at
)
SELECT 
    user_id,
    -credits_consumed as amount,
    'usage' as type,
    'Migrated from request_log' as description,
    request_id,
    metadata,
    created_at
FROM public.request_log
WHERE credits_consumed > 0
ON CONFLICT (request_id) DO NOTHING;

-- ============================================
-- STEP 3: Add constraints to existing tables
-- ============================================

-- Add constraints to profiles
ALTER TABLE public.profiles 
    ADD CONSTRAINT username_length CHECK (LENGTH(username) BETWEEN 3 AND 20),
    ADD CONSTRAINT full_name_length CHECK (LENGTH(full_name) BETWEEN 0 AND 100),
    ADD CONSTRAINT avatar_url_length CHECK (LENGTH(avatar_url) BETWEEN 0 AND 500),
    ADD CONSTRAINT bio_length CHECK (LENGTH(bio) BETWEEN 0 AND 500);

-- Add constraints to prompts
ALTER TABLE public.prompts
    ADD CONSTRAINT title_length CHECK (LENGTH(title) BETWEEN 1 AND 200),
    ADD CONSTRAINT content_length CHECK (LENGTH(content) BETWEEN 10 AND 10000),
    ADD CONSTRAINT category_length CHECK (LENGTH(category) BETWEEN 1 AND 50),
    ADD CONSTRAINT views_count_positive CHECK (views_count >= 0),
    ADD CONSTRAINT likes_count_positive CHECK (likes_count >= 0);

-- Add tier column to prompts if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'prompts' AND column_name = 'tier_used'
    ) THEN
        ALTER TABLE public.prompts ADD COLUMN tier_used TEXT DEFAULT 'basic';
        ALTER TABLE public.prompts ADD CONSTRAINT tier_used_check 
            CHECK (tier_used IN ('basic', 'advanced', 'expert'));
    END IF;
END $$;

-- ============================================
-- STEP 4: Create secure functions
-- ============================================

-- Updated handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    suggested_username TEXT;
    final_username TEXT;
    counter INTEGER := 0;
BEGIN
    -- Generate username from email or metadata
    suggested_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        SPLIT_PART(NEW.email, '@', 1),
        'user'
    );
    
    -- Clean username (alphanumeric only)
    suggested_username := REGEXP_REPLACE(suggested_username, '[^a-zA-Z0-9]', '', 'g');
    suggested_username := LOWER(LEFT(suggested_username, 15));
    
    -- Ensure uniqueness
    final_username := suggested_username;
    WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
        counter := counter + 1;
        final_username := suggested_username || counter::TEXT;
    END LOOP;
    
    -- Create profile
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        final_username,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Initialize credits (10 free)
    INSERT INTO public.user_credits_v3 (user_id, credits, credits_used_total)
    VALUES (NEW.id, 10, 0);
    
    -- Log security event
    INSERT INTO public.security_events_v3 (user_id, event_type, severity, details)
    VALUES (NEW.id, 'login_success', 'info', jsonb_build_object('method', 'signup'));
    
    RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Atomic credit consumption
CREATE OR REPLACE FUNCTION public.consume_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_type TEXT DEFAULT 'usage',
    p_description TEXT DEFAULT '',
    p_prompt_id UUID DEFAULT NULL,
    p_request_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_credits INTEGER;
    v_new_credits INTEGER;
    v_transaction_id UUID;
BEGIN
    -- Check for duplicate request
    IF p_request_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM credit_transactions WHERE request_id = p_request_id
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'duplicate_request',
            'message', 'This request has already been processed'
        );
    END IF;
    
    -- Lock row and get current credits
    SELECT credits INTO v_current_credits
    FROM user_credits_v3
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    IF NOT FOUND THEN
        -- Initialize credits if not exists
        INSERT INTO user_credits_v3 (user_id, credits, credits_used_total)
        VALUES (p_user_id, 10, 0)
        RETURNING credits INTO v_current_credits;
    END IF;
    
    -- Check sufficient credits
    IF v_current_credits < p_amount THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'insufficient_credits',
            'message', 'Not enough credits',
            'current_credits', v_current_credits,
            'required_credits', p_amount
        );
    END IF;
    
    -- Deduct credits
    v_new_credits := v_current_credits - p_amount;
    
    UPDATE user_credits_v3
    SET credits = v_new_credits,
        credits_used_total = credits_used_total + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log transaction
    INSERT INTO credit_transactions (
        user_id, amount, type, description, prompt_id, request_id
    )
    VALUES (
        p_user_id, -p_amount, p_type, p_description, p_prompt_id, p_request_id
    )
    RETURNING id INTO v_transaction_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'transaction_id', v_transaction_id,
        'credits_remaining', v_new_credits,
        'credits_consumed', p_amount
    );
END;
$$;

-- Add credits (for purchases)
CREATE OR REPLACE FUNCTION public.add_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT DEFAULT 'Purchase'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_transaction_id UUID;
BEGIN
    IF p_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'invalid_amount');
    END IF;
    
    -- Ensure user has credits record
    INSERT INTO user_credits_v3 (user_id, credits, credits_used_total)
    VALUES (p_user_id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Add credits
    UPDATE user_credits_v3
    SET credits = credits + p_amount,
        last_purchase_at = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log transaction
    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (p_user_id, p_amount, 'purchase', p_description)
    RETURNING id INTO v_transaction_id;
    
    -- Log security event
    INSERT INTO security_events_v3 (user_id, event_type, severity, details)
    VALUES (
        p_user_id,
        'credit_purchase',
        'info',
        jsonb_build_object('amount', p_amount, 'transaction_id', v_transaction_id)
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'transaction_id', v_transaction_id,
        'credits_added', p_amount
    );
END;
$$;

-- Get user credits (read-only)
CREATE OR REPLACE FUNCTION public.get_user_credits_v3(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_credits INTEGER;
    v_used INTEGER;
BEGIN
    SELECT credits, credits_used_total 
    INTO v_credits, v_used
    FROM user_credits_v3
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        -- Initialize with default credits
        INSERT INTO user_credits_v3 (user_id, credits, credits_used_total)
        VALUES (p_user_id, 10, 0)
        RETURNING credits, credits_used_total INTO v_credits, v_used;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'credits', v_credits,
        'credits_used_total', v_used,
        'tier', 'free'
    );
END;
$$;

-- Updated rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit_v3(
    p_user_id UUID,
    p_action TEXT,
    p_max_requests INTEGER DEFAULT 10,
    p_window_seconds INTEGER DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_record RECORD;
    v_current_time TIMESTAMPTZ := NOW();
    v_reset_at TIMESTAMPTZ;
BEGIN
    SELECT * INTO v_record
    FROM rate_limits
    WHERE user_id = p_user_id AND action = p_action
    FOR UPDATE;
    
    v_reset_at := v_current_time + (p_window_seconds || ' seconds')::interval;
    
    IF NOT FOUND THEN
        INSERT INTO rate_limits (user_id, action, request_count, window_start)
        VALUES (p_user_id, p_action, 1, v_current_time);
        
        RETURN jsonb_build_object(
            'allowed', true,
            'requests_remaining', p_max_requests - 1,
            'reset_at', v_reset_at
        );
    END IF;
    
    -- Reset window if expired
    IF v_current_time > (v_record.window_start + (p_window_seconds || ' seconds')::interval) THEN
        UPDATE rate_limits
        SET request_count = 1, window_start = v_current_time
        WHERE user_id = p_user_id AND action = p_action;
        
        RETURN jsonb_build_object(
            'allowed', true,
            'requests_remaining', p_max_requests - 1,
            'reset_at', v_reset_at
        );
    END IF;
    
    -- Check limit
    IF v_record.request_count >= p_max_requests THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'error', 'rate_limit_exceeded',
            'retry_after', EXTRACT(EPOCH FROM (
                v_record.window_start + (p_window_seconds || ' seconds')::interval - v_current_time
            ))::integer,
            'reset_at', v_record.window_start + (p_window_seconds || ' seconds')::interval
        );
    END IF;
    
    -- Increment
    UPDATE rate_limits
    SET request_count = request_count + 1
    WHERE user_id = p_user_id AND action = p_action;
    
    RETURN jsonb_build_object(
        'allowed', true,
        'requests_remaining', p_max_requests - v_record.request_count - 1,
        'reset_at', v_record.window_start + (p_window_seconds || ' seconds')::interval
    );
END;
$$;

-- Data cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM security_events_v3 WHERE created_at < NOW() - INTERVAL '90 days';
    DELETE FROM request_log WHERE created_at < NOW() - INTERVAL '30 days';
    DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 day';
END;
$$;

-- ============================================
-- STEP 5: Enable RLS and create policies
-- ============================================

-- User credits v3
ALTER TABLE public.user_credits_v3 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_credits_v3_select_own" 
    ON public.user_credits_v3 FOR SELECT 
    USING (auth.uid() = user_id);

-- Credit transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_transactions_select_own" 
    ON public.credit_transactions FOR SELECT 
    USING (auth.uid() = user_id);

-- Security events v3
ALTER TABLE public.security_events_v3 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "security_events_v3_select_own" 
    ON public.security_events_v3 FOR SELECT 
    USING (auth.uid() = user_id);

-- Update prompts policies to be more secure
DROP POLICY IF EXISTS "prompts_select_policy" ON public.prompts;
DROP POLICY IF EXISTS "prompts_insert_policy" ON public.prompts;
DROP POLICY IF EXISTS "prompts_update_policy" ON public.prompts;
DROP POLICY IF EXISTS "prompts_delete_policy" ON public.prompts;

CREATE POLICY "prompts_select_public_or_own" 
    ON public.prompts FOR SELECT 
    USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "prompts_insert_own" 
    ON public.prompts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prompts_update_own" 
    ON public.prompts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "prompts_delete_own" 
    ON public.prompts FOR DELETE 
    USING (auth.uid() = user_id);

-- ============================================
-- STEP 6: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_prompts_is_public ON public.prompts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_v3_user_id ON public.security_events_v3(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_v3_created_at ON public.security_events_v3(created_at DESC);

-- ============================================
-- STEP 7: Grant permissions
-- ============================================

GRANT EXECUTE ON FUNCTION public.consume_credits TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_credits TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_credits_v3 TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit_v3 TO authenticated;

-- Commit transaction
COMMIT;
