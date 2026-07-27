import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Terminal, 
  FolderOpen, 
  Globe, 
  Zap, 
  ArrowRight, 
  Clock,
  Plus,
  BarChart3,
  TrendingUp,
  Shield,
  BookOpen,
  Rocket,
  Search,
  Settings,
  LogOut,
  HelpCircle,
  LayoutDashboard,
  FileText,
  Palette,
  Lock
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCredits } from '@/hooks/useCreditsSecure'

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', to: '/dashboard', active: true },
  { icon: FileText, label: 'Generate', to: '/generate' },
  { icon: FolderOpen, label: 'My Prompts', to: '/prompts' },
  { icon: Search, label: 'Explore', to: '/explore' },
  { icon: BarChart3, label: 'Stats', to: '/dashboard', disabled: true, badge: 'Soon' },
  { icon: Settings, label: 'Settings', to: '/settings' },
]

const SIDEBAR_BOTTOM = [
  { icon: HelpCircle, label: 'Help', to: '/docs' },
]

const RECOMMENDED_PROMPTS = [
  { icon: Rocket, title: 'Full Stack App Builder', tier: 'Expert', credits: 2, color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  { icon: Palette, title: 'UI Components Library', tier: 'Advanced', credits: 3, color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { icon: Shield, title: 'Security Best Practices', tier: 'Basic', credits: 5, color: 'bg-green-500/10 border-green-500/30 text-green-400' },
]

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { credits } = useCredits()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const username = (user?.user_metadata as any)?.username || user?.email?.split('@')[0] || 'User'

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex flex-col w-60 border-r border-noir-gray bg-noir-black/80 backdrop-blur-sm fixed top-16 bottom-0 left-0 z-20"
      >
        <nav className="flex-1 py-6 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((si) => (
            <Link
              key={si.label}
              to={si.disabled ? '#' : si.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all group ${
                si.active
                  ? 'bg-noir-yellow/10 text-noir-yellow border-l-4 border-noir-yellow -ml-[1px]'
                  : si.disabled
                    ? 'text-neutral-600 cursor-not-allowed'
                    : 'text-neutral-400 hover:text-white hover:bg-noir-dark/50'
              }`}
            >
              <si.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{si.label}</span>
              {si.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-noir-dark text-neutral-500 font-mono">
                  {si.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t border-noir-gray py-4 px-3 space-y-1">
          {SIDEBAR_BOTTOM.map((si) => (
            <Link
              key={si.label}
              to={si.to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-neutral-400 hover:text-white hover:bg-noir-dark/50 transition-all"
            >
              <si.icon className="w-5 h-5 flex-shrink-0" />
              <span>{si.label}</span>
            </Link>
          ))}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-60">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 md:p-8 rounded-xl border border-noir-gray bg-gradient-to-r from-noir-yellow/5 via-noir-purple/5 to-noir-yellow/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-noir-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-black uppercase mb-2 text-white">
                Welcome back, <span className="text-noir-yellow">{username}</span>! 👋
              </h1>
              <p className="text-neutral-400 font-mono text-sm mt-2">
                You have <span className="text-noir-yellow font-bold">{credits || 0} credits</span> remaining
                <span className="mx-3 text-neutral-700">•</span>
                Last login: {new Date().toLocaleDateString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>

          {/* Quick Stats Cards - 3 column */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {/* Credits Card */}
            <motion.div variants={item}>
              <Link to="/pricing">
                <div className="group h-full p-6 rounded-xl border border-noir-gray bg-noir-dark/50 hover:border-noir-yellow/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-8 h-8 text-noir-yellow" />
                    <span className="font-mono text-xs text-neutral-500 uppercase">Credits</span>
                  </div>
                  <div className="text-4xl font-black text-white mb-1">{credits || 0}</div>
                  <p className="text-sm text-neutral-500 font-mono mb-4">Available for generation</p>
                  {/* Progress bar */}
                  <div className="w-full bg-noir-dark rounded-full h-2 mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((credits || 0) / 10) * 100, 100)}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="bg-noir-yellow h-2 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-bold text-noir-yellow flex items-center gap-1 group-hover:gap-2 transition-all">
                    Buy More <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Generate Card */}
            <motion.div variants={item}>
              <Link to="/generate">
                <div className="group h-full p-6 rounded-xl border-2 border-noir-yellow/30 bg-noir-yellow/5 hover:border-noir-yellow transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Terminal className="w-32 h-32 -mt-4 -mr-4" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Plus className="w-8 h-8 text-noir-yellow" />
                      <span className="font-mono text-xs text-neutral-500 uppercase">Generate</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase mb-1">New Prompt</h3>
                    <p className="text-sm text-neutral-500 font-mono mb-4">Create production-ready prompts</p>
                    <span className="text-xs font-bold text-noir-yellow flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Saved Prompts Card */}
            <motion.div variants={item}>
              <Link to="/prompts">
                <div className="group h-full p-6 rounded-xl border border-noir-gray bg-noir-dark/50 hover:border-noir-purple/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <FolderOpen className="w-8 h-8 text-noir-purple" />
                    <span className="font-mono text-xs text-neutral-500 uppercase">Library</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase mb-1">Saved Prompts</h3>
                  <p className="text-sm text-neutral-500 font-mono mb-4">Access your prompt library</p>
                  <span className="text-xs font-bold text-noir-purple flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Library <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 p-4 rounded-xl border border-noir-gray bg-noir-dark/50"
          >
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

          {/* Two-column: Recent Activity + Usage Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
          >
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
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-noir-dark/50 border border-noir-gray/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-neutral-500 mb-1">Just now</div>
                        <div className="font-bold text-sm text-neutral-300">Dashboard Accessed</div>
                      </div>
                      <span className="text-xs font-mono text-neutral-500">—</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-noir-dark/30 border border-noir-gray opacity-60">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-neutral-600 mb-1">—</div>
                        <div className="font-bold text-sm text-neutral-500">Generate prompts to see activity</div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    { label: 'Generated', value: '—', sub: 'This Week', trend: null },
                    { label: 'Tiers Used', value: '—', sub: 'All Time', trend: null },
                    { label: 'Success Rate', value: '—', sub: 'Average', trend: null },
                    { label: 'Saved', value: '—', sub: 'Total Prompts', trend: null },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="p-4 rounded-lg bg-noir-dark/30 border border-noir-gray"
                    >
                      <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                      <div className="text-xs font-mono text-neutral-500">{stat.label}</div>
                      <div className="text-[10px] text-neutral-600 mt-1">{stat.sub}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Recommended Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black uppercase text-white">Recommended Prompts</h3>
              <Link to="/explore" className="text-xs font-bold text-neutral-500 hover:text-noir-yellow transition-colors flex items-center gap-1">
                Explore <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RECOMMENDED_PROMPTS.map((prompt, i) => (
                <motion.div
                  key={prompt.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <Link to="/generate">
                    <div className={`group p-5 rounded-xl border ${prompt.color} hover:scale-[1.02] transition-all`}>
                      <prompt.icon className="w-6 h-6 mb-3" />
                      <h4 className="font-bold text-white text-sm mb-1">{prompt.title}</h4>
                      <p className="text-xs font-mono text-neutral-500 mb-3">
                        {prompt.tier} • {prompt.credits}cr
                      </p>
                      <span className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Try Now <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
