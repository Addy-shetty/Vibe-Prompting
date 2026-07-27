import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// ── Loading Skeleton ──
interface SkeletonProps {
  variant: 'card' | 'line' | 'stats'
  count?: number
}

export function LoadingSkeleton({ variant, count = 1 }: SkeletonProps) {
  if (variant === 'stats') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-lg bg-noir-dark/30 border border-noir-gray animate-pulse"
          >
            <div className="h-8 w-16 bg-noir-dark/50 rounded mb-2" />
            <div className="h-3 w-20 bg-noir-dark/50 rounded" />
            <div className="h-2 w-14 bg-noir-dark/50 rounded mt-1" />
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-noir-gray bg-noir-dark/30 p-6 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-noir-dark/50" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-noir-dark/50 rounded mb-2" />
                <div className="h-3 w-16 bg-noir-dark/50 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-noir-dark/50 rounded" />
              <div className="h-3 w-3/4 bg-noir-dark/50 rounded" />
              <div className="h-3 w-1/2 bg-noir-dark/50 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // line variant
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-noir-dark/30 border border-noir-gray animate-pulse"
        >
          <div className="w-8 h-8 rounded-full bg-noir-dark/50 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-noir-dark/50 rounded" style={{ width: `${40 + Math.random() * 50}%` }} />
            <div className="h-3 bg-noir-dark/50 rounded" style={{ width: `${25 + Math.random() * 35}%` }} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Empty State ──
interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 md:p-12 rounded-xl border-2 border-dashed border-noir-gray text-center"
    >
      <Icon className="w-12 h-12 text-neutral-600 mb-4" />
      <h3 className="text-lg font-black uppercase text-neutral-400 mb-2">{title}</h3>
      <p className="text-sm font-mono text-neutral-500 mb-6 max-w-md">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="px-4 py-2 bg-noir-yellow/10 border border-noir-yellow/20 text-noir-yellow text-sm font-bold uppercase rounded-lg hover:bg-noir-yellow/20 transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  )
}

// ── Error State ──
interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 md:p-12 rounded-xl border-2 border-red-500/30 bg-red-500/5 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <span className="text-red-400 text-2xl font-black">!</span>
      </div>
      <h3 className="text-lg font-black uppercase text-red-400 mb-2">Something went wrong</h3>
      <p className="text-sm font-mono text-neutral-400 mb-6 max-w-md">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold uppercase rounded-lg hover:bg-red-500/20 transition-all"
        >
          Try Again
        </button>
      )}
    </motion.div>
  )
}
