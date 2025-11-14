-- =============================================
-- SECURITY: Add Database Constraints
-- Run this to ensure database-level security
-- =============================================

-- 1. Ensure username is unique (should already exist, but double-check)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_username_key'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_username_key UNIQUE (username);
    END IF;
END $$;

-- 2. Add check constraint for username format (alphanumeric + hyphens/underscores)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_username_format'
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_username_format 
        CHECK (username ~ '^[a-zA-Z0-9_-]{3,20}$');
    END IF;
END $$;

-- 3. Add check constraint for username length
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_username_length'
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_username_length 
        CHECK (char_length(username) >= 3 AND char_length(username) <= 20);
    END IF;
END $$;

-- 4. Add check constraint for prompt title length
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'prompts_title_length'
    ) THEN
        ALTER TABLE public.prompts
        ADD CONSTRAINT prompts_title_length 
        CHECK (char_length(title) >= 3 AND char_length(title) <= 100);
    END IF;
END $$;

-- 5. Add check constraint for prompt content length
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'prompts_content_length'
    ) THEN
        ALTER TABLE public.prompts
        ADD CONSTRAINT prompts_content_length 
        CHECK (char_length(content) >= 10 AND char_length(content) <= 5000);
    END IF;
END $$;

-- 6. Add check constraint for category length
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'prompts_category_length'
    ) THEN
        ALTER TABLE public.prompts
        ADD CONSTRAINT prompts_category_length 
        CHECK (char_length(category) >= 1 AND char_length(category) <= 50);
    END IF;
END $$;

-- 7. Verify all constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    conrelid::regclass as table_name
FROM pg_constraint 
WHERE conrelid IN ('public.profiles'::regclass, 'public.prompts'::regclass)
ORDER BY conrelid, conname;
