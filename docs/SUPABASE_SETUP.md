# Supabase Setup Guide

Follow these steps to set up Supabase authentication for your Vibe Prompting application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account or log in
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Vibe Prompting (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users
   - **Pricing Plan**: Free tier is perfect to start
5. Click "Create new project"
6. Wait for the project to finish setting up (1-2 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon in the sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** - This is your `VITE_SUPABASE_URL`
   - **anon public** key - This is your `VITE_SUPABASE_ANON_KEY`
4. Copy these values to your `.env` file

## Step 3: Configure Your .env File

Open the `.env` file in the root of your project and add:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: 
- Replace the values with your actual credentials from Step 2
- Don't commit the `.env` file to Git (it's already in `.gitignore`)
- Keep your keys secure!

## Step 4: Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Configure email settings:
   - You can use Supabase's built-in email service for development
   - For production, you may want to set up a custom SMTP provider

### Email Confirmation Settings

By default, Supabase requires email confirmation. You have two options:

**Option A: Keep Email Confirmation (Recommended for Production)**
- Users will receive a confirmation email after signing up
- They must click the link to activate their account
- More secure but requires email setup

**Option B: Disable Email Confirmation (Quick Start for Development)**
1. Go to **Authentication** → **Settings** → **Auth Providers**
2. Scroll down to **Email Auth**
3. Uncheck "Enable email confirmations"
4. Click Save

## Step 5: Enable OAuth Providers (Google & GitHub)

### Google OAuth Setup

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click on it
3. Toggle **Enable Sign in with Google**
4. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**
5. Paste the Client ID and Client Secret into Supabase
6. Click Save

### GitHub OAuth Setup

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **GitHub** and click on it
3. Toggle **Enable Sign in with GitHub**
4. You'll need to create a GitHub OAuth app:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Fill in the details:
     - **Application name**: Vibe Prompting
     - **Homepage URL**: Your app URL (e.g., http://localhost:5174 for development)
     - **Authorization callback URL**: `https://your-project-id.supabase.co/auth/v1/callback`
   - Click **Register application**
   - Copy the **Client ID**
   - Generate a new **Client Secret** and copy it
5. Paste the Client ID and Client Secret into Supabase
6. Click Save

## Step 6: Set Up User Metadata

Your app stores usernames in the user metadata. This is already configured in the code:

```typescript
// When signing up, we store the username
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username: username, // This is stored in user metadata
    },
  },
})
```

To access the username later:
```typescript
const { data: { user } } = await supabase.auth.getUser()
const username = user?.user_metadata?.username
```

## Step 7: Create Database Tables (Optional for Now)

Later, you'll want to create tables for prompts, favorites, etc. For now, authentication will work without additional tables.

When you're ready, you can create tables in the **SQL Editor**:

```sql
-- Users profile table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);
```

## Step 8: Test Your Setup

1. Make sure your `.env` file has the correct credentials
2. Restart your development server:
   ```powershell
   npm run dev
   ```
3. Navigate to http://localhost:5174/signup
4. Try signing up with:
   - Email and password
   - Google OAuth
   - GitHub OAuth
5. Check the **Authentication** → **Users** section in Supabase to see your new user

## Troubleshooting

### Error: "Invalid Supabase URL or Key"
- Double-check your `.env` file has the correct values
- Make sure you've restarted the dev server after adding env vars

### Email Confirmation Not Working
- Check your email spam folder
- Consider disabling email confirmation for development (see Step 4)
- For production, set up a custom SMTP provider

### OAuth Not Working
- Verify the callback URLs match exactly
- Make sure you've enabled the provider in Supabase
- Check that Client ID and Secret are correct

### Database Connection Errors
- Wait a few minutes for your Supabase project to fully initialize
- Check your internet connection
- Verify your Supabase project is active

## Next Steps

Once authentication is working:
1. ✅ Test login, signup, and logout flows
2. ✅ Create protected routes for authenticated users
3. ✅ Build the browse prompts page
4. ✅ Create prompt submission form
5. ✅ Add favorites functionality
6. ✅ Implement admin moderation

## Security Best Practices

1. **Never commit your `.env` file**
2. **Use Row Level Security (RLS)** for all database tables
3. **Validate user input** on both client and server
4. **Use HTTPS** in production
5. **Keep your Supabase packages updated**
6. **Monitor usage** in the Supabase dashboard

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login)

## Optional: Server-side trigger to sync auth users -> public.profiles

If you prefer a server-side, automatic sync (so provider/OAuth users always get a profile row), add a Postgres function + trigger in the Supabase SQL editor. This keeps the copy logic inside the database and avoids relying on client code.

Run this in the Supabase SQL editor (adjust table name `public.profiles` if you named it differently):

```sql
-- create function to upsert profile when a new auth.user is created
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
   -- Try to insert a profile for the new auth user. If it exists, do nothing.
   insert into public.profiles (id, username, avatar_url, created_at)
   values (new.id, (new.user_metadata->>'username')::text, (new.user_metadata->>'avatar_url')::text, now())
   on conflict (id) do update set
      username = coalesce(excluded.username, public.profiles.username),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

   return new;
end;
$$ language plpgsql security definer;

-- attach trigger to auth.users (fires on insert)
create trigger on_auth_user_created
   after insert on auth.users
   for each row execute procedure public.handle_new_auth_user();
```

Notes:
- You must create the `public.profiles` table first and ensure RLS/policies allow the trigger to write (the function is created as SECURITY DEFINER to help with permissions).
- This approach guarantees that any user created in `auth.users` (including GitHub/Google provider users) will get a corresponding profile row.
