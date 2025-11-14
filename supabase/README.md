# Supabase Configuration

## 📁 Directory Structure

```
supabase/
├── migrations/              # Database migrations
│   ├── 001_profiles.sql    # User profiles table
│   ├── 002_prompts.sql     # Prompts table with RLS
│   ├── 003_tags.sql        # Tags and tagging system
│   └── 004_credits.sql     # Credit system
├── 004_seed_awesome_prompts.sql  # Seed data
├── config.toml             # Supabase configuration
└── README.md               # This file
```

## 🚀 Quick Setup

1. **Run migrations** in order (001 → 004)
2. **Seed example prompts** (optional)
3. **Configure environment variables** in `.env`

For detailed setup instructions, see [Database Setup Guide](../docs/SUPABASE_SETUP.md)

## 🔧 Configuration

The `config.toml` file contains Supabase CLI configuration for local development.

## 📚 Documentation

- [Database Setup](../docs/SUPABASE_SETUP.md) - Complete setup guide
- [Security Implementation](../docs/SECURITY_IMPLEMENTATION_FULL.md) - RLS policies
- [Credits System](../docs/CREDITS_SYSTEM.md) - Credit system details


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
