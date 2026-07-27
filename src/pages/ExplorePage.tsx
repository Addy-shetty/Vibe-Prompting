import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { Tiles } from '@/components/ui/tiles'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import {
  Copy,
  Search,
  Calendar,
  Sparkles,
  Zap,
  Code,
  Database,
  Server,
  Smartphone,
  Globe,
  GitBranch,
  Bug,
  FileCode,
  Layers,
  Shield,
  Terminal,
  Globe2
} from 'lucide-react'
import { LoadingSkeleton, EmptyState } from '@/components/ui/StateComponents'

interface Prompt {
  id: string
  user_id: string
  title: string
  content: string
  category: string | null
  tags: string[] | null
  is_public: boolean
  views_count: number
  likes_count: number
  created_at: string
  updated_at: string
}

const CATEGORY_ICONS: Record<string, any> = {
  'Frontend Development': Code,
  'Backend Development': Server,
  'Full Stack': Layers,
  'DevOps & Infrastructure': Terminal,
  'Database & SQL': Database,
  'API Development': Globe,
  'Testing & QA': Bug,
  'Mobile Development': Smartphone,
  'Architecture & Design': GitBranch,
  'Code Review & Refactoring': FileCode,
  'Documentation': FileCode,
  'Debugging & Performance': Zap,
  'Security & Auth': Shield,
  'General Development': Code,
}

const CATEGORY_COLORS: Record<string, string> = {
  'Frontend Development': 'from-blue-500 to-cyan-500',
  'Backend Development': 'from-green-500 to-emerald-500',
  'Full Stack': 'from-purple-500 to-pink-500',
  'DevOps & Infrastructure': 'from-orange-500 to-red-500',
  'Database & SQL': 'from-indigo-500 to-purple-500',
  'API Development': 'from-teal-500 to-green-500',
  'Testing & QA': 'from-yellow-500 to-orange-500',
  'Mobile Development': 'from-pink-500 to-rose-500',
  'Architecture & Design': 'from-violet-500 to-purple-500',
  'Code Review & Refactoring': 'from-cyan-500 to-blue-500',
  'Documentation': 'from-slate-500 to-gray-500',
  'Debugging & Performance': 'from-amber-500 to-yellow-500',
  'Security & Auth': 'from-red-500 to-orange-500',
  'General Development': 'from-indigo-500 to-blue-500',
}

export default function ExplorePage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchPublicPrompts()
  }, [])

  useEffect(() => {
    filterPrompts()
  }, [searchQuery, selectedCategory, prompts])

  const fetchPublicPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50) // Limit to 50 for now for performance

      if (error) {
        console.error('Database error:', error)
        toast.error('Failed to load prompts')
      } else {
        setPrompts(data || [])
        setFilteredPrompts(data || [])
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
      toast.error('Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const filterPrompts = () => {
    let filtered = prompts

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    setFilteredPrompts(filtered)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!', {
        icon: '📋',
        duration: 2000,
      })
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const categories = Array.from(new Set(prompts.map(p => p.category).filter(Boolean))) as string[]

  // Bento Grid: Different card sizes for visual interest
  const getBentoClass = (index: number) => {
    const patterns = [
      'md:col-span-2 md:row-span-2', // Large
      'md:col-span-1 md:row-span-1', // Small
      'md:col-span-1 md:row-span-1', // Small
      'md:col-span-2 md:row-span-1', // Wide
      'md:col-span-1 md:row-span-2', // Tall
      'md:col-span-1 md:row-span-1', // Small
    ]
    return patterns[index % patterns.length]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-6">
      <Tiles />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1f1f1f' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Globe2 className="w-8 h-8 text-[#FFD700]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white font-mono uppercase tracking-tight">
              Explore
            </h1>
          </div>
          <p className="text-[#A1A1AA]">
            Discover {prompts.length} public prompts from the community
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative rounded-xl border-2 bg-[#1A1A1A] border-[#333333] shadow-[4px_4px_0px_0px_#000] focus-within:border-[#FFD700] transition-colors overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search community prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent outline-none font-medium text-white placeholder:text-[#555]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all font-bold border-2 ${
                selectedCategory === null
                  ? 'bg-[#FFD700] border-[#000] text-[#0A0A0A] shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-y-0'
                  : 'bg-[#1A1A1A] border-[#333333] text-[#A1A1AA] hover:text-white shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-y-0 hover:border-[#FFD700]'
              }`}
            >
              All
            </motion.button>
            {categories.map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all font-bold border-2 ${
                  selectedCategory === category
                    ? 'bg-[#FFD700] border-[#000] text-[#0A0A0A] shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-y-0'
                    : 'bg-[#1A1A1A] border-[#333333] text-[#A1A1AA] hover:text-white shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-y-0 hover:border-[#FFD700]'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <LoadingSkeleton variant="card" count={6} />
        )}

        {/* Empty State */}
        {filteredPrompts.length === 0 && !loading && (
          <EmptyState
            icon={Search}
            title="No prompts found"
            description="Try adjusting your search or filters"
          />
        )}

        {/* Bento Grid */}
        {filteredPrompts.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-6"
          >
            {filteredPrompts.map((prompt, index) => {
              const Icon = CATEGORY_ICONS[prompt.category || 'General'] || Sparkles
              
              return (
                <motion.div
                  key={prompt.id}
                  variants={itemVariants}
                  className={`${getBentoClass(index)} group relative`}
                >
                  <div className="h-full rounded-xl border-2 overflow-hidden flex flex-col bg-[#1A1A1A] border-[#333333] shadow-[4px_4px_0px_0px_#000] hover:border-[#FFD700]/40 transition-all duration-300">
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] bg-[#0A0A0A] border-[#333333] text-[#FFD700]">
                        <Icon className="w-3 h-3" />
                        {prompt.category || 'General'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="space-y-3 pt-8">
                        <p className="text-lg font-bold leading-tight text-white">
                          {prompt.title}
                        </p>
                        <p className="text-sm line-clamp-3 font-medium text-[#A1A1AA]">
                          {prompt.content}
                        </p>
                        
                        {/* Tags Display */}
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {prompt.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border-2 text-xs font-bold bg-[#0A0A0A] border-[#333333] text-[#A1A1AA]"
                              >
                                #{tag}
                              </span>
                            ))}
                            {prompt.tags.length > 3 && (
                              <span className="text-xs font-bold text-[#555]">
                                +{prompt.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-dashed border-[#333333]/40">
                        <div className="flex items-center gap-1 text-xs font-bold text-[#555]">
                          <Calendar className="w-3 h-3" />
                          {formatDate(prompt.created_at)}
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyToClipboard(prompt.content)}
                            className="p-2 rounded-lg border-2 transition-all bg-[#0A0A0A] border-[#333333] text-[#A1A1AA] shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-y-0 hover:text-[#FFD700] hover:border-[#FFD700]"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
