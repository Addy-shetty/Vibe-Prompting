import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  Terminal, FolderOpen, Zap, ArrowRight, Clock, Plus,
  BarChart3, BookOpen, Rocket, Search, Settings, LogOut,
  HelpCircle, LayoutDashboard, FileText, Menu, X, TrendingUp,
  Shield, Palette
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCredits } from '@/hooks/useCreditsSecure'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { supabase } from '@/lib/supabase'
import QualityScorePanel from '@/components/QualityScorePanel'
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/StateComponents'

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: FileText, label: 'Generate', to: '/generate' },
  { icon: FolderOpen, label: 'My Prompts', to: '/prompts' },
  { icon: Search, label: 'Explore', to: '/explore' },
  { icon: Settings, label: 'Settings', to: '/settings' },
]

const SIDEBAR_BOTTOM = [
  { icon: HelpCircle, label: 'Help & Docs', to: '/docs' },
]

// ── Relative time helper ──
function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { credits } = useCredits()
  const { data: stats, isLoading, error, refetch } = useDashboardStats()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recentPrompts, setRecentPrompts] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  const username = (user?.user_metadata as any)?.username || user?.email?.split('@')[0] || 'User'

  // Fetch recent activity
  useEffect(() => {
    if (!user) return
    setActivityLoading(true)
    supabase
      .from('prompts')
      .select('id, title, created_at, tier_used')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setRecentPrompts(data || [])
        setActivityLoading(false)
      })
  }, [user])

  const maxCredits = 100 // Pro tier default; override based on actual tier
  const creditPct = Math.min((credits / maxCredits) * 100, 100)
  const creditBarColor = creditPct < 25 ? 'bg-noir-yellow' : creditPct < 75 ? 'bg-green-500' : 'bg-noir-purple'

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (sidebarOpen) { document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = '' }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="flex min-h-screen pt-16">
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col w-60 border-r border-noir-gray bg-noir-black/80 backdrop-blur-sm fixed top-16 bottom-0 left-0 z-20"
      >
        <nav className="flex-1 py-6 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((si) => {
            const isActive = location.pathname === si.to
            return (
              <Link key={si.label} to={si.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-noir-yellow/10 text-noir-yellow border-l-4 border-noir-yellow -ml-[1px]'
                    : 'text-neutral-400 hover:text-white hover:bg-noir-dark/50'
                }`}>
                <si.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{si.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-noir-gray py-4 px-3 space-y-1">
          {SIDEBAR_BOTTOM.map((si) => (
            <Link key={si.label} to={si.to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-neutral-400 hover:text-white hover:bg-noir-dark/50 transition-all">
              <si.icon className="w-5 h-5 flex-shrink-0" /> <span>{si.label}</span>
            </Link>
          ))}
          <button onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" /> <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* ── Mobile Sidebar Hamburger ── */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-30 w-12 h-12 bg-noir-black border border-noir-gray rounded-full flex items-center justify-center shadow-lg"
        aria-label="Toggle sidebar">
        {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-64 bg-noir-black border-r border-noir-gray z-40 lg:hidden overflow-y-auto pt-20">
              <nav className="px-3 space-y-1">
                {SIDEBAR_ITEMS.map((si) => {
                  const isActive = location.pathname === si.to
                  return (
                    <Link key={si.label} to={si.to} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                        isActive ? 'bg-noir-yellow/10 text-noir-yellow border-l-4 border-noir-yellow' : 'text-neutral-400 hover:text-white hover:bg-noir-dark/50'
                      }`}>
                      <si.icon className="w-5 h-5" /> {si.label}
                    </Link>
                  )
                })}
              </nav>
              <div className="border-t border-noir-gray my-4 mx-3" />
              <div className="px-3 space-y-1 pb-8">
                {SIDEBAR_BOTTOM.map((si) => (
                  <Link key={si.label} to={si.to} onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-neutral-400 hover:text-white hover:bg-noir-dark/50 transition-all">
                    <si.icon className="w-5 h-5" /> {si.label}
                  </Link>
                ))}
                <button onClick={() => { setSidebarOpen(false); signOut() }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-all">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {isLoading ? (
            <div className="space-y-6">
              <div className="h-24 bg-noir-dark/50 rounded-xl animate-pulse" />
              <LoadingSkeleton variant="card" count={3} />
            </div>
          ) : error ? (
            <ErrorState message="Could not load dashboard data" onRetry={() => refetch()} />
          ) : (
            <>
              {/* Welcome Banner */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-10 p-5 sm:p-8 rounded-xl border border-noir-gray bg-gradient-to-r from-noir-yellow/5 via-noir-purple/5 to-noir-yellow/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-noir-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-2 text-white">
                    Welcome back, <span className="text-noir-yellow">{username}</span>!
                  </h1>
                  <p className="text-neutral-400 font-mono text-xs sm:text-sm mt-2">
                    You have <span className="text-noir-yellow font-bold">{credits || 0} credits</span> remaining
                    {stats?.totalGenerations ? (
                      <>
                        <span className="mx-3 text-neutral-700">&bull;</span>
                        <span>{stats.totalGenerations} prompts generated</span>
                      </>
                    ) : null}
                  </p>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div variants={container} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
                {/* Credits */}
                <motion.div variants={item}>
                  <Link to="/pricing">
                    <div className="group h-full p-6 rounded-xl border border-noir-gray bg-noir-dark/50 hover:border-noir-yellow/50 transition-all">
                      <Zap className="w-8 h-8 text-noir-yellow mb-4" />
                      <div className="text-3xl sm:text-4xl font-black text-white mb-1">{credits || 0}</div>
                      <p className="text-sm text-neutral-500 font-mono mb-3">Credits available</p>
                      <div className="w-full bg-noir-dark rounded-full h-2 mb-3" title={`${credits} of ${maxCredits} credits`}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${creditPct}%` }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className={`${creditBarColor} h-2 rounded-full`} />
                      </div>
                      <span className="text-xs font-bold text-noir-yellow flex items-center gap-1 group-hover:gap-2 transition-all">
                        Buy More <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>

                {/* Generate */}
                <motion.div variants={item}>
                  <Link to="/generate">
                    <div className="group h-full p-6 rounded-xl border-2 border-noir-yellow/30 bg-noir-yellow/5 hover:border-noir-yellow transition-all">
                      <Plus className="w-8 h-8 text-noir-yellow mb-4" />
                      <h3 className="text-xl font-black text-white uppercase mb-1">New Prompt</h3>
                      <p className="text-sm text-neutral-500 font-mono mb-4">Create production-ready prompts</p>
                      <span className="text-xs font-bold text-noir-yellow flex items-center gap-1 group-hover:gap-2 transition-all">
                        Start <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>

                {/* Saved */}
                <motion.div variants={item}>
                  <Link to="/prompts">
                    <div className="group h-full p-6 rounded-xl border border-noir-gray bg-noir-dark/50 hover:border-noir-purple/50 transition-all">
                      <FolderOpen className="w-8 h-8 text-noir-purple mb-4" />
                      <div className="text-3xl sm:text-4xl font-black text-white mb-1">{stats?.totalSaved || 0}</div>
                      <p className="text-sm text-neutral-500 font-mono mb-4">Saved prompts</p>
                      <span className="text-xs font-bold text-noir-purple flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Library <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="mb-6 sm:mb-10 p-4 rounded-xl border border-noir-gray bg-noir-dark/50">
                <h3 className="text-xs font-bold uppercase text-neutral-500 mb-3 tracking-wider">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Link to="/generate" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-noir-yellow/10 border border-noir-yellow/20 text-noir-yellow text-sm font-semibold hover:bg-noir-yellow/20 transition-all">
                    <Rocket className="w-4 h-4" /> Quick Generate
                  </Link>
                  <Link to="/explore" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-noir-dark border border-noir-gray/50 text-neutral-300 text-sm font-semibold hover:bg-noir-black transition-all">
                    <Search className="w-4 h-4" /> Browse Examples
                  </Link>
                  <Link to="/docs" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-noir-dark border border-noir-gray/50 text-neutral-300 text-sm font-semibold hover:bg-noir-black transition-all">
                    <BookOpen className="w-4 h-4" /> Documentation
                  </Link>
                </div>
              </motion.div>

              {/* Quality Score Panel */}
              <div className="mb-6 sm:mb-10">
                <QualityScorePanel stats={stats || { totalGenerations: 0, avgQuality: 0, bestCategory: '', totalSaved: 0, creditsRemaining: 0, qualityTrend: null, qualityBreakdown: [] }} />
              </div>

              {/* Recent Activity + Usage Stats */}
              <motion.div variants={container} initial="hidden" animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-10">
                {/* Recent Activity */}
                <motion.div variants={item}>
                  <div className="h-full p-6 rounded-xl border border-noir-gray bg-noir-dark/50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-neutral-500" />
                        <h3 className="text-lg font-black uppercase text-white">Recent Activity</h3>
                      </div>
                      <Link to="/prompts" className="text-xs font-bold text-neutral-500 hover:text-noir-yellow transition-colors flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    {activityLoading ? (
                      <LoadingSkeleton variant="line" count={3} />
                    ) : recentPrompts.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm font-mono text-neutral-500 mb-3">No prompts generated yet</p>
                        <Link to="/generate" className="text-xs font-bold text-noir-yellow hover:underline">Generate your first prompt</Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentPrompts.map((p) => (
                          <Link key={p.id} to="/prompts"
                            className="block p-3 rounded-lg bg-noir-dark/30 border border-noir-gray/50 hover:border-noir-yellow/30 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-mono text-neutral-500 mb-1">{formatRelativeTime(p.created_at)}</div>
                                <div className="font-bold text-sm text-neutral-300 truncate">{p.title || 'Untitled'}</div>
                              </div>
                              <span className="ml-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-noir-dark text-neutral-500 border border-noir-gray/50">
                                {p.tier_used || 'basic'}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Usage Statistics */}
                <motion.div variants={item}>
                  <div className="h-full p-6 rounded-xl border border-noir-gray bg-noir-dark/50">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-neutral-500" />
                      <h3 className="text-lg font-black uppercase text-white">Usage Statistics</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Generated', value: stats?.totalGenerations || 0, sub: 'This Week' },
                        { label: 'Avg Quality', value: stats?.avgQuality ? `${Math.round(stats.avgQuality * 100)}%` : '—', sub: 'All Time' },
                        { label: 'Best Category', value: stats?.bestCategory || '—', sub: 'Top Performer' },
                        { label: 'Saved', value: stats?.totalSaved || 0, sub: 'Total Prompts' },
                      ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="p-4 rounded-lg bg-noir-dark/30 border border-noir-gray">
                          <div className="text-xl sm:text-2xl font-black text-white mb-1">{s.value}</div>
                          <div className="text-xs font-mono text-neutral-500">{s.label}</div>
                          <div className="text-[10px] text-neutral-600 mt-1">{s.sub}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Recommended -- use seed data or static fallback */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black uppercase text-white">Explore Prompts</h3>
                  <Link to="/explore" className="text-xs font-bold text-neutral-500 hover:text-noir-yellow transition-colors flex items-center gap-1">
                    Browse All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: Rocket, title: 'Full Stack App Builder', tier: 'Expert', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
                    { icon: Palette, title: 'UI Components Library', tier: 'Advanced', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
                    { icon: Shield, title: 'Security Best Practices', tier: 'Basic', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
                  ].map((p, i) => (
                    <motion.div key={p.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
                      <Link to={`/generate?category=${encodeURIComponent(p.title)}`}>
                        <div className={`group p-5 rounded-xl border ${p.color} hover:scale-[1.02] transition-all`}>
                          <p.icon className="w-6 h-6 mb-3" />
                          <h4 className="font-bold text-white text-sm mb-1">{p.title}</h4>
                          <p className="text-xs font-mono text-neutral-500 mb-3">{p.tier}</p>
                          <span className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Try Now <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
