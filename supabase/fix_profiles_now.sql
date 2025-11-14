-- =============================================
-- FIX: Profile Auto-Creation Issue
-- =============================================

-- Step 1: First, manually create profiles for existing users
-- Make usernames unique by adding a number suffix if needed
INSERT INTO public.profiles (id, username, avatar_url)
SELECT 
    u.id,
    COALESCE(
        u.raw_user_meta_data->>'username',
        SPLIT_PART(u.email, '@', 1)
    ) || '_' || SUBSTRING(u.id::text, 1, 4) as username,
    u.raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 2: Add a service role policy to allow trigger to bypass RLS
CREATE POLICY "service_role_insert_policy"
    ON public.profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Step 3: Verify the fix worked
SELECT 
    u.id,
    u.email,
    p.username,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Profile Created'
        ELSE '❌ Still Missing'
    END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
