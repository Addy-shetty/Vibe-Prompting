import * as React from 'react'
import { motion } from 'framer-motion'
import { Github, Moon, Sun, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = React.useState(false)
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
      className={`fixed top-0 left-0 right-0 z-50 ${
        theme === 'dark'
          ? 'bg-black/40 border-neutral-800/50'
          : 'bg-white/80 border-neutral-200/50'
      } backdrop-blur-md border-b`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
              Vibe
            </span>
          </motion.div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/prompts">
            <motion.button
              className={`text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Prompts
            </motion.button>
          </Link>
          <Link to="/docs">
            <motion.button
              className={`text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Docs
            </motion.button>
          </Link>
        </div>

        {/* Social Icons & Auth Buttons */}
        <div className="flex items-center gap-3">
          {/* GitHub Icon */}
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 transition-colors ${
              theme === 'dark'
                ? 'text-neutral-400 hover:text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
          </motion.a>

          {/* Discord Icon */}
          <motion.a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 transition-colors ${
              theme === 'dark'
                ? 'text-neutral-400 hover:text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </motion.a>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-neutral-400 hover:text-white hover:bg-white/10'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          <div className={`hidden md:block w-px h-6 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-300'}`}></div>

          {/* Auth Buttons or User Menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
              </motion.button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-neutral-800 border border-neutral-700'
                      : 'bg-white border border-neutral-200'
                  }`}
                >
                  <Link
                    to="/prompts"
                    onClick={() => setShowUserMenu(false)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                      theme === 'dark'
                        ? 'text-neutral-300 hover:bg-white/10'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    My Prompts
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut()
                      setShowUserMenu(false)
                      navigate('/')
                    }}
                    className={`flex items-center gap-2 px-4 py-3 text-sm w-full text-left transition-colors ${
                      theme === 'dark'
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(99, 102, 241, 0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2 rounded-2xl text-sm font-medium transition-colors shadow-sm ${
                    theme === 'dark'
                      ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                      : 'bg-neutral-800 text-white hover:bg-neutral-900'
                  }`}
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
