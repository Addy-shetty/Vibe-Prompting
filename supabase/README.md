# Supabase Database Setup

## 📁 Files Overview

### Migrations
1. **001_create_profiles_table.sql** - User profiles with auto-sync from auth.users
2. **002_create_prompts_table.sql** - Prompts table with RLS policies

### Seed Data
- **seed_example_prompts.sql** - 25+ high-quality developer example prompts

## 🚀 Setup Instructions

### Step 1: Run Migrations
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor**
3. Copy and paste `001_create_profiles_table.sql`
4. Click **Run**
5. Repeat for `002_create_prompts_table.sql`

### Step 2: Seed Example Prompts (Optional but Recommended)
After migrations are complete:

1. **Make sure you're logged in** to your app first (creates your user_id)
2. Go to **SQL Editor** in Supabase Dashboard
3. Copy and paste `seed_example_prompts.sql`
4. Click **Run**

This will create **25+ professional example prompts** across all categories:
- ✅ Frontend Development (React auth, dashboards, forms)
- ✅ Backend Development (REST APIs, GraphQL, WebSocket)
- ✅ Full Stack (E-commerce, social media)
- ✅ DevOps (Docker, CI/CD, Kubernetes)
- ✅ Database (PostgreSQL schemas, complex queries)
- ✅ API Development (Authentication, Stripe payments)
- ✅ Testing (Jest, Playwright, E2E)
- ✅ Mobile (React Native apps)
- ✅ Architecture (Microservices, event-driven)
- ✅ Security (OAuth 2.0)
- ✅ Documentation (OpenAPI/Swagger)

## 🔍 Verify Setup

After running migrations and seeds:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count seeded prompts
SELECT category, COUNT(*) 
FROM public.prompts 
GROUP BY category;

-- View example prompts
SELECT title, category, views_count, likes_count 
FROM public.prompts 
ORDER BY created_at DESC 
LIMIT 10;
```

## 📝 Notes

- **auth.uid()** in seed file uses the currently authenticated user's ID
- All example prompts are marked as `is_public = true` and `is_approved = true`
- Prompts include realistic view counts and like counts for demo purposes
- You can delete example prompts later or modify them as needed

## 🛠️ Troubleshooting

**Error: "auth.uid() returned NULL"**
- Solution: Make sure you're logged in before running seed file
- Alternative: Replace `auth.uid()` with your actual user_id from auth.users table

**Error: "relation public.prompts does not exist"**
- Solution: Run migration 002_create_prompts_table.sql first

**Want to reset?**
```sql
-- Delete all prompts (careful!)
DELETE FROM public.prompts;

-- Delete all profiles (careful!)
DELETE FROM public.profiles;

-- Then re-run migrations and seeds
```
