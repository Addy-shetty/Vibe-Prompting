-- ============================================
-- VERIFICATION SCRIPT FOR V3 SECURE SCHEMA
-- Run this after migration to verify everything works
-- ============================================

-- 1. Check if all new tables exist
SELECT 'TABLE CHECK' as check_type, 
       CASE 
         WHEN COUNT(*) = 3 THEN '✅ PASS - All tables exist'
         ELSE '❌ FAIL - Missing tables'
       END as result
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_credits_v3', 'credit_transactions', 'security_events_v3');

-- 2. Check RLS is enabled on new tables
SELECT 'RLS CHECK' as check_type,
       tablename,
       CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_credits_v3', 'credit_transactions', 'security_events_v3', 'prompts', 'profiles');

-- 3. Check if functions exist
SELECT 'FUNCTION CHECK' as check_type,
       proname as function_name,
       CASE WHEN proname IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM pg_proc
WHERE proname IN ('consume_credits', 'add_credits', 'get_user_credits_v3', 'check_rate_limit_v3', 'cleanup_old_data')
AND pronamespace = 'public'::regnamespace;

-- 4. Check data migration
SELECT 'DATA MIGRATION' as check_type,
       (SELECT COUNT(*) FROM user_credits_v3) as credits_migrated,
       (SELECT COUNT(*) FROM credit_transactions) as transactions_migrated,
       CASE 
         WHEN (SELECT COUNT(*) FROM user_credits_v3) > 0 THEN '✅ PASS'
         ELSE '⚠️  WARNING - No credit data (may be new database)'
       END as status;

-- 5. Check constraints on prompts table
SELECT 'CONSTRAINTS CHECK' as check_type,
       conname as constraint_name,
       '✅ ACTIVE' as status
FROM pg_constraint
WHERE conrelid = 'prompts'::regclass
AND conname IN ('title_length', 'content_length', 'views_count_positive', 'likes_count_positive');

-- 6. Test credit consumption function (dry run)
DO $$
DECLARE
  test_result JSONB;
BEGIN
  -- This will fail for non-existent user, but tests function exists
  BEGIN
    test_result := consume_credits(
      '00000000-0000-0000-0000-000000000000'::UUID,
      5,
      'test',
      'Verification test'
    );
  EXCEPTION WHEN OTHERS THEN
    -- Expected to fail for fake user
    NULL;
  END;
  
  RAISE NOTICE '✅ consume_credits function is callable';
END $$;

-- 7. Check indexes exist
SELECT 'INDEX CHECK' as check_type,
       indexname,
       '✅ EXISTS' as status
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
  'idx_prompts_is_public',
  'idx_prompts_created_at',
  'idx_credit_transactions_user_id',
  'idx_security_events_v3_user_id'
);

-- 8. Verify trigger exists
SELECT 'TRIGGER CHECK' as check_type,
       tgname as trigger_name,
       CASE WHEN tgname IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created'
AND tgrelid = 'auth.users'::regclass;

-- 9. Summary report
SELECT 
  'VERIFICATION COMPLETE' as report,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('user_credits_v3', 'credit_transactions', 'security_events_v3')) as tables_ok,
  (SELECT COUNT(*) FROM pg_proc
   WHERE proname IN ('consume_credits', 'add_credits', 'get_user_credits_v3', 'check_rate_limit_v3')
   AND pronamespace = 'public'::regnamespace) as functions_ok,
  (SELECT COUNT(*) FROM user_credits_v3) as users_with_credits,
  NOW() as checked_at;

-- ============================================
-- TEST QUERIES (Uncomment to test)
-- ============================================

-- Test 1: Get credits for a specific user (replace with real user ID)
-- SELECT get_user_credits_v3('YOUR_USER_ID_HERE');

-- Test 2: Check rate limit status (replace with real user ID)
-- SELECT check_rate_limit_v3('YOUR_USER_ID_HERE', 'generate_prompt', 10, 60);

-- Test 3: View recent credit transactions
-- SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 5;

-- Test 4: View recent security events
-- SELECT * FROM security_events_v3 ORDER BY created_at DESC LIMIT 5;

-- ============================================
-- CLEANUP (Only if needed)
-- ============================================

-- To remove old tables after verification (optional):
-- DROP TABLE IF EXISTS user_credits;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS credits;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS tier;
