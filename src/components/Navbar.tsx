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
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b-3 border-black shadow-neo"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 bg-neo-black flex items-center justify-center border-3 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <span className="text-white font-black text-2xl">V</span>
            </div>
            <span className="text-2xl font-black uppercase text-black tracking-tighter">
              Vibe<span className="text-neo-blue">Prompting</span>
            </span>
          </motion.div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            'Explore', 
            ...(user ? ['Dashboard'] : []),
            'Prompts', 
            'Pricing', 
            'Docs'
          ].map((item) => (
            <Link key={item} to={`/${item.toLowerCase()}`}>
              <motion.button
                className="text-sm font-black uppercase text-black hover:text-neo-pink hover:underline decoration-3 underline-offset-8 transition-all relative"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
              >
                {item}
              </motion.button>
            </Link>
          ))}
        </div>

        {/* Social Icons & Auth Buttons */}
        <div className="flex items-center gap-3">
          {/* GitHub Icon */}
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border-3 border-black bg-white hover:bg-neo-green transition-all shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] duration-150"
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5 text-black" />
          </motion.a>

          {/* Feedback Button */}
          <motion.button
            onClick={() => setShowFeedbackModal(true)}
            className="p-3 border-3 border-black bg-white hover:bg-neo-pink hover:text-white transition-all shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] duration-150 group"
            whileTap={{ scale: 0.95 }}
            title="Send Feedback"
          >
            <MessageSquarePlus className="w-5 h-5 text-black group-hover:text-white" />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-3 border-3 border-black bg-white hover:bg-neo-sunshine transition-all shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] duration-150"
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-black" /> : <Moon className="w-5 h-5 text-black" />}
          </motion.button>

          <div className="hidden md:block w-1 h-8 bg-neo-black"></div>

          {/* Auth Buttons or User Menu */}
          {user ? (
            <>
              <CreditDisplay theme={theme} />
              <div className="relative" ref={menuRef}>
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-3 text-sm font-black uppercase transition-all border-3 border-neo-black bg-neo-yellow shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] duration-150"
              >
                <User className="w-5 h-5" />
                <span className="max-w-[100px] truncate font-mono">{user.email?.split('@')[0]}</span>
              </motion.button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-52 border-3 border-neo-black bg-white shadow-neo-lg"
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-5 py-4 text-sm font-black font-mono uppercase text-neo-black hover:bg-neo-blue hover:text-white border-b-3 border-neo-black transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/prompts"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-5 py-4 text-sm font-black font-mono uppercase text-neo-black hover:bg-neo-green hover:text-black border-b-3 border-neo-black transition-colors"
                  >
                    <FolderOpen className="w-5 h-5" />
                    My Prompts
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut()
                      setShowUserMenu(false)
                      navigate('/')
                    }}
                    className="flex items-center gap-3 px-5 py-4 text-sm font-black font-mono uppercase w-full text-left text-neo-black hover:bg-neo-pink hover:text-white transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
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
                  className="px-5 py-3 text-sm font-black font-mono uppercase text-neo-black hover:underline decoration-3 underline-offset-4"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 text-sm font-black uppercase transition-all border-3 border-neo-black bg-neo-pink text-white shadow-neo hover:bg-neo-blue hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] duration-150"
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
