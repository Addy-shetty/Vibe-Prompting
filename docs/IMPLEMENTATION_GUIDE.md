# Secure Database Implementation Guide

## Overview
This guide walks you through implementing the secure database schema v3.0 for Vibe Prompting.

---

## What Changed?

### 🔧 Major Changes:
1. **Consolidated Credit System** - Single `user_credits_v3` table (removed `profiles.credits` duplication)
2. **Transaction History** - New `credit_transactions` table for complete audit trail
3. **Enhanced Security** - Comprehensive `security_events_v3` logging
4. **Database Constraints** - CHECK constraints on all critical fields
5. **Secure Functions** - Atomic credit operations with `FOR UPDATE` locking

### 📊 New Tables:
- `user_credits_v3` - Single source of truth for credits
- `credit_transactions` - Complete audit trail
- `security_events_v3` - Enhanced security logging

### 🔄 Updated Functions:
- `consume_credits()` - Atomic credit deduction with idempotency
- `add_credits()` - Secure credit addition for purchases
- `get_user_credits_v3()` - Read-only credit getter
- `check_rate_limit_v3()` - Rate limiting with proper reset logic

---

## Step-by-Step Implementation

### Step 1: Backup Your Data ⚠️

**CRITICAL: Always backup before migrations!**

```bash
# Option 1: Using Supabase CLI
supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql

# Option 2: Using psql directly
pg_dump --clean --if-exists --quote-all-identifiers \
  -h YOUR_PROJECT_URL.supabase.co \
  -p 5432 \
  -d postgres \
  -U postgres \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

### Step 2: Run the Migration

#### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy contents of `supabase/migrations/20241201000000_secure_schema_v3.sql`
6. Click **Run**

#### Option B: Using Supabase CLI (For developers)

```bash
# Navigate to project
cd /path/to/your/project

# Run migration
supabase db push

# Or apply specific migration
supabase migration up
```

#### Option C: Using psql

```bash
# Set environment variables
export SUPABASE_URL="your-project-url.supabase.co"
export SUPABASE_DB_PASSWORD="your-db-password"

# Run migration
psql -h $SUPABASE_URL -p 5432 -d postgres -U postgres \
  -f supabase/migrations/20241201000000_secure_schema_v3.sql
```

---

### Step 3: Verify Migration Success

Run these queries in SQL Editor to verify:

```sql
-- Check if new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_credits_v3', 'credit_transactions', 'security_events_v3');

-- Check if data migrated successfully
SELECT COUNT(*) as user_count FROM user_credits_v3;
SELECT COUNT(*) as transaction_count FROM credit_transactions;

-- Test the new function
SELECT get_user_credits_v3('YOUR_USER_ID_HERE');

-- Verify constraints
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'prompts'::regclass;
```

---

### Step 4: Deploy Updated Edge Function

```bash
# Navigate to your project
cd /path/to/your/project

# Deploy the updated generate-prompt function
supabase functions deploy generate-prompt

# Verify deployment
supabase functions list
```

**Or manually deploy via dashboard:**
1. Go to Supabase Dashboard → Edge Functions
2. Select `generate-prompt`
3. Update code from `supabase/functions/generate-prompt/index.ts`
4. Click Deploy

---

### Step 5: Update Environment Variables (if needed)

Ensure your `.env` file has:

```env
# Supabase (already set)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Edge Function env vars (in Supabase dashboard)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-key
OPENROUTER_API_KEY=your-openrouter-key
```

**Set Edge Function secrets:**
```bash
supabase secrets set GEMINI_API_KEY=your-key
supabase secrets set OPENROUTER_API_KEY=your-key
```

---

### Step 6: Test the Implementation

#### Test 1: Credit System

```javascript
// In browser console or React component
import { useCredits } from '@/hooks/useCredits'

const { credits, creditsUsedTotal, loading, refetch } = useCredits()
console.log('Current credits:', credits)

// Should show migrated credits from old system
```

#### Test 2: Generate Prompt

```javascript
import { generatePrompt } from '@/lib/api'

const result = await generatePrompt({
  userInput: 'Create a React dashboard',
  tier: 'advanced'
})

console.log('Result:', result)
// Should deduct 3 credits and return generated prompt
```

#### Test 3: Check Rate Limiting

```javascript
// Try generating 11 prompts quickly
for (let i = 0; i < 11; i++) {
  const result = await generatePrompt({
    userInput: `Test ${i}`,
    tier: 'basic'
  })
  console.log(i, result)
}
// 11th request should fail with rate_limit_exceeded
```

---

## Rollback Plan ⚠️

If something goes wrong, here's how to rollback:

### Option 1: Restore from Backup

```bash
# Restore from your backup file
psql -h your-project-url.supabase.co -p 5432 -d postgres -U postgres \
  -f backup_20241201_120000.sql
