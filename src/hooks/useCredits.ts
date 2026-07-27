import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface CreditData {
  credits: number
  creditsUsedTotal: number
  tier: string
  loading: boolean
  error: string | null
}

/**
 * Hook for fetching and managing user credits
 * Uses the new v3 secure schema
 */
export function useCredits() {
  const { user } = useAuth()
  const [creditData, setCreditData] = useState<CreditData>({
    credits: 0,
    creditsUsedTotal: 0,
    tier: 'free',
    loading: true,
    error: null,
  })

  const fetchCredits = async () => {
    if (!user) {
      setCreditData({ credits: 0, creditsUsedTotal: 0, tier: 'free', loading: false, error: null })
      return
    }

    try {
      setCreditData((prev) => ({ ...prev, loading: true, error: null }))

      // Use the new v3 RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_credits_v3', {
        p_user_id: user.id,
      })

      if (!rpcError && rpcData?.success) {
        setCreditData({
          credits: rpcData.credits ?? 0,
          creditsUsedTotal: rpcData.credits_used_total ?? 0,
          tier: rpcData.tier ?? 'free',
          loading: false,
          error: null,
        })
        return
      }

      // Fallback: Direct query to new table
      console.warn('RPC failed, falling back to direct query:', rpcError?.message)
      
      const { data: creditRow, error: creditError } = await supabase
        .from('user_credits_v3')
        .select('credits, credits_used_total')
        .eq('user_id', user.id)
        .single()

      if (creditError) {
        // If no record exists, user gets default credits (trigger should handle this)
        console.warn('Credits query failed:', creditError.message)
        setCreditData({
          credits: 10, // Default fallback
          creditsUsedTotal: 0,
          tier: 'free',
          loading: false,
          error: null,
        })
        return
      }

      setCreditData({
        credits: creditRow?.credits ?? 10,
        creditsUsedTotal: creditRow?.credits_used_total ?? 0,
        tier: 'free',
        loading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error fetching credits:', err)
      setCreditData({
        credits: 10,
        creditsUsedTotal: 0,
        tier: 'free',
        loading: false,
        error: null,
      })
    }
  }

  useEffect(() => {
    fetchCredits()

    // Subscribe to profile changes for real-time credit updates
    if (!user?.id) return

    const subscription = supabase
      .channel('credit_updates_v3')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_credits_v3',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setCreditData((prev) => ({
            ...prev,
            credits: payload.new.credits ?? prev.credits,
            creditsUsedTotal: payload.new.credits_used_total ?? prev.creditsUsedTotal,
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
    creditsUsedTotal: creditData.creditsUsedTotal,
    tier: creditData.tier,
    loading: creditData.loading,
    error: creditData.error,
    refetch: fetchCredits,
  }
}

/**
 * Get credit transaction history
 */
export async function getCreditTransactions(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching credit transactions:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
