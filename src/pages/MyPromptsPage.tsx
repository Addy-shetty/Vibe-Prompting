import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { Tiles } from '@/components/ui/tiles'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useCredits } from '@/hooks/useCreditsSecure'
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
  LogIn,
  Edit2,
  X,
  Save
} from 'lucide-react'

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

export default function MyPromptsPage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Sync anonymous prompts on login
  useEffect(() => {
    const syncAnonymousPrompts = async () => {
      if (!user) return

      const stored = localStorage.getItem('vibe_anonymous_prompts')
      const oldStored = localStorage.getItem('vibe_last_generated_prompt') // Check for legacy data
      
      if (!stored && !oldStored) return

      try {
        let anonymousPrompts = []
        
        if (stored) {
          anonymousPrompts = JSON.parse(stored)
        }
        
        // Handle legacy single prompt
        if (oldStored) {
          const oldPrompt = JSON.parse(oldStored)
          if (oldPrompt && oldPrompt.content) {
            anonymousPrompts.push(oldPrompt)
          }
        }

        if (!Array.isArray(anonymousPrompts) || anonymousPrompts.length === 0) return

        const toastId = toast.loading(`Syncing ${anonymousPrompts.length} prompts...`)

        for (const p of anonymousPrompts) {
          if (!p.content) continue // Skip empty prompts

          await supabase.from('prompts').insert({
            user_id: user.id,
            title: p.userInput ? p.userInput.slice(0, 50) + (p.userInput.length > 50 ? '...' : '') : 'Untitled Prompt',
            content: p.content,
            category: p.category || 'General Development',
            is_public: false, // Default to private
            created_at: p.timestamp || new Date().toISOString()
          })
        }

        localStorage.removeItem('vibe_anonymous_prompts')
        localStorage.removeItem('vibe_last_generated_prompt')
        toast.success('Prompts synced successfully!', { id: toastId })
        fetchPrompts() // Refresh list
      } catch (error) {
        console.error('Failed to sync prompts:', error)
        toast.error('Failed to sync some prompts')
      }
    }

    syncAnonymousPrompts()
  }, [user])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchPrompts()
  }, [user, navigate])

  useEffect(() => {
    filterPrompts()
  }, [searchQuery, selectedCategory, prompts])

  const fetchPrompts = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

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

  const saveEditedPrompt = async () => {
    if (!editingPrompt) return
    setIsUpdating(true)

    try {
      const { error } = await supabase
        .from('prompts')
        .update({
          title: editingPrompt.title,
          content: editingPrompt.content,
          is_public: editingPrompt.is_public,
          tags: editingPrompt.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPrompt.id)

      if (error) throw error

      // Update local state
      setPrompts(prompts.map(p => p.id === editingPrompt.id ? editingPrompt : p))
      setEditingPrompt(null)
      toast.success('Prompt updated successfully')
    } catch (error) {
      console.error('Error updating prompt:', error)
      toast.error('Failed to update prompt')
    } finally {
      setIsUpdating(false)
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
          <div className={`flex-1 relative rounded-xl border-2 ${
            theme === 'dark' 
              ? 'bg-neutral-900 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' 
              : 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
          } overflow-hidden`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-transparent outline-none font-medium ${
                theme === 'dark' ? 'text-white placeholder:text-neutral-500' : 'text-neutral-900 placeholder:text-neutral-400'
              }`}
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
                  ? theme === 'dark'
                    ? 'bg-purple-600 border-white text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0'
                    : 'bg-purple-600 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0'
                  : theme === 'dark'
                    ? 'bg-neutral-900 border-white text-neutral-400 hover:text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0'
                    : 'bg-white border-black text-neutral-600 hover:text-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0'
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
                    ? theme === 'dark'
                      ? 'bg-purple-600 border-white text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0'
                      : 'bg-purple-600 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0'
                    : theme === 'dark'
                      ? 'bg-neutral-900 border-white text-neutral-400 hover:text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0'
                      : 'bg-white border-black text-neutral-600 hover:text-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0'
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
                ? 'border-neutral-700 bg-neutral-900' 
                : 'border-neutral-300 bg-white'
            }`}
          >
            <Sparkles className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-neutral-700' : 'text-neutral-300'
            }`} />
            <h3 className={`text-xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              {searchQuery || selectedCategory ? 'No prompts found' : 'No prompts yet'}
            </h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {searchQuery || selectedCategory 
                ? 'Try adjusting your filters' 
                : 'Start generating prompts to see them here!'}
            </p>
            {!searchQuery && !selectedCategory && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/generate')}
                className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                    theme === 'dark'
                    ? 'bg-purple-600 border-white text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0'
                    : 'bg-purple-600 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0'
                }`}
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
                  <div className={`h-full rounded-2xl border-2 overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                      : 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  } transition-all duration-300 hover:translate-y-[-2px] hover:shadow-none hover:translate-x-[2px]`}>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${
                        theme === 'dark' ? 'border-white bg-neutral-900 text-white' : 'border-black bg-white text-black'
                      } text-xs font-bold`}>
                        <Icon className="w-3 h-3" />
                        {prompt.category || 'General'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex-grow overflow-hidden pt-8 space-y-3">
                        <p className={`text-sm font-bold ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                        }`}>
                          {prompt.title}
                        </p>
                        <p className={`text-sm line-clamp-4 font-medium ${
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
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border-2 ${
                                  theme === 'dark'
                                    ? 'bg-neutral-800 text-white border-white'
                                    : 'bg-neutral-100 text-black border-black'
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                            {prompt.tags.length > 3 && (
                              <span className={`text-xs font-bold ${
                                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                              }`}>
                                +{prompt.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-neutral-700">
                        <div className={`flex items-center gap-1 text-xs font-bold ${
                          theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(prompt.created_at)}
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(prompt.content)}
                            className={`p-2 rounded-lg border-2 ${
                              theme === 'dark'
                                ? 'bg-neutral-800 border-white text-white hover:bg-neutral-700'
                                : 'bg-neutral-100 border-black text-black hover:bg-neutral-200'
                            } transition-all`}
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingPrompt(prompt)}
                            className={`p-2 rounded-lg border-2 ${
                              theme === 'dark'
                                ? 'bg-neutral-800 border-white text-white hover:bg-neutral-700'
                                : 'bg-neutral-100 border-black text-black hover:bg-neutral-200'
                            } transition-all`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deletePrompt(prompt.id)}
                            className={`p-2 rounded-lg border-2 ${
                                theme === 'dark'
                                ? 'bg-red-900/20 border-red-500 text-red-400 hover:bg-red-900/40'
                                : 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
                            } transition-all`}
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

        {/* Edit Prompt Modal */}
        <AnimatePresence>
          {editingPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditingPrompt(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-2xl w-full rounded-2xl p-6 md:p-8 border-2 ${
                  theme === 'dark'
                    ? 'bg-neutral-900 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]'
                    : 'bg-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                } max-h-[90vh] overflow-y-auto`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}>
                    Edit Prompt
                  </h3>
                  <button
                    onClick={() => setEditingPrompt(null)}
                    className={`p-2 rounded-lg transition-colors border-2 ${
                      theme === 'dark' 
                        ? 'border-transparent hover:border-white hover:bg-neutral-800 text-neutral-400 hover:text-white' 
                        : 'border-transparent hover:border-black hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingPrompt.title}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, title: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl outline-none border-2 transition-all font-medium ${
                        theme === 'dark'
                          ? 'bg-neutral-800 border-neutral-700 focus:border-white text-white'
                          : 'bg-neutral-50 border-neutral-200 focus:border-black text-neutral-900'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      Prompt Content
                    </label>
                    <textarea
                      value={editingPrompt.content}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, content: e.target.value })}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl outline-none border-2 transition-all resize-none font-medium ${
                        theme === 'dark'
                          ? 'bg-neutral-800 border-neutral-700 focus:border-white text-white'
                          : 'bg-neutral-50 border-neutral-200 focus:border-black text-neutral-900'
                      }`}
                    />
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_public"
                      checked={editingPrompt.is_public}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, is_public: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="is_public" className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      Make Public (Visible in Explore)
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveEditedPrompt}
                      disabled={isUpdating}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2 disabled:opacity-50 ${
                        theme === 'dark'
                        ? 'bg-purple-600 border-white text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0'
                        : 'bg-purple-600 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0'
                      }`}
                    >
                      {isUpdating ? (
                        <Sparkles className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditingPrompt(null)}
                      disabled={isUpdating}
                      className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                        theme === 'dark'
                          ? 'bg-neutral-800 text-white border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0'
                          : 'bg-neutral-200 text-neutral-900 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0'
                      }`}
                    >
                      Cancel
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
