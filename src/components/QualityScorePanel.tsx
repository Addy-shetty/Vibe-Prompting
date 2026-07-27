import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Rocket, BarChart3 } from 'lucide-react'
import type { DashboardStats } from '@/hooks/useDashboardStats'

interface QualityScorePanelProps {
  stats: DashboardStats
}

function scoreColor(score: number): string {
  if (score >= 0.80) return 'text-green-400'
  if (score >= 0.60) return 'text-noir-yellow'
  return 'text-red-400'
}

function scoreBg(score: number): string {
  if (score >= 0.80) return 'bg-green-400'
  if (score >= 0.60) return 'bg-noir-yellow'
  return 'bg-red-400'
}

function scoreBorder(score: number): string {
  if (score >= 0.80) return 'border-green-500/30'
  if (score >= 0.60) return 'border-noir-yellow/30'
  return 'border-red-500/30'
}

export default function QualityScorePanel({ stats }: QualityScorePanelProps) {
  const { avgQuality, qualityTrend, bestCategory, qualityBreakdown, totalGenerations } = stats
  const hasData = totalGenerations > 0
  const pct = Math.round(avgQuality * 100)

  if (!hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border-2 border-dashed border-noir-gray p-8 text-center"
      >
        <Rocket className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
        <h3 className="text-lg font-black uppercase text-neutral-400 mb-2">Quality Analytics</h3>
        <p className="text-sm font-mono text-neutral-500">
          Generate prompts to unlock quality analytics and track your improvement over time.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border-2 border-noir-gray bg-noir-dark/50 overflow-hidden"
    >
      {/* Top: Score + Trend + Best Category */}
      <div className="flex flex-col md:flex-row">
        {/* Score */}
        <div className={`flex-1 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r ${scoreBorder(avgQuality)}`}>
          <div className={`text-6xl font-black ${scoreColor(avgQuality)} mb-2`}>
            {pct}%
          </div>
          <div className="flex items-center gap-1 text-sm font-mono text-neutral-400">
            {qualityTrend === 'improving' && <TrendingUp className="w-4 h-4 text-green-400" />}
            {qualityTrend === 'declining' && <TrendingDown className="w-4 h-4 text-red-400" />}
            {qualityTrend === 'stable' && <Minus className="w-4 h-4 text-noir-yellow" />}
            <span>
              {qualityTrend === 'improving' ? 'Improving' :
               qualityTrend === 'declining' ? 'Declining' :
               qualityTrend === 'stable' ? 'Stable' : '—'}
            </span>
          </div>
          <div className="text-xs font-mono text-neutral-500 mt-1">Overall Quality</div>
        </div>

        {/* Best Category */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <BarChart3 className={`w-8 h-8 ${scoreColor(avgQuality)} mb-2`} />
          <div className={`text-2xl font-black uppercase ${scoreColor(avgQuality)}`}>
            {bestCategory || 'general'}
          </div>
          <div className="text-xs font-mono text-neutral-500 mt-1">Best Category</div>
          <div className="text-xs font-mono text-neutral-600 mt-0.5">
            Based on {totalGenerations} evaluations
          </div>
        </div>
      </div>

      {/* Bottom: Category Breakdown Bars */}
      {qualityBreakdown.length > 0 && (
        <div className="border-t border-noir-gray p-6">
          <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4 tracking-wider">Top Categories</h4>
          <div className="space-y-3">
            {qualityBreakdown.map((cat, i) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3"
              >
                <span className="w-20 text-xs font-mono text-neutral-400 truncate">{cat.category}</span>
                <div className="flex-1 h-4 bg-noir-dark rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(cat.score * 100)}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${scoreBg(cat.score)}`}
                  />
                </div>
                <span className={`w-10 text-right text-xs font-mono font-bold ${scoreColor(cat.score)}`}>
                  {Math.round(cat.score * 100)}%
                </span>
                <span className="w-6 text-right text-xs font-mono text-neutral-600">{cat.count}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
