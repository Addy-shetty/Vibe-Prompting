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
  Plus
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCredits } from '@/hooks/useCreditsSecure'

export default function DashboardPage() {
  const { user } = useAuth()
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 text-neo-black">
          Dashboard
        </h1>
        <p className="text-xl font-mono text-neutral-600">
          Welcome back, <span className="font-bold text-neo-blue">{user?.email?.split('@')[0]}</span>.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {/* Main Action - Generate */}
        <motion.div variants={item} className="md:col-span-2">
          <Link to="/generate">
            <div className="group relative h-full bg-neo-yellow border-3 border-neo-black p-8 shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Terminal className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-neo-black text-white">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-black uppercase">New Prompt</h2>
                </div>
                <p className="font-mono text-lg mb-8 max-w-md">
                  Generate a new production-ready prompt optimized for your specific tech stack and requirements.
                </p>
                <span className="inline-flex items-center gap-2 font-bold uppercase border-b-2 border-neo-black pb-1 group-hover:gap-4 transition-all">
                  Start Generating <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Credits Status */}
        <motion.div variants={item}>
          <Link to="/pricing">
            <div className="h-full bg-white border-3 border-neo-black p-6 shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-8 h-8 text-neo-pink" />
                  <span className="font-mono text-sm text-neutral-500">Plan Status</span>
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">Credits</h3>
                <div className="text-5xl font-black text-neo-black mb-2">
                  {credits || 0}
                </div>
                <p className="font-mono text-sm text-neutral-600">
                  Available for generation
                </p>
              </div>
              <div className="mt-6 pt-6 border-t-2 border-dashed border-neutral-200">
                <span className="text-sm font-bold uppercase text-neo-blue flex items-center gap-2">
                  Top up credits <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* My Prompts */}
        <motion.div variants={item}>
          <Link to="/prompts">
            <div className="h-full bg-neo-blue border-3 border-neo-black p-6 shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer text-white">
              <FolderOpen className="w-8 h-8 mb-4" />
              <h3 className="text-2xl font-black uppercase mb-2">My Library</h3>
              <p className="font-mono text-sm opacity-90 mb-6">
                Access your saved prompts and history.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-2 font-bold uppercase border-b-2 border-white pb-1">
                  View Library <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Explore */}
        <motion.div variants={item}>
          <Link to="/explore">
            <div className="h-full bg-neo-green border-3 border-neo-black p-6 shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
              <Globe className="w-8 h-8 mb-4 text-neo-black" />
              <h3 className="text-2xl font-black uppercase mb-2 text-neo-black">Explore</h3>
              <p className="font-mono text-sm text-neo-black opacity-90 mb-6">
                Discover prompts from the community.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-2 font-bold uppercase border-b-2 border-neo-black pb-1 text-neo-black">
                  Browse <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Recent Activity Placeholder */}
        <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
           <div className="h-full bg-white border-3 border-neo-black p-6 shadow-neo">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-neutral-400" />
                <h3 className="text-xl font-black uppercase">Recent</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-neutral-50 border-2 border-neutral-200">
                  <div className="text-xs font-mono text-neutral-500 mb-1">Just now</div>
                  <div className="font-bold text-sm">Dashboard Accessed</div>
                </div>
                {/* We can hook this up to real history later */}
                <div className="p-3 bg-neutral-50 border-2 border-neutral-200 opacity-50">
                  <div className="text-xs font-mono text-neutral-500 mb-1">--</div>
                  <div className="font-bold text-sm">No recent prompts</div>
                </div>
              </div>
           </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
