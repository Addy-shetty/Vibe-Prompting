import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Moon, Sun, LogOut, User, FolderOpen, MessageSquarePlus, Menu, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import CreditDisplay from '@/components/CreditDisplay'
import FeedbackModal from '@/components/FeedbackModal'

// ── Guest links (shown to anonymous visitors) ──
const GUEST_LINKS = [
  { label: 'Explore', to: '/explore' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Docs', to: '/docs' },
]

// ── Authenticated links (shown to logged-in users) ──
const AUTH_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Generate', to: '/generate', highlight: true },
  { label: 'My Prompts', to: '/prompts' },
  { label: 'Explore', to: '/explore' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const links = user ? AUTH_LINKS : GUEST_LINKS

  // Close user menu when clicking outside
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

  // Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [mobileOpen])

  // Close mobile drawer on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    if (mobileOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  const handleHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault()
    closeMobile()
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 h-16 min-h-[64px] bg-noir-black/90 backdrop-blur-md border-b border-noir-yellow/20"
      >
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link to={user ? '/dashboard' : '/'}>
            <motion.div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-noir-yellow flex items-center justify-center shadow-glow-yellow-sm group-hover:shadow-glow-yellow transition-shadow duration-300">
                <span className="text-noir-black font-display font-bold text-lg sm:text-xl">V</span>
              </div>
              <span className="hidden sm:inline text-base sm:text-lg lg:text-xl font-display font-bold uppercase tracking-wider text-white">
                Vibe
              </span>
            </motion.div>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {links.map((item) => {
              const isActive = location.pathname === item.to
              return item.label === 'How It Works' ? (
                <a
                  key={item.label}
                  href="/#how-it-works"
                  onClick={handleHowItWorks}
                  className="text-sm font-display uppercase tracking-wider text-neutral-400 hover:text-noir-yellow transition-colors duration-300 relative group"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.to}>
                  <motion.button
                    className={`text-sm font-display uppercase tracking-wider transition-colors duration-300 relative group ${
                      isActive
                        ? 'text-noir-yellow'
                        : item.highlight
                          ? 'text-noir-yellow/80 hover:text-noir-yellow font-bold'
                          : 'text-neutral-400 hover:text-noir-yellow'
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-noir-yellow"
                        layoutId="nav-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </Link>
              )
            })}
          </div>

          {/* ── Right Section ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* Credits badge */}
                <div className="hidden sm:block">
                  <CreditDisplay />
                </div>

                {/* Avatar + Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-transparent hover:border-noir-gray/50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-noir-yellow/20 border border-noir-yellow/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-noir-yellow" />
                    </div>
                  </button>

                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-noir-black border border-noir-gray rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <Link to="/settings" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow border-b border-neutral-800 transition-colors">
                        <User className="w-4 h-4" /> Settings
                      </Link>
                      <Link to="/docs" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow border-b border-neutral-800 transition-colors">
                        <FolderOpen className="w-4 h-4" /> Help & Docs
                      </Link>
                      <button onClick={() => { setShowUserMenu(false); setShowFeedbackModal(true) }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow border-b border-neutral-800 transition-colors">
                        <MessageSquarePlus className="w-4 h-4" /> Send Feedback
                      </button>
                      <button onClick={() => { setShowUserMenu(false); toggleTheme() }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow border-b border-neutral-800 transition-colors">
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        Toggle Theme
                      </button>
                      <div className="border-b border-neutral-800" />
                      <button onClick={() => { setShowUserMenu(false); signOut() }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-display uppercase w-full text-left text-neutral-300 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="hidden sm:inline px-3 py-2 text-sm font-display uppercase tracking-wider text-neutral-400 hover:text-noir-yellow transition-colors duration-300">
                  Sign In
                </Link>
                <Link to="/signup"
                  className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-display font-bold uppercase tracking-wider bg-noir-yellow text-noir-black hover:shadow-glow-yellow transition-all duration-300 rounded-lg">
                  <span className="hidden xs:inline">Start Free</span>
                  <span className="xs:hidden">Free</span>
                </Link>
              </>
            )}

            {/* ── Hamburger (mobile) ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden ml-1 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-noir-dark/50 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-noir-black border-l border-noir-gray z-40 lg:hidden overflow-y-auto"
            >
              <div className="pt-20 px-4">
                {!user && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-noir-yellow/5 border border-noir-yellow/10">
                    <Link to="/signup" onClick={closeMobile}
                      className="block w-full py-3 bg-noir-yellow text-noir-black text-center font-display font-bold uppercase tracking-wider text-sm rounded-lg mb-2">
                      Start Free
                    </Link>
                    <Link to="/login" onClick={closeMobile}
                      className="block w-full py-2.5 text-center font-display uppercase tracking-wider text-sm text-neutral-400 hover:text-white transition-colors">
                      Sign In
                    </Link>
                  </div>
                )}

                <nav className="space-y-1">
                  {links.map((item) => {
                    const isActive = location.pathname === item.to
                    return item.label === 'How It Works' ? (
                      <a key={item.label} href="/#how-it-works" onClick={handleHowItWorks}
                        className="flex items-center px-4 py-3 rounded-lg text-base font-display uppercase tracking-wider text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow transition-colors">
                        {item.label}
                      </a>
                    ) : (
                      <Link key={item.label} to={item.to} onClick={closeMobile}
                        className={`flex items-center px-4 py-3 rounded-lg text-base font-display uppercase tracking-wider transition-colors ${
                          isActive
                            ? 'bg-noir-yellow/10 text-noir-yellow border-l-4 border-noir-yellow'
                            : item.highlight
                              ? 'text-noir-yellow/80 hover:text-noir-yellow hover:bg-noir-dark/50 font-bold'
                              : 'text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow'
                        }`}>
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                <div className="border-t border-noir-gray my-4" />

                {user ? (
                  <div className="space-y-1 pb-8">
                    <Link to="/settings" onClick={closeMobile}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow rounded-lg transition-colors">
                      <User className="w-4 h-4" /> Settings
                    </Link>
                    <Link to="/docs" onClick={closeMobile}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow rounded-lg transition-colors">
                      <FolderOpen className="w-4 h-4" /> Help & Docs
                    </Link>
                    <button onClick={() => { closeMobile(); setShowFeedbackModal(true) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow rounded-lg transition-colors">
                      <MessageSquarePlus className="w-4 h-4" /> Send Feedback
                    </button>
                    <button onClick={() => { closeMobile(); toggleTheme() }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow rounded-lg transition-colors">
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      Toggle Theme
                    </button>
                    <div className="border-t border-noir-gray my-3" />
                    <button onClick={() => { closeMobile(); signOut() }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-display uppercase text-left text-neutral-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="pb-8">
                    <Link to="/login" onClick={closeMobile}
                      className="flex items-center px-4 py-3 rounded-lg text-base font-display uppercase tracking-wider text-neutral-300 hover:bg-noir-yellow/10 hover:text-noir-yellow transition-colors">
                      Sign In
                    </Link>
                    <Link to="/signup" onClick={closeMobile}
                      className="flex items-center px-4 py-3 rounded-lg text-base font-display uppercase tracking-wider text-noir-yellow hover:bg-noir-yellow/10 transition-colors font-bold">
                      Start Free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </>
  )
}
