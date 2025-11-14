import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useCredits } from '@/hooks/useCredits'
import toast, { Toaster } from 'react-hot-toast'
import { 
  Copy, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Sparkles,
  Zap,
  Code,
  Database,
  Server,
  Smartphone,
  Globe,
  Lock,
  GitBranch,
  Bug,
  FileCode,
  Layers,
  Shield,
  Terminal,
  AlertCircle,
  LogIn
} from 'lucide-react'

interface Prompt {
  id: string
  user_id: string
  title: string
  content: string
  category: string | null
  tags: string[] | null
  is_public: boolean
  is_approved: boolean
  views_count: number
  likes_count: number
  created_at: string
  updated_at: string
  is_favorite?: boolean
}

// Empty - will load from database
const DUMMY_PROMPTS: Prompt[] = []

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

export default function MyPromptsPage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { canAnonymousView, getAnonymousViewsLeft, incrementAnonymousView } = useCredits()
  
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showViewLimitModal, setShowViewLimitModal] = useState(false)
  const [hasTrackedView, setHasTrackedView] = useState(false)

  useEffect(() => {
    // For anonymous users, check if they can view prompts
    if (!user && !hasTrackedView) {
      if (!canAnonymousView()) {
        setShowViewLimitModal(true)
        setLoading(false)
        return
      }
      // Track this view
      incrementAnonymousView()
      setHasTrackedView(true)
    }
    
    fetchPrompts()
  }, [user, navigate])

  useEffect(() => {
    filterPrompts()
  }, [searchQuery, selectedCategory, prompts])

  const fetchPrompts = async () => {
    try {
      let query = supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })

      // If user is logged in, show public prompts OR user's own prompts
      if (user) {
        query = query.or(`is_public.eq.true,user_id.eq.${user.id}`)
      } else {
        // Anonymous users: only public prompts, limited to 3
        query = query.eq('is_public', true).limit(3)
      }

      const { data, error } = await query

      if (error) {
        console.error('Database error:', error)
        toast.error('Failed to load prompts')
        setPrompts([])
        setFilteredPrompts([])
      } else {
        setPrompts(data || [])
        setFilteredPrompts(data || [])
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
      toast.error('Failed to load prompts')
      setPrompts([])
      setFilteredPrompts([])
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

  const deletePrompt = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return

    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId)

      if (error) throw error

      setPrompts(prompts.filter(p => p.id !== promptId))
      toast.success('Prompt deleted', { icon: '🗑️', duration: 2000 })
    } catch (error) {
      toast.error('Failed to delete prompt')
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

  const categories = Array.from(new Set(prompts.map(p => p.category)))

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-8 h-8 text-purple-500" />
          </motion.div>
          <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
            Loading your prompts...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
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
          <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-neutral-900'
          }`}>
            My Prompts
          </h1>
          <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
            {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'} generated
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
          <div className={`flex-1 relative ${
            theme === 'dark' ? 'bg-neutral-900/50' : 'bg-white'
          } rounded-2xl border ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          } overflow-hidden`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
            }`} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-transparent outline-none ${
                theme === 'dark' ? 'text-white placeholder:text-neutral-500' : 'text-neutral-900 placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : theme === 'dark'
                  ? 'bg-neutral-900/50 border border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All
            </motion.button>
            {categories.map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : theme === 'dark'
                    ? 'bg-neutral-900/50 border border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center py-20 rounded-3xl border-2 border-dashed ${
              theme === 'dark' 
                ? 'border-neutral-800 bg-neutral-900/30' 
                : 'border-neutral-200 bg-neutral-50'
            }`}
          >
            <Sparkles className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-neutral-700' : 'text-neutral-300'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              {searchQuery || selectedCategory ? 'No prompts found' : 'No prompts yet'}
            </h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}`}>
              {searchQuery || selectedCategory 
                ? 'Try adjusting your filters' 
                : 'Start generating prompts to see them here!'}
            </p>
            {!searchQuery && !selectedCategory && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/generate')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
              >
                Generate Your First Prompt
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Bento Grid */}
        {filteredPrompts.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4"
          >
            {filteredPrompts.map((prompt, index) => {
              const Icon = CATEGORY_ICONS[prompt.category || 'General'] || Sparkles
              const colorGradient = CATEGORY_COLORS[prompt.category || 'General'] || 'from-purple-500 to-pink-500'

              return (
                <motion.div
                  key={prompt.id}
                  variants={itemVariants}
                  className={`${getBentoClass(index)} group relative`}
                >
                  <div className={`h-full rounded-2xl border overflow-hidden backdrop-blur-sm ${
                    theme === 'dark'
                      ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  } transition-all duration-300 hover:shadow-xl`}>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${colorGradient} text-white text-xs font-medium shadow-lg`}>
                        <Icon className="w-3 h-3" />
                        {prompt.category || 'General'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="space-y-3 pt-8">
                        <p className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                        }`}>
                          {prompt.title}
                        </p>
                        <p className={`text-sm line-clamp-3 ${
                          theme === 'dark' ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {prompt.content}
                        </p>
                        
                        {/* Tags Display */}
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {prompt.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                  theme === 'dark'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'bg-purple-100 text-purple-700 border border-purple-200'
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                            {prompt.tags.length > 3 && (
                              <span className={`text-xs ${
                                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                              }`}>
                                +{prompt.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4">
                        <div className={`flex items-center gap-1 text-xs ${
                          theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(prompt.created_at)}
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(prompt.content)}
                            className={`p-2 rounded-lg ${
                              theme === 'dark'
                                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
                                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
                            } transition-all`}
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deletePrompt(prompt.id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* View Limit Modal for Anonymous Users */}
        <AnimatePresence>
          {showViewLimitModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowViewLimitModal(false)
                navigate('/')
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-md w-full rounded-2xl p-8 ${
                  theme === 'dark'
                    ? 'bg-neutral-900 border border-neutral-800'
                    : 'bg-white border border-neutral-200'
                }`}
              >
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}>
                    Free Preview Limit Reached
                  </h3>
                  
                  <p className={`mb-6 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    You've viewed your 3 free prompts. Sign up to access all prompts and get 50 free generation credits!
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/signup')}
                      className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-5 h-5" />
                      Sign Up Free
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowViewLimitModal(false)
                        navigate('/')
                      }}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                          : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
                      }`}
                    >
                      Go Back
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
