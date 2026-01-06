import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface CreditData {
  credits: number
  tier: string
  loading: boolean
  error: string | null
}

/**
 * Read-only hook for fetching user credits
 * Tries RPC function first, falls back to direct query
 */
export function useCredits() {
  const { user } = useAuth()
  const [creditData, setCreditData] = useState<CreditData>({
    credits: 0,
    tier: 'free',
    loading: true,
    error: null,
  })

  const fetchCredits = async () => {
    if (!user) {
      setCreditData({ credits: 0, tier: 'free', loading: false, error: null })
      return
    }

    try {
      setCreditData((prev) => ({ ...prev, loading: true, error: null }))

      // Try RPC function first
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_credits', {
        p_user_id: user.id,
      })

      if (!rpcError && rpcData?.success) {
        setCreditData({
          credits: rpcData.credits ?? 0,
          tier: rpcData.tier ?? 'free',
          loading: false,
          error: null,
        })
        return
      }

      // Fallback: Direct query to profiles table
      console.warn('RPC failed, falling back to direct query:', rpcError?.message)
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('credits, tier')
        .eq('id', user.id)
        .single()

      if (profileError) {
        // If profile doesn't exist or no credits column, use defaults
        console.warn('Profile query failed:', profileError.message)
        setCreditData({
          credits: 10, // Default credits
          tier: 'free',
          loading: false,
          error: null,
        })
        return
      }

      setCreditData({
        credits: profileData?.credits ?? 10,
        tier: profileData?.tier ?? 'free',
        loading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error fetching credits:', err)
      // Don't show error to user, just use defaults
      setCreditData({
        credits: 10,
        tier: 'free',
        loading: false,
        error: null,
      })
    }
  }

  useEffect(() => {
    fetchCredits()

    // Subscribe to profile changes for real-time updates
    if (!user?.id) return

    const subscription = supabase
      .channel('credit_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setCreditData((prev) => ({
            ...prev,
            credits: payload.new.credits ?? prev.credits,
            tier: payload.new.tier ?? prev.tier,
          }))
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.id])

  return {
    credits: creditData.credits,
    tier: creditData.tier,
    loading: creditData.loading,
    error: creditData.error,
    refetch: fetchCredits,
  }
}
