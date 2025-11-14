import React from 'react'
import { motion } from 'framer-motion'
import { checkPasswordStrength } from '@/lib/security'
import { useTheme } from '@/context/ThemeContext'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthProps) {
  const { theme } = useTheme()
  const strength = checkPasswordStrength(password)

  if (!password) return null

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ]

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: index <= strength.score ? 1 : 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`h-1 flex-1 rounded-full ${
              index <= strength.score
                ? strengthColors[strength.score]
                : theme === 'dark'
                ? 'bg-neutral-700'
                : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between text-xs">
        <span
          className={
            strength.score <= 1
              ? 'text-red-500'
              : strength.score <= 2
              ? 'text-yellow-500'
              : strength.score <= 3
              ? 'text-blue-500'
              : 'text-green-500'
          }
        >
          {strengthLabels[strength.score]}
        </span>
        <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>
          {password.length}/25
        </span>
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs space-y-1 ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          {strength.feedback.map((item, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-red-500 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
