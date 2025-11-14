-- ============================================
-- Credit System for Vibe Prompting
-- ============================================

-- Create user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining INTEGER NOT NULL DEFAULT 50,
  total_credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own credits
CREATE POLICY "user_credits_select_policy"
  ON public.user_credits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own credits
CREATE POLICY "user_credits_update_policy"
  ON public.user_credits
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can insert credits (for new users)
CREATE POLICY "user_credits_insert_policy"
  ON public.user_credits
  FOR INSERT
  WITH CHECK (true);

-- Update the profile creation trigger to also create credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, username, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create credits entry with 50 free credits
  INSERT INTO public.user_credits (user_id, credits_remaining, total_credits_used)
  VALUES (NEW.id, 50, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

-- Trigger remains the same, already created in previous migration
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.handle_new_user();

-- Function to deduct credits (called when generating prompts)
CREATE OR REPLACE FUNCTION public.deduct_credit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT credits_remaining INTO v_credits
  FROM public.user_credits
  WHERE user_id = p_user_id;

  -- Check if user has credits
  IF v_credits > 0 THEN
    -- Deduct 1 credit and increment total used
    UPDATE public.user_credits
    SET 
      credits_remaining = credits_remaining - 1,
      total_credits_used = total_credits_used + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.deduct_credit(UUID) TO authenticated;

COMMENT ON TABLE public.user_credits IS 'Tracks user generation credits';
COMMENT ON FUNCTION public.deduct_credit IS 'Deducts one credit from user account';
