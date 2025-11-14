-- =============================================
-- MIGRATION: Add Tags Column to Prompts Table
-- Run this in Supabase SQL Editor
-- =============================================

-- Add tags column to store array of tag strings
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT NULL;

-- Create index for better tag search performance
CREATE INDEX IF NOT EXISTS prompts_tags_idx ON public.prompts USING GIN (tags);

-- Add comment for documentation
COMMENT ON COLUMN public.prompts.tags IS 'Array of tags for categorizing and searching prompts (max 5 tags recommended)';
