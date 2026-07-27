import * as React from 'react'
import { motion } from 'framer-motion'
import { Github, Moon, Sun, LogOut, User, FolderOpen, MessageSquarePlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import CreditDisplay from '@/components/CreditDisplay'
import FeedbackModal from '@/components/FeedbackModal'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-noir-black/90 backdrop-blur-md border-b border-noir-yellow/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-noir-yellow flex items-center justify-center shadow-glow-yellow-sm group-hover:shadow-glow-yellow transition-shadow duration-300">
              <span className="text-noir-black font-display font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-display font-bold uppercase tracking-wider">
              <span className="text-white">Vibe</span>
              <span className="text-noir-yellow text-glow">Prompting</span>
            </span>
          </motion.div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            'Explore', 
            ...(user ? ['Dashboard'] : []),
            'Prompts', 
            'Pricing', 
            'Docs'
          ].map((item) => (
            <Link key={item} to={`/${item.toLowerCase()}`}>
              <motion.button
                className="text-sm font-display uppercase tracking-wider text-neutral-400 hover:text-noir-yellow transition-colors duration-300 relative group"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-noir-yellow group-hover:w-full transition-all duration-300 shadow-glow-yellow-sm" />
              </motion.button>
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* GitHub Icon */}
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 border border-neutral-800 bg-transparent hover:border-noir-yellow/50 hover:bg-noir-yellow/10 transition-all duration-300 group"
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-4 h-4 text-neutral-400 group-hover:text-noir-yellow transition-colors" />
          </motion.a>

          {/* Feedback Button */}
          <motion.button
            onClick={() => setShowFeedbackModal(true)}
            className="p-2.5 border border-neutral-800 bg-transparent hover:border-noir-yellow/50 hover:bg-noir-yellow/10 transition-all duration-300 group"
            whileTap={{ scale: 0.95 }}
            title="Send Feedback"
          >
            <MessageSquarePlus className="w-4 h-4 text-neutral-400 group-hover:text-noir-yellow transition-colors" />
          </motion.button>

          {/* Theme Toggle - Hidden in Tech Noir (always dark) */}
          {/* <motion.button ... /> */}

          <div className="hidden md:block w-px h-6 bg-neutral-800"></div>

          {/* Auth Buttons or User Menu */}
          {user ? (
            <>
              <CreditDisplay theme={theme} />
              <div className="relative" ref={menuRef}>
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-display uppercase tracking-wider transition-all border border-noir-yellow/50 bg-noir-yellow/10 text-noir-yellow hover:bg-noir-yellow hover:text-noir-black duration-300"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[80px] truncate font-mono text-xs">{user.email?.split('@')[0]}</span>
              </motion.button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-52 border border-neutral-800 bg-noir-black/95 backdrop-blur-md shadow-glow-yellow-sm"
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow border-b border-neutral-800 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/prompts"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow border-b border-neutral-800 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4" />
                    My Prompts
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut()
                      setShowUserMenu(false)
                      navigate('/')
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-display uppercase w-full text-left text-neutral-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 text-sm font-display uppercase tracking-wider text-neutral-400 hover:text-noir-yellow transition-colors duration-300"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 text-sm font-display uppercase tracking-wider bg-noir-yellow text-noir-black hover:shadow-glow-yellow transition-all duration-300"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </motion.nav>
  )
}
