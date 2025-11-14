# 🚀 Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Run Migrations in Order

Go to your Supabase project → SQL Editor, and run these files **in order**:

1. **First**: `001_profiles.sql` ✅ User Profiles + Auto-creation
2. **Second**: `002_prompts.sql` ✅ Prompts Storage

### Step 2: Enable OAuth Providers

1. Go to **Authentication** → **Providers**
2. Enable **Google**:
   - Add your Google OAuth credentials
   - Redirect URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Enable **GitHub**:
   - Add your GitHub OAuth credentials  
   - Same redirect URL

### Step 3: Test Registration

1. Go to your app: `http://localhost:5173`
2. Click **Sign Up**
3. Create an account
4. Verify in Supabase → **Table Editor** → `profiles` that your profile was auto-created ✅

### Step 4: Test OAuth Login

1. Click **Continue with Google** or **Continue with GitHub**
2. Authorize the app
3. Verify profile was created automatically

---

## What Each Migration Does

### 001_profiles.sql
- ✅ Creates `profiles` table (id, username, avatar_url, bio)
- ✅ Sets up Row Level Security (users can only edit their own profile)
- ✅ Auto-creates profile when user signs up (trigger on `auth.users`)
- ✅ Handles OAuth logins (extracts username and avatar from OAuth data)

### 002_prompts.sql
- ✅ Creates `prompts` table (title, content, category, public/private)
- ✅ Sets up Row Level Security (users can only edit their own prompts)
- ✅ Public prompts visible to everyone
- ✅ Indexes for fast queries

---

## Verify Everything Works

```sql
-- Check if profiles table exists
SELECT * FROM public.profiles;

-- Check if prompts table exists
SELECT * FROM public.prompts;

-- Check if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

---

## Troubleshooting

**Problem**: Profile not created after signup
- **Solution**: Check Supabase logs (Database → Logs)
- Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;`

**Problem**: "row level security policy violation"
- **Solution**: Make sure you're logged in and `auth.uid()` matches the user_id

**Problem**: OAuth not working
- **Solution**: Verify redirect URLs in OAuth provider settings

---

## Next Steps

After migrations are done:
1. ✅ Test signup/login
2. ✅ Test Google/GitHub OAuth  
3. ✅ Generate a prompt and save it
4. ✅ View your saved prompts

🎉 **You're all set!**
