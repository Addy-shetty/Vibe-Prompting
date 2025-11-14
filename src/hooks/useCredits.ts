import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface AnonymousLimits {
  generations: number
  views: number
  lastUpdated: string
}

interface UserCredits {
  creditsRemaining: number
  totalCreditsUsed: number
}

const ANONYMOUS_STORAGE_KEY = 'vibe_anonymous_limits'
const MAX_ANONYMOUS_GENERATIONS = 3
const MAX_ANONYMOUS_VIEWS = 3

export function useCredits() {
  const { user } = useAuth()
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [loading, setLoading] = useState(true)

  // Get anonymous limits from localStorage
  const getAnonymousLimits = (): AnonymousLimits => {
    const stored = localStorage.getItem(ANONYMOUS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return { generations: 0, views: 0, lastUpdated: new Date().toISOString() }
  }

  // Save anonymous limits to localStorage
  const saveAnonymousLimits = (limits: AnonymousLimits) => {
    localStorage.setItem(ANONYMOUS_STORAGE_KEY, JSON.stringify(limits))
  }

  // Check if anonymous user can generate
  const canAnonymousGenerate = (): boolean => {
    const limits = getAnonymousLimits()
    return limits.generations < MAX_ANONYMOUS_GENERATIONS
  }

  // Check if anonymous user can view prompts
  const canAnonymousView = (): boolean => {
    const limits = getAnonymousLimits()
    return limits.views < MAX_ANONYMOUS_VIEWS
  }

  // Get remaining anonymous generations
  const getAnonymousGenerationsLeft = (): number => {
    const limits = getAnonymousLimits()
    return Math.max(0, MAX_ANONYMOUS_GENERATIONS - limits.generations)
  }

  // Get remaining anonymous views
  const getAnonymousViewsLeft = (): number => {
    const limits = getAnonymousLimits()
    return Math.max(0, MAX_ANONYMOUS_VIEWS - limits.views)
  }

  // Increment anonymous generation count
  const incrementAnonymousGeneration = () => {
    const limits = getAnonymousLimits()
    limits.generations += 1
    limits.lastUpdated = new Date().toISOString()
    saveAnonymousLimits(limits)
  }

  // Increment anonymous view count
  const incrementAnonymousView = () => {
    const limits = getAnonymousLimits()
    limits.views += 1
    limits.lastUpdated = new Date().toISOString()
    saveAnonymousLimits(limits)
  }

  // Fetch user credits from database
  const fetchUserCredits = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining, total_credits_used')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching credits:', error)
        setCredits(null)
      } else {
        setCredits({
          creditsRemaining: data.credits_remaining,
          totalCreditsUsed: data.total_credits_used,
        })
      }
    } catch (error) {
      console.error('Error in fetchUserCredits:', error)
      setCredits(null)
    } finally {
      setLoading(false)
    }
  }

  // Deduct one credit from user account
  const deductCredit = async (): Promise<boolean> => {
    if (!user) {
      // Anonymous user - check localStorage
      if (!canAnonymousGenerate()) {
        return false
      }
      incrementAnonymousGeneration()
      return true
    }

    // Logged-in user - call database function
    try {
      const { data, error } = await supabase.rpc('deduct_credit', {
        p_user_id: user.id,
      })

      if (error) {
        console.error('Error deducting credit:', error)
        return false
      }

      if (data) {
        // Refresh credits
        await fetchUserCredits()
        return true
      }

      return false
    } catch (error) {
      console.error('Error in deductCredit:', error)
      return false
    }
  }

  // Check if user has credits to generate
  const hasCredits = (): boolean => {
    if (!user) {
      return canAnonymousGenerate()
    }
    return credits ? credits.creditsRemaining > 0 : false
  }

  // Get remaining credits count
  const getCreditsRemaining = (): number => {
    if (!user) {
      return getAnonymousGenerationsLeft()
    }
    return credits ? credits.creditsRemaining : 0
  }

  // Clear anonymous limits on login
  useEffect(() => {
    if (user) {
      // User logged in, clear anonymous tracking
      localStorage.removeItem(ANONYMOUS_STORAGE_KEY)
      fetchUserCredits()
    } else {
      setLoading(false)
    }
  }, [user])

  return {
    // User credits (logged-in)
    credits,
    loading,
    
    // Actions
    deductCredit,
    hasCredits,
    getCreditsRemaining,
    refetchCredits: fetchUserCredits,
    
    // Anonymous limits
    canAnonymousGenerate,
    canAnonymousView,
    getAnonymousGenerationsLeft,
    getAnonymousViewsLeft,
    incrementAnonymousView,
  }
}
