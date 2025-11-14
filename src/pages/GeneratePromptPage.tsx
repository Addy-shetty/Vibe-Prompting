import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useCredits } from '@/hooks/useCredits'
import { generatePromptStream } from '@/lib/ai'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import { Sparkles, Save, Loader2, Wand2, Tag, X, AlertCircle, LogIn, Copy, CheckCheck } from 'lucide-react'

const CATEGORIES = [
  'Frontend Development',
  'Backend Development',
  'Full Stack',
  'DevOps & Infrastructure',
  'Database & SQL',
  'API Development',
  'Testing & QA',
  'Mobile Development',
  'Architecture & Design',
  'Code Review & Refactoring',
  'Documentation',
  'Debugging & Performance',
  'Security & Auth',
  'General Development',
]

const LAST_PROMPT_STORAGE_KEY = 'vibe_last_generated_prompt'

export default function GeneratePromptPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { hasCredits, deductCredit, getCreditsRemaining, loading: creditsLoading } = useCredits()

  const [userInput, setUserInput] = useState('')
  const [category, setCategory] = useState('General Development')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreditLimitModal, setShowCreditLimitModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Pre-fill prompt from navigation state
  useEffect(() => {
    if (location.state?.prompt) {
      setUserInput(location.state.prompt)
    }
  }, [location.state])

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError('Please describe what kind of prompt you need')
      return
    }

    // Check if user has credits
    if (!hasCredits()) {
      setShowCreditLimitModal(true)
      return
    }

    setError(null)
    setIsGenerating(true)
    setGeneratedPrompt('')
    setTitle('') // Reset title when generating new prompt
    setTags([]) // Reset tags when generating new prompt

    try {
      // Deduct credit before generation
      const creditDeducted = await deductCredit()
      
      if (!creditDeducted) {
        setError('Failed to deduct credit. Please try again.')
        setIsGenerating(false)
        return
      }

      await generatePromptStream(
        userInput,
        category,
        (text) => {
          setGeneratedPrompt(text)
        }
      )
      
      // Store in localStorage for anonymous users (backup)
      if (!user) {
        localStorage.setItem(LAST_PROMPT_STORAGE_KEY, JSON.stringify({
          content: '',  // Will be filled when generation completes
          category,
          userInput,
          timestamp: new Date().toISOString()
        }))
      }
      
      // Show remaining credits
      const remaining = getCreditsRemaining()
      if (user) {
        toast.success(`Prompt generated! ${remaining} credits remaining`, { icon: '✨' })
      } else {
        toast.success(`Prompt generated! ${remaining} free generations left`, { icon: '✨' })
        // Show warning after a delay
        setTimeout(() => {
          toast('💡 Sign up to save your prompts permanently!', { 
            duration: 4000,
            icon: '⚠️'
          })
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate prompt')
    } finally {
      setIsGenerating(false)
    }
  }

  // Update localStorage when prompt generation completes
  useEffect(() => {
    if (generatedPrompt && !user) {
      const stored = localStorage.getItem(LAST_PROMPT_STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        data.content = generatedPrompt
        localStorage.setItem(LAST_PROMPT_STORAGE_KEY, JSON.stringify(data))
      }
    }
  }, [generatedPrompt, user])

  const handleCopyToClipboard = async () => {
    if (!generatedPrompt) return
    
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      toast.success('Copied to clipboard!', { icon: '📋' })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleSave = async () => {
    if (!user) {
      // Show signup modal instead of redirecting
      setShowSignupModal(true)
      return
    }

    if (!title.trim()) {
      toast.error('Please add a title for your prompt')
      return
    }

    if (!generatedPrompt.trim()) {
      toast.error('No prompt to save')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Build insert object
      const insertData: any = {
        user_id: user.id,
        title: title.trim(),
        content: generatedPrompt,
        category,
        is_public: true,
      }

      // Add tags only if they exist (requires migration 003_add_tags_column.sql)
      if (tags.length > 0) {
        insertData.tags = tags
      }

      const { error: saveError } = await supabase.from('prompts').insert(insertData)

      if (saveError) throw saveError

      toast.success('Prompt saved successfully! 🎉', {
        duration: 2000,
        icon: '✅',
      })
      
      setTimeout(() => {
        navigate('/prompts')
      }, 1500)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save prompt')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Wand2 className="w-8 h-8 text-purple-500" />
              <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                AI Prompt Generator
              </h1>
            </div>
            <p className={`text-lg mb-3 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {import.meta.env.VITE_GEMINI_API_KEY 
                ? '🚀 Powered by Google Gemini 2.0 Flash' 
                : '⚡ Powered by OpenRouter (Llama 3.2)'}
            </p>
            
            {/* Credits Display */}
            {!creditsLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  theme === 'dark'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user 
                    ? `${getCreditsRemaining()} credits remaining`
                    : `${getCreditsRemaining()} free generations left`}
                </span>
              </motion.div>
            )}
          </div>

          {/* Input Section */}
          <div className={`rounded-2xl p-8 backdrop-blur-sm border mb-6 transition-shadow ${
            theme === 'dark'
              ? 'bg-neutral-900/50 border-neutral-800 shadow-2xl shadow-purple-500/10'
              : 'bg-white border-neutral-200 shadow-2xl shadow-purple-500/20'
          }`}>
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Category Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-neutral-700 text-white focus:border-purple-500'
                    : 'bg-white border-neutral-300 text-neutral-900 focus:border-purple-500'
                }`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* User Input */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Describe what you need
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="E.g., Create a prompt for writing engaging LinkedIn posts about AI technology..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500'
                    : 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500'
                }`}
              />
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Prompt
                </>
              )}
            </motion.button>
          </div>

          {/* Generated Prompt */}
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-8 shadow-xl backdrop-blur-sm border ${
                theme === 'dark'
                  ? 'bg-neutral-900/50 border-neutral-800'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}>
                <Sparkles className="w-5 h-5 text-purple-500" />
                Generated Prompt
              </h2>

              {/* Title Input */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  Title (required to save)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your prompt a catchy title..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500'
                      : 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500'
                  }`}
                />
              </div>

              {/* Tags Input */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  Tags (optional, max 5) - Press Enter to add
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="e.g., react, typescript, frontend..."
                    maxLength={20}
                    disabled={tags.length >= 5}
                    className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all ${
                      theme === 'dark'
                        ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500 disabled:opacity-50'
                        : 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500 disabled:opacity-50'
                    }`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                    className={`px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      theme === 'dark'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <Tag className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {/* Display Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          theme === 'dark'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-purple-100 text-purple-700 border border-purple-200'
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className={`ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors ${
                            theme === 'dark' ? 'hover:text-red-400' : 'hover:text-red-600'
                          }`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {/* Generated Content */}
              <div className={`p-4 rounded-xl mb-6 ${
                theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'
              }`}>
                <p className={`whitespace-pre-wrap ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  {generatedPrompt}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Copy Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyToClipboard}
                  className={`py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                      : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-5 h-5 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </motion.button>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {user ? 'Save Prompt' : 'Sign Up to Save'}
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setGeneratedPrompt('')
                    setTitle('')
                    setTags([])
                    setTagInput('')
                    setUserInput('')
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    theme === 'dark'
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                      : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
                  }`}
                >
                  Clear
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Credit Limit Modal */}
        <AnimatePresence>
          {showCreditLimitModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreditLimitModal(false)}
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
                    {user ? 'No Credits Remaining' : 'Free Limit Reached'}
                  </h3>
                  
                  <p className={`mb-6 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    {user
                      ? "You've used all your generation credits. More features coming soon!"
                      : "You've used your 3 free generations. Sign up to get 50 free credits and continue generating amazing prompts!"}
                  </p>

                  <div className="flex gap-3">
                    {!user && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/signup')}
                        className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-5 h-5" />
                        Sign Up Free
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCreditLimitModal(false)}
                      className={`${user ? 'flex-1' : ''} px-6 py-3 rounded-xl font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                          : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
                      }`}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signup Modal for Anonymous Users Trying to Save */}
        <AnimatePresence>
          {showSignupModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSignupModal(false)}
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
                    <Save className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}>
                    Save Your Prompt
                  </h3>
                  
                  <p className={`mb-2 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Sign up for free to save your generated prompts permanently and get:
                  </p>

                  <ul className={`text-left mb-6 space-y-2 ${
                    theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                  }`}>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      50 free generation credits
                    </li>
                    <li className="flex items-center gap-2">
                      <Save className="w-4 h-4 text-purple-500" />
                      Unlimited prompt storage
                    </li>
                    <li className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-500" />
                      Organize with tags & categories
                    </li>
                  </ul>

                  <p className={`text-sm mb-6 ${
                    theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    💡 Your current prompt is saved in your browser. Copy it before leaving!
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
                      onClick={() => setShowSignupModal(false)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                          : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
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
