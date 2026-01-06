-- ==============================================================================
-- VIBE PROMPTING - COMPLETE SCHEMA INITIALIZATION
-- Combined migration of all previous features:
-- 1. User Profiles
-- 2. Prompts (with tags & security audit)
-- 3. Tiered Credit System (Basic/Advanced/Expert)
-- 4. Anonymous Usage Tracking (IP-based)
-- 5. Security Events & API Key Management
-- ==============================================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_policy" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_policy" ON public.profiles FOR DELETE USING (auth.uid() = id);

CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- 2. PROMPTS
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    ip_address inet,
    user_agent text,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prompts_select_policy" ON public.prompts FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "prompts_insert_policy" ON public.prompts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prompts_update_policy" ON public.prompts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "prompts_delete_policy" ON public.prompts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS prompts_user_id_idx ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS prompts_category_idx ON public.prompts(category);
CREATE INDEX IF NOT EXISTS prompts_tags_gin_idx ON public.prompts USING GIN (tags);

-- 3. USER CREDITS (TIERED)
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_basic INTEGER NOT NULL DEFAULT 5,
  credits_advanced INTEGER NOT NULL DEFAULT 3,
  credits_expert INTEGER NOT NULL DEFAULT 2,
  total_credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_credits_select_policy" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_credits_update_policy" ON public.user_credits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_credits_insert_policy" ON public.user_credits FOR INSERT WITH CHECK (true);

-- 4. ANONYMOUS USAGE
CREATE TABLE IF NOT EXISTS public.anonymous_usage (
    ip_address text PRIMARY KEY,
    usage_count integer DEFAULT 0,
    last_active timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.anonymous_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to anonymous_usage" ON public.anonymous_usage FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. SECURITY EVENTS
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security events" ON public.security_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert security events" ON public.security_events FOR INSERT WITH CHECK (true);

-- 6. FUNCTIONS & TRIGGERS

-- Handle New User (Profile + Credits with IP check)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_ip text;
  anon_usage int := 0;
  basic_credits int := 5;
BEGIN
  -- Attempt to extract IP from headers
  BEGIN
    user_ip := current_setting('request.headers', true)::json->>'x-forwarded-for';
    IF user_ip IS NOT NULL THEN
      user_ip := split_part(user_ip, ',', 1);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    user_ip := NULL;
  END;

  -- Check anonymous usage
  IF user_ip IS NOT NULL THEN
    SELECT usage_count INTO anon_usage FROM public.anonymous_usage WHERE ip_address = user_ip;
    IF anon_usage IS NOT NULL AND anon_usage > 0 THEN
      basic_credits := GREATEST(0, 5 - anon_usage);
    END IF;
  END IF;

  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create credits
  INSERT INTO public.user_credits (user_id, credits_basic, credits_advanced, credits_expert)
  VALUES (NEW.id, basic_credits, 3, 2)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Deduct Credit Function
CREATE OR REPLACE FUNCTION public.deduct_credit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  -- Note: This is a legacy function signature, updated logic handled in Edge Function usually
  -- But keeping for backward compatibility if needed
  RETURN TRUE;
END;
$$;

-- Refund Credit Function
CREATE OR REPLACE FUNCTION refund_credit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_credits
  SET 
    credits_basic = credits_basic + 1, -- Defaulting to basic for generic refund
    total_credits_used = GREATEST(0, total_credits_used - 1),
    updated_at = now()
  WHERE user_id = p_user_id;
  RETURN FOUND;
END;
$$;

-- Increment Anonymous Usage
CREATE OR REPLACE FUNCTION increment_anonymous_usage(client_ip text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_count integer;
BEGIN
    INSERT INTO public.anonymous_usage (ip_address, usage_count, last_active)
    VALUES (client_ip, 1, now())
    ON CONFLICT (ip_address)
    DO UPDATE SET 
        usage_count = anonymous_usage.usage_count + 1,
        last_active = now()
    RETURNING usage_count INTO current_count;
    
    RETURN current_count;
END;
$$;

-- Updated_at timestamp handler
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_prompts_updated_at BEFORE UPDATE ON public.prompts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_credits_updated_at BEFORE UPDATE ON public.user_credits FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
