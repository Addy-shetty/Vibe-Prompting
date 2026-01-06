-- =====================================================
-- V2 SECURE CREDIT SYSTEM WITH ATOMIC TRANSACTIONS
-- Migration: 20241120000000_v2_security_system.sql
-- Purpose: Implement race-condition-proof credit system
-- =====================================================

-- 1. Add credits and tier columns to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'credits'
  ) THEN
    ALTER TABLE profiles ADD COLUMN credits INTEGER DEFAULT 10;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'tier'
  ) THEN
    ALTER TABLE profiles ADD COLUMN tier TEXT DEFAULT 'free';
  END IF;
END $$;

-- 2. Create idempotency tracking table
CREATE TABLE IF NOT EXISTS request_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL UNIQUE,
  action TEXT NOT NULL,
  credits_consumed INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_request_log_user_id ON request_log(user_id);
CREATE INDEX IF NOT EXISTS idx_request_log_request_id ON request_log(request_id);

-- 3. Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  request_count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, action)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action);

-- 4. Enable RLS on new tables
ALTER TABLE request_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own request logs" ON request_log;
DROP POLICY IF EXISTS "Users can view their own rate limits" ON rate_limits;

-- Create policies
CREATE POLICY "Users can view their own request logs"
  ON request_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own rate limits"
  ON rate_limits FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Update profiles RLS policies to prevent direct credit updates
-- Drop ALL existing profile policies first to avoid conflicts
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate all profile policies
CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_policy" ON profiles FOR DELETE USING (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (
      -- Allow if credits haven't changed
      credits = (SELECT credits FROM profiles WHERE id = auth.uid())
      -- Or if service role (for RPC functions)
      OR auth.jwt()->>'role' = 'service_role'
    )
  );

-- 5.5 Drop old check_rate_limit function (parameter name changed)
DROP FUNCTION IF EXISTS check_rate_limit(uuid, text, integer, integer);

-- 6. Atomic credit consumption function
CREATE OR REPLACE FUNCTION consume_user_credits(
  p_user_id UUID,
  p_credits_to_consume INTEGER,
  p_request_id TEXT,
  p_action TEXT DEFAULT 'generate_prompt',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_credits INTEGER;
  v_tier TEXT;
BEGIN
  -- Check for duplicate request (idempotency)
  IF EXISTS (SELECT 1 FROM request_log WHERE request_id = p_request_id) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'duplicate_request',
      'message', 'This request has already been processed'
    );
  END IF;

  -- Lock the user's row and get current credits
  SELECT credits, tier INTO v_current_credits, v_tier
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE; -- Critical: prevents race conditions

  -- Check if user exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'user_not_found',
      'message', 'User profile not found'
    );
  END IF;

  -- Check sufficient credits
  IF v_current_credits < p_credits_to_consume THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'message', 'Not enough credits',
      'current_credits', v_current_credits,
      'required_credits', p_credits_to_consume
    );
  END IF;

  -- Deduct credits
  v_new_credits := v_current_credits - p_credits_to_consume;
  
  UPDATE profiles
  SET credits = v_new_credits,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Log the transaction
  INSERT INTO request_log (user_id, request_id, action, credits_consumed, metadata)
  VALUES (p_user_id, p_request_id, p_action, p_credits_to_consume, p_metadata);

  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'credits_consumed', p_credits_to_consume,
    'credits_remaining', v_new_credits,
    'tier', v_tier
  );
END;
$$;

-- 7. Read-only credit getter function
CREATE OR REPLACE FUNCTION get_user_credits(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits INTEGER;
  v_tier TEXT;
BEGIN
  SELECT credits, tier INTO v_credits, v_tier
  FROM profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'user_not_found'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'credits', v_credits,
    'tier', v_tier
  );
END;
$$;

-- 8. Rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
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
  v_window_start TIMESTAMPTZ;
  v_current_time TIMESTAMPTZ := NOW();
BEGIN
  -- Get or create rate limit record
  SELECT * INTO v_record
  FROM rate_limits
  WHERE user_id = p_user_id AND action = p_action
  FOR UPDATE;

  IF NOT FOUND THEN
    -- First request, create record
    INSERT INTO rate_limits (user_id, action, request_count, window_start)
    VALUES (p_user_id, p_action, 1, v_current_time)
    RETURNING * INTO v_record;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'requests_remaining', p_max_requests - 1,
      'reset_at', v_record.window_start + (p_window_seconds || ' seconds')::interval
    );
  END IF;

  -- Check if window has expired
  IF v_current_time > (v_record.window_start + (p_window_seconds || ' seconds')::interval) THEN
    -- Reset window
    UPDATE rate_limits
    SET request_count = 1,
        window_start = v_current_time
    WHERE user_id = p_user_id AND action = p_action;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'requests_remaining', p_max_requests - 1,
      'reset_at', v_current_time + (p_window_seconds || ' seconds')::interval
    );
  END IF;

  -- Check if limit exceeded
  IF v_record.request_count >= p_max_requests THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'error', 'rate_limit_exceeded',
      'requests_remaining', 0,
      'reset_at', v_record.window_start + (p_window_seconds || ' seconds')::interval,
      'retry_after', EXTRACT(EPOCH FROM (
        v_record.window_start + (p_window_seconds || ' seconds')::interval - v_current_time
      ))::integer
    );
  END IF;

  -- Increment counter
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

-- 9. Grant execute permissions
GRANT EXECUTE ON FUNCTION consume_user_credits TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_credits TO authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated;

-- 10. Backfill existing users with default credits
UPDATE profiles 
SET credits = 10, tier = 'free' 
WHERE credits IS NULL;

-- 11. Create feedback table for bug reports and suggestions
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  type TEXT NOT NULL CHECK (type IN ('bug', 'suggestion', 'feedback')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Enable RLS on feedback table
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON feedback;

-- Policies: Anyone can submit feedback, users can see their own
CREATE POLICY "Anyone can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);
