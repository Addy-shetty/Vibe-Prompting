import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface CreditDisplayProps {
  theme: 'light' | 'dark'
}

export default function CreditDisplay({ theme }: CreditDisplayProps) {
  const { user } = useAuth()

  if (!user?.credits_remaining) return null

  const isLowCredits = user.credits_remaining <= 5

  return (
    <Link to="/pricing">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer
          ${theme === 'dark' 
            ? isLowCredits 
              ? 'bg-amber-900/30 border border-amber-500/50' 
              : 'bg-white/10 border border-white/20'
            : isLowCredits
              ? 'bg-amber-50 border border-amber-300'
              : 'bg-neutral-100 border border-neutral-300'
          }
          transition-all duration-200
        `}
      >
        <Coins 
          className={`w-4 h-4 ${
            theme === 'dark'
              ? isLowCredits ? 'text-amber-400' : 'text-yellow-400'
              : isLowCredits ? 'text-amber-600' : 'text-yellow-600'
          }`}
        />
        <span 
          className={`text-sm font-semibold ${
            theme === 'dark'
              ? isLowCredits ? 'text-amber-300' : 'text-white'
              : isLowCredits ? 'text-amber-700' : 'text-neutral-900'
          }`}
        >
          {user.credits_remaining}
        </span>
        {isLowCredits && (
          <span className="text-xs text-amber-500 font-medium">
            Low!
          </span>
        )}
      </motion.div>
    </Link>
  )
}
