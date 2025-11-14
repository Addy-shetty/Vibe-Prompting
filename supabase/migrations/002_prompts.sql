-- =============================================
-- MIGRATION 002: PROMPTS
-- Purpose: Create prompts table for AI-generated prompts
-- =============================================

-- 1. Create prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow users to read public prompts OR their own prompts
CREATE POLICY "prompts_select_policy"
    ON public.prompts
    FOR SELECT
    USING (
        is_public = true 
        OR auth.uid() = user_id
    );

-- Allow authenticated users to create their own prompts
CREATE POLICY "prompts_insert_policy"
    ON public.prompts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own prompts
CREATE POLICY "prompts_update_policy"
    ON public.prompts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete only their own prompts
CREATE POLICY "prompts_delete_policy"
    ON public.prompts
    FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS prompts_user_id_idx ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS prompts_category_idx ON public.prompts(category);
CREATE INDEX IF NOT EXISTS prompts_is_public_idx ON public.prompts(is_public);
CREATE INDEX IF NOT EXISTS prompts_created_at_idx ON public.prompts(created_at DESC);

-- 5. Add updated_at trigger
CREATE TRIGGER set_prompts_updated_at
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
