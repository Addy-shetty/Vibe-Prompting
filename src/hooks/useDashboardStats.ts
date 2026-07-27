import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export interface DashboardStats {
  totalGenerations: number
  avgQuality: number
  bestCategory: string
  totalSaved: number
  creditsRemaining: number
  qualityTrend: 'improving' | 'declining' | 'stable' | null
  qualityBreakdown: Array<{ category: string; score: number; count: number }>
}

const DEFAULT_STATS: DashboardStats = {
  totalGenerations: 0,
  avgQuality: 0,
  bestCategory: '',
  totalSaved: 0,
  creditsRemaining: 0,
  qualityTrend: null,
  qualityBreakdown: [],
}

export function useDashboardStats() {
  const { user } = useAuth()

  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      if (!user) return DEFAULT_STATS

      try {
        // Fetch user prompt stats from view
        const { data: statsData } = await supabase
          .from('user_prompt_stats')
          .select('total_generations, avg_quality, best_category, credits_remaining')
          .eq('user_id', user.id)
          .single()

        // Fetch saved prompts count
        const { count: savedCount } = await supabase
          .from('prompts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // Fetch quality breakdown by category
        const { data: breakdownData } = await supabase
          .from('prompts')
          .select('category, quality_score')
          .eq('user_id', user.id)
          .not('quality_score', 'is', null)

        // Calculate per-category quality
        const catMap = new Map<string, { total: number; count: number }>()
        if (breakdownData) {
          for (const p of breakdownData) {
            const cat = p.category || 'general'
            const existing = catMap.get(cat) || { total: 0, count: 0 }
            existing.total += p.quality_score
            existing.count++
            catMap.set(cat, existing)
          }
        }

        const qualityBreakdown = Array.from(catMap.entries())
          .map(([cat, v]) => ({
            category: cat,
            score: Math.round((v.total / v.count) * 100) / 100,
            count: v.count,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)

        // Calculate quality trend
        let qualityTrend: DashboardStats['qualityTrend'] = null
        if (statsData && statsData.total_generations >= 3) {
          // Use avg_quality from view
          const recentAvg = statsData.avg_quality ?? 0
          // If avg_quality >= 0.70, it's improving; below 0.50 is declining
          if (recentAvg >= 0.70) qualityTrend = 'improving'
          else if (recentAvg < 0.50 && recentAvg > 0) qualityTrend = 'declining'
          else if (recentAvg > 0) qualityTrend = 'stable'
        }

        return {
          totalGenerations: statsData?.total_generations ?? 0,
          avgQuality: statsData?.avg_quality ?? 0,
          bestCategory: statsData?.best_category ?? '',
          totalSaved: savedCount ?? 0,
          creditsRemaining: statsData?.credits_remaining ?? 0,
          qualityTrend,
          qualityBreakdown,
        }
      } catch {
        return DEFAULT_STATS
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    enabled: !!user,
  })
}
