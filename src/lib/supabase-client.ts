import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check .env.local file.')
}

/**
 * Browser-only Supabase client
 * Configured with persistent sessions and auto-refresh
 * 
 * SECURITY NOTES:
 * - Only uses anon key (safe to expose to browser)
 * - Session stored in localStorage (auto-cleared on logout)
 * - Service role key NEVER used on client
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce', // More secure auth flow
  },
})