```

### Option 2: Manual Rollback

```sql
-- Drop new tables
DROP TABLE IF EXISTS credit_transactions;
DROP TABLE IF EXISTS security_events_v3;
DROP TABLE IF EXISTS user_credits_v3;

-- Restore old credit column in profiles
ALTER TABLE profiles ADD COLUMN credits INTEGER DEFAULT 10;

-- Restore data from old user_credits table
UPDATE profiles p
SET credits = COALESCE(
  (SELECT credits_basic + credits_advanced + credits_expert 
   FROM user_credits uc WHERE uc.user_id = p.id),
  10
);
```

---

## Frontend Changes Made

### Files Modified:

1. **`src/hooks/useCredits.ts`**
   - Updated to use `user_credits_v3` table
   - Changed RPC call to `get_user_credits_v3`
   - Added real-time subscription to new table

2. **`src/lib/api.ts`**
   - Updated `generatePrompt` to work with new Edge Function
   - Added `fallbackGenerate` for resilience
   - New functions: `getCreditTransactionHistory`, `getSecurityEvents`

### No Breaking Changes:
- All existing hooks maintain same interface
- Credit display shows same values
- All existing components work without modification

---

## New Features Available

### 1. Credit Transaction History

```typescript
import { getCreditTransactionHistory } from '@/lib/api'

const { data } = await getCreditTransactionHistory(20)
// Returns: [{ type: 'usage', amount: -3, description: '...', created_at: '...' }]
```

### 2. Security Event Logging

```typescript
import { getSecurityEvents } from '@/lib/api'

const { data } = await getSecurityEvents(50)
// Returns: [{ event_type: 'login_success', severity: 'info', ... }]
```

### 3. Data Cleanup (Admin)

```sql
-- Run this manually or via cron job
SELECT cleanup_old_data();
-- Cleans up: security events (90d), request logs (30d), rate limits (1d)
```

---

## Security Improvements

### Before vs After:

| Feature | Before | After |
|---------|--------|-------|
| **Credit System** | Dual system (confusing) | Single consolidated table |
| **Atomic Updates** | Race condition possible | `FOR UPDATE` locking |
| **Audit Trail** | Limited (request_log only) | Complete transaction history |
| **Data Constraints** | Minimal | Extensive CHECK constraints |
| **RLS Policies** | Basic | Granular and secure |
| **Input Validation** | Edge Function only | Edge Function + DB constraints |
| **Data Retention** | Infinite | Automatic cleanup |

---

## Monitoring & Maintenance

### Daily Checks:

```sql
-- Check for failed credit transactions
SELECT COUNT(*) as failed_transactions
FROM credit_transactions
WHERE amount < 0 AND created_at > NOW() - INTERVAL '1 day';

-- Monitor rate limit violations
SELECT COUNT(*) as rate_limit_hits
FROM request_log
WHERE error_message LIKE '%rate_limit%'
AND created_at > NOW() - INTERVAL '1 day';
```

### Weekly Cleanup:

```sql
-- Clean up old data
SELECT cleanup_old_data();

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Troubleshooting

### Issue 1: "relation user_credits_v3 does not exist"
**Solution:** Migration didn't run. Check SQL Editor for errors and re-run.

### Issue 2: "function get_user_credits_v3 does not exist"
**Solution:** Functions weren't created. Run only the function creation part of migration.

### Issue 3: Credits show 0 after migration
**Solution:** Check if data migration worked:
```sql
SELECT COUNT(*) FROM user_credits_v3;
-- If 0, manually migrate:
INSERT INTO user_credits_v3 (user_id, credits, credits_used_total)
SELECT id, COALESCE(credits, 10), 0 FROM profiles;
```

### Issue 4: Edge Function fails after deployment
**Solution:** Check Edge Function logs in Supabase Dashboard → Edge Functions → Logs

### Issue 5: RLS policy errors
**Solution:** Verify policies exist:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## Next Steps

### Immediate (This Week):
1. ✅ Run migration
2. ✅ Deploy Edge Function
3. ✅ Test thoroughly
4. ✅ Monitor for errors

### Short-term (Next Month):
1. Build credit transaction history UI
2. Add admin dashboard for security events
3. Implement automated data cleanup job
4. Add credit purchase integration (Stripe)

### Long-term (Next Quarter):
1. Penetration testing
2. GDPR compliance features (data export)
3. Advanced analytics on credit usage
4. Multi-tier subscription system

---

## Support

If you encounter issues:
1. Check Supabase Dashboard → Database → Logs
2. Review Edge Function logs
3. Test with SQL Editor queries above
4. Check browser console for frontend errors

---

**Questions or issues?** Refer to the troubleshooting section or create detailed logs of the error.

**Success Criteria:**
- ✅ Credits display correctly in UI
- ✅ Prompt generation deducts credits
- ✅ Rate limiting works (10 req/min)
- ✅ No errors in console
- ✅ All RLS policies active

**You're now running a production-grade secure database! 🎉**
