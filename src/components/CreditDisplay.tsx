import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCredits } from '@/hooks/useCreditsSecure'

interface CreditDisplayProps {
  theme: 'light' | 'dark'
}

export default function CreditDisplay({ theme }: CreditDisplayProps) {
  const { user } = useAuth()
  const { credits, tier, loading } = useCredits()

  if (!user || loading) return null

  const isLowCredits = credits <= 2

  return (
    <Link to="/pricing">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-2 px-4 py-2 cursor-pointer border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] rounded-neo
          ${isLowCredits 
            ? 'bg-red-100 text-red-600' 
            : 'bg-neo-yellow text-black'
          }
          transition-all duration-200
        `}
      >
        <Coins 
          className={`w-4 h-4 ${isLowCredits ? 'text-red-600' : 'text-black'}`}
        />
        <span 
          className={`text-sm font-bold ${isLowCredits ? 'text-red-600' : 'text-black'}`}
        >
          {credits} credits
        </span>
        {tier !== 'free' && (
          <span className="text-xs font-bold uppercase bg-neo-pink text-white px-1.5 py-0.5 rounded">
            {tier}
          </span>
        )}
      </motion.div>
    </Link>
  )
}
