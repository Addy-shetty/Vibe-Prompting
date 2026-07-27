# Pre-Migration Checklist

Use this checklist before running the migration to ensure everything is ready.

## ☑️ Pre-Flight Checks

### 1. Backup Verification
- [ ] **Database backup created**
  ```bash
  supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql
  ```
- [ ] **Backup file size is reasonable** (> 1KB)
- [ ] **Backup stored safely** (not in project folder)

### 2. Environment Variables
- [ ] `.env` file has all required vars:
  ```
  VITE_SUPABASE_URL=
  VITE_SUPABASE_ANON_KEY=
  ```
- [ ] **Supabase Dashboard** has Edge Function secrets:
  - `GEMINI_API_KEY`
  - `OPENROUTER_API_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Current System Status
- [ ] **No pending migrations** in Supabase
- [ ] **No active users** currently generating prompts (maintenance window)
- [ ] **Frontend is committed** to git (in case rollback needed)
- [ ] **All tests pass** (if you have tests)

### 4. Access Verification
- [ ] Can access Supabase Dashboard
- [ ] Can run SQL queries in Supabase SQL Editor
- [ ] Supabase CLI installed and authenticated:
  ```bash
  supabase --version  # Should show version
  supabase login      # Should be logged in
  ```

### 5. Review Migration File
- [ ] Read through `20241201000000_secure_schema_v3.sql`
- [ ] Understand what tables will be created
- [ ] Note the `user_credits` → `user_credits_v3` change
- [ ] Understand rollback procedure

---

## 🚀 Migration Day Checklist

### Phase 1: Preparation (5 min)
- [ ] Open Supabase Dashboard
- [ ] Open project folder in terminal
- [ ] Have implementation guide open for reference
- [ ] Close all other applications to avoid distractions

### Phase 2: Database Migration (5 min)
- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Create new query
- [ ] Copy entire contents of `20241201000000_secure_schema_v3.sql`
- [ ] **Review the first 20 lines** to ensure it starts with `-- ============================================`
- [ ] Click **Run**
- [ ] **Wait for completion** (green checkmark)
- [ ] Check for any red error messages

**If errors occur:**
- [ ] **STOP** - Do not proceed
- [ ] Screenshot error message
- [ ] Check troubleshooting section in implementation guide
- [ ] Contact support if needed

### Phase 3: Verification (5 min)
- [ ] Run verification script:
  ```sql
  -- Quick check
  SELECT 'Migration Status' as check_type, 
         CASE WHEN COUNT(*) > 0 THEN '✅ SUCCESS' 
         ELSE '❌ ISSUE' END as status
  FROM user_credits_v3;
  ```
- [ ] Check that `user_credits_v3` table exists
- [ ] Check that functions exist:
  - `consume_credits`
  - `get_user_credits_v3`
  - `check_rate_limit_v3`
- [ ] Verify data migrated:
  ```sql
  SELECT COUNT(*) as user_count FROM user_credits_v3;
  -- Should match your user count
  ```

### Phase 4: Edge Function Deployment (3 min)
- [ ] Run:
  ```bash
  supabase functions deploy generate-prompt
  ```
- [ ] Wait for deployment success message
- [ ] Verify in Supabase Dashboard → Edge Functions
- [ ] Check function logs for any errors

### Phase 5: Frontend Update (5 min)
- [ ] Update `src/hooks/useCredits.ts` (already done)
- [ ] Update `src/lib/api.ts` (already done)
- [ ] Run frontend build:
  ```bash
  npm run build
  ```
- [ ] **Check for build errors**
- [ ] If errors, fix before proceeding

### Phase 6: Testing (10 min)

#### Test 1: Credit Display
- [ ] Open application in browser
- [ ] Log in with test account
- [ ] Check dashboard shows credit balance
- [ ] Verify balance is correct (should be migrated value)

#### Test 2: Prompt Generation
- [ ] Go to Generate page
- [ ] Enter test prompt
- [ ] Select "Basic" tier (5 credits)
- [ ] Click Generate
- [ ] **Verify:**
  - [ ] Prompt generates successfully
  - [ ] Credits deducted (check dashboard)
  - [ ] Transaction appears in history

#### Test 3: Rate Limiting
- [ ] Try generating 12 prompts quickly
- [ ] 11th request should fail with rate limit error
- [ ] Wait 60 seconds
- [ ] Try again - should work

#### Test 4: Insufficient Credits
- [ ] Create new test account (gets 10 credits)
- [ ] Generate 2 Advanced prompts (3 credits each = 6 total)
- [ ] Try to generate another Advanced prompt
- [ ] Should show "insufficient credits" error

#### Test 5: New User Flow
- [ ] Create brand new account
- [ ] Verify gets 10 credits automatically
- [ ] Verify can generate prompt immediately

### Phase 7: Cleanup (2 min)
- [ ] Remove old tables (optional):
  ```sql
  -- Only if everything works!
  DROP TABLE IF EXISTS user_credits;
  ALTER TABLE profiles DROP COLUMN IF EXISTS credits;
  ```
- [ ] Commit changes to git:
  ```bash
  git add .
  git commit -m "Implement secure database schema v3.0"
  ```
- [ ] Update team on completion

---

## 🔄 Rollback Checklist (If Needed)

### Emergency Stop Procedure:
- [ ] **Stop all users** from using app
- [ ] **Don't panic** - data is backed up
- [ ] Follow rollback steps in implementation guide
- [ ] Test rollback worked
- [ ] Investigate what went wrong
- [ ] Plan retry with fixes

---

## ✅ Post-Migration Verification

### Functional Tests:
- [ ] User can log in
- [ ] User can view credit balance
- [ ] User can generate prompts
- [ ] Credits deduct correctly
- [ ] Rate limiting works
- [ ] Error messages display correctly
- [ ] New users get 10 credits

### Security Tests:
- [ ] RLS policies active (check in dashboard)
- [ ] Can't access other users' data
- [ ] Can't modify credits directly
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked

### Performance Tests:
- [ ] Page loads quickly
- [ ] Credit queries are fast
- [ ] No console errors
- [ ] Edge Functions respond quickly

---

## 📋 Sign-Off

**Migration completed by:** _________________  
**Date:** _________________  
**Time:** _________________  

**Verified by:** _________________  
**Date:** _________________  

**Notes:**
_________________________________
_________________________________
_________________________________

---

## 🎯 Success Criteria

Migration is **SUCCESSFUL** when:
- ✅ All tests pass
- ✅ No errors in logs
- ✅ Users can generate prompts
- ✅ Credits work correctly
- ✅ Rate limiting active
- ✅ Data is secure

**If any check fails → DO NOT deploy to production**

---

*Print this checklist and check off items as you complete them.*
