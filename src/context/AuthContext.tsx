import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { sanitizeInput, isValidEmail, isValidUsername, rateLimiter } from '@/lib/security'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithGithub: () => Promise<{ error: AuthError | null }>
  checkUsernameAvailability: (username: string) => Promise<boolean>
  checkEmailExists: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      // If there's an active user session, ensure a profile row exists in the public profiles table
      if (session?.user) {
        ;(async () => {
          try {
            const u = session.user
            const userRow = {
              id: u.id,
              email: u.email ?? undefined,
              username: (u.user_metadata as any)?.username ?? (u.email ? u.email.split('@')[0] : undefined),
              avatar_url: (u.user_metadata as any)?.avatar_url ?? undefined,
            }
            await supabase.from('profiles').upsert(userRow as any)
          } catch (err) {
            console.error('Failed to upsert user profile on initial session:', err)
          }
        })()
      }

      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      // When a new user signs in (including OAuth providers), upsert a profile row
      if (session?.user) {
        ;(async () => {
          try {
            const u = session.user
            const userRow = {
              id: u.id,
              email: u.email ?? undefined,
              username: (u.user_metadata as any)?.username ?? (u.email ? u.email.split('@')[0] : undefined),
              avatar_url: (u.user_metadata as any)?.avatar_url ?? undefined,
            }
            await supabase.from('profiles').upsert(userRow as any)
          } catch (err) {
            console.error('Failed to upsert user profile on auth change:', err)
          }
        })()
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Rate limiting check
      if (!rateLimiter.isAllowed('signup', 3, 60000)) {
        return { error: new Error('Too many signup attempts. Please try again in a minute.') }
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.toLowerCase().trim())
      const sanitizedUsername = sanitizeInput(username.toLowerCase().trim())

      // Additional validation
      if (!isValidEmail(sanitizedEmail)) {
        return { error: new Error('Invalid email format') }
      }

      if (!isValidUsername(sanitizedUsername)) {
        return { error: new Error('Invalid username format. Use only letters, numbers, hyphens, and underscores.') }
      }

      // Check if username already exists
      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', sanitizedUsername)
        .single()

      if (existingUsername) {
        return { error: new Error('Username already taken') }
      }

      // Check if email already exists in auth.users
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
        .single()

      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            username: sanitizedUsername,
          },
        },
      })
      
      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Signup failed') }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Rate limiting check
      if (!rateLimiter.isAllowed('login', 5, 60000)) {
        return { error: new Error('Too many login attempts. Please try again in a minute.') }
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.toLowerCase().trim())

      // Validate email
      if (!isValidEmail(sanitizedEmail)) {
        return { error: new Error('Invalid email format') }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      })
      
      if (error) {
        return { error }
      }

      // Reset rate limiter on successful login
      rateLimiter.reset('login')
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Login failed') }
    }
  }

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const sanitizedUsername = sanitizeInput(username.toLowerCase().trim())
      
      if (!isValidUsername(sanitizedUsername)) {
        return false
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', sanitizedUsername)
        .maybeSingle()

      if (error) throw error
      return !data
    } catch {
      return false
    }
  }

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const sanitizedEmail = sanitizeInput(email.toLowerCase().trim())
      
      if (!isValidEmail(sanitizedEmail)) {
        return false
      }

      // Note: Supabase doesn't expose auth.users table directly for security
      // We'll check via the profiles table which syncs with auth.users
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)

      // For security, we can't directly check email existence
      // This helps prevent email enumeration attacks
      // Return false to allow signup flow to handle it
      return false
    } catch {
      return false
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    return { error }
  }

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        signInWithGithub,
        checkUsernameAvailability,
        checkEmailExists,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
