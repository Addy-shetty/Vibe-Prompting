import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface SplitFlapTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  duration?: number
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '

export default function SplitFlapText({ 
  text, 
  className = '', 
  delay = 0,
  stagger = 0.05,
  duration = 0.8
}: SplitFlapTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayChars, setDisplayChars] = useState<string[]>(
    Array(text.length).fill(' ')
  )
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const targetChars = text.toUpperCase().split('')
    const timeouts: NodeJS.Timeout[] = []
    
    targetChars.forEach((targetChar, charIndex) => {
      const charDelay = delay * 1000 + charIndex * stagger * 1000
      
      // Start flipping this character
      const startTimeout = setTimeout(() => {
        let iterations = 0
        const maxIterations = 8 + Math.floor(Math.random() * 4)
        
        const flipInterval = setInterval(() => {
          iterations++
          
          setDisplayChars(prev => {
            const newChars = [...prev]
            if (iterations >= maxIterations) {
              newChars[charIndex] = targetChar
            } else {
              // Random character during flip
              newChars[charIndex] = CHARS[Math.floor(Math.random() * CHARS.length)]
            }
            return newChars
          })
          
          if (iterations >= maxIterations) {
            clearInterval(flipInterval)
            
            // Check if all characters are done
            if (charIndex === targetChars.length - 1) {
              setIsComplete(true)
            }
          }
        }, 50)
        
      }, charDelay)
      
      timeouts.push(startTimeout)
    })
    
    return () => {
      timeouts.forEach(t => clearTimeout(t))
    }
  }, [text, delay, stagger])

  return (
    <span 
      ref={containerRef} 
      className={`inline-block ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {displayChars.map((char, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            minWidth: char === ' ' ? '0.3em' : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
