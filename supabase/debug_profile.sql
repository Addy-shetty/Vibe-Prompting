-- =============================================
-- DEBUG: Check Profile Creation Status
-- =============================================

-- 1. Check if profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
) as profiles_table_exists;

-- 2. Check if trigger exists
SELECT 
    tgname as trigger_name,
    tgenabled as is_enabled,
    proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass
AND tgname = 'on_auth_user_created';

-- 3. Check if function exists
SELECT 
    proname as function_name,
    prosecdef as is_security_definer
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 4. List all users from auth.users
SELECT id, email, created_at FROM auth.users;

-- 5. List all profiles
SELECT id, username, created_at FROM public.profiles;

-- 6. Find users WITHOUT profiles
SELECT 
    u.id,
    u.email,
    u.created_at,
    'NO PROFILE' as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
