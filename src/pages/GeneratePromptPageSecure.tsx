import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles, AlertCircle, Copy, CheckCheck, Tag } from 'lucide-react'
import { generatePrompt, submitFeedback } from '@/lib/api'
import { useCredits } from '@/hooks/useCreditsSecure'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'default', label: 'General (Auto-detect)' },
  { value: 'bug-bounty', label: 'Bug Bounty' },
  { value: 'code-generation', label: 'Code Generation' },
  { value: 'prompt-injection', label: 'Prompt Injection' },
  { value: 'security-audit', label: 'Security Audit' },
  { value: 'reconnaissance', label: 'Reconnaissance' },
  { value: 'fuzzing', label: 'Fuzzing' },
  { value: 'api-testing', label: 'API Testing' },
  { value: 'cloud-security', label: 'Cloud Security' },
  { value: 'devsecops', label: 'DevSecOps' },
  { value: 'system-design', label: 'System Design' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'content-creation', label: 'Content Creation' },
  { value: 'debugging', label: 'Debugging' },
  { value: 'workflow-automation', label: 'Workflow Automation' },
]

const TIER_INFO = {
  basic: {
    name: 'Basic',
    generations: 5,
    description: 'Simple, clear prompt enhancement',
    features: ['Core concept', 'Tech stack', 'Basic reqs'],
  },
  advanced: {
    name: 'Advanced',
    generations: 3,
    description: 'Detailed specs with examples',
    features: ['Detailed specs', 'Error handling', 'Best practices'],
  },
  expert: {
    name: 'Expert',
    generations: 2,
    description: 'Production-grade with full system design',
    features: ['Full system design', 'Tests & QA', 'Deploy guide'],
  },
}

const COST_PER_GENERATION = 1

export default function GeneratePromptPageSecure() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { credits, tier, loading: creditsLoading, refetch: refetchCredits } = useCredits()
  
  const [input, setInput] = useState('')
  const [selectedTier, setSelectedTier] = useState<'basic' | 'advanced' | 'expert'>('advanced')
  const [selectedCategory, setSelectedCategory] = useState('default')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [promptId, setPromptId] = useState<string | null>(null)
  const [userRating, setUserRating] = useState(0)
  const [provider, setProvider] = useState<string | null>(null)

  const handleGenerate = async () => {
    // Check authentication
    if (!user) {
      navigate('/login')
      return
    }

    // Validate input
    if (!input.trim()) {
      setError('Please enter a prompt')
      return
    }

    // Check credits - each generation costs 1 credit
    const requiredCredits = COST_PER_GENERATION
    if (credits < requiredCredits) {
      setError(
        `Insufficient credits. You need ${requiredCredits} credits but have ${credits}. ` +
        `Please upgrade your plan or wait for your credits to reset.`
      )
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setProvider(null)

    try {
      const response = await generatePrompt({
        userInput: input,
        tier: selectedTier,
        category: selectedCategory,
        metadata: {
          source: 'web_app',
          timestamp: new Date().toISOString(),
        },
      })

      if (response.success && response.prompt) {
        setResult(response.prompt)
        if (response.promptId) setPromptId(response.promptId)
        setProvider(response.provider || null)
        
        // Refresh credits to show updated balance
        await refetchCredits()
        
        // Show success feedback
        console.log(`Generation successful. Credits used: ${response.creditsUsed}, Remaining: ${response.creditsRemaining}`)
      } else {
        // Handle specific error cases
        if (response.error === 'insufficient_credits') {
          setError(
            `Insufficient credits. You need ${requiredCredits} credits.`
          )
        } else if (response.error === 'rate_limit_exceeded') {
          setError(
            `Rate limit exceeded. Please wait ${response.retryAfter || 60} seconds before trying again.`
          )
        } else {
          setError(response.message || 'Failed to generate prompt. Please try again.')
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      console.error('Generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result)
        setCopied(true)
        toast.success('Copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
        toast.error('Failed to copy to clipboard')
      }
    }
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-noir-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black uppercase mb-4 tracking-tighter text-white">
            Generate Prompt
          </h1>
          <div className="flex items-center gap-4 font-mono font-bold text-lg">
            <span className="text-neutral-400">
              Credits: <span className="text-noir-yellow text-2xl">{credits}</span>
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">
              Tier: <span className="text-noir-purple uppercase">{tier || 'Free'}</span>
            </span>
          </div>
        </div>

        {/* Step 1: Input */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-noir-yellow font-mono text-sm font-bold">STEP 1:</span>
            <label className="text-xl font-black uppercase tracking-wider text-white">
              ENTER YOUR IDEA
            </label>
          </div>
          <p className="text-neutral-500 font-mono text-sm mb-3">Describe what you need help with...</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Ctrl+Enter or Cmd+Enter to generate
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                if (!loading && input.trim() && credits >= COST_PER_GENERATION) {
                  handleGenerate()
                }
              }
            }}
            placeholder="Enter your prompt idea... (e.g., 'Build a React dashboard with authentication')"
            rows={6}
            maxLength={10000}
            className="w-full p-6 bg-noir-black border-2 border-noir-gray text-white font-mono font-bold text-lg rounded-xl focus:outline-none focus:border-noir-yellow focus:ring-4 focus:ring-noir-yellow/20 transition-all placeholder:text-neutral-600"
          />
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm font-mono text-neutral-500">
              Press <kbd className="px-1.5 py-0.5 bg-noir-dark rounded text-xs text-neutral-400">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-noir-dark rounded text-xs text-neutral-400">Enter</kbd> to generate
            </span>
            <span className={`text-sm font-mono font-bold ${
              input.length > 9000 ? 'text-red-500' : 
              input.length > 7500 ? 'text-orange-500' : 
              input.length > 5000 ? 'text-noir-yellow' : 'text-neutral-500'
            }`}>
              {input.length.toLocaleString()} / 10,000
            </span>
          </div>
        </div>

        {/* Step 2: Category Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-noir-yellow font-mono text-sm font-bold">STEP 2:</span>
            <label className="text-xl font-black uppercase tracking-wider text-white">
              SELECT CATEGORY
            </label>
          </div>
          <p className="text-neutral-500 font-mono text-sm mb-3">Category-aware prompts use specialized examples for better results.</p>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-4 bg-noir-black border-2 border-noir-gray text-white font-mono font-bold text-sm rounded-xl focus:outline-none focus:border-noir-purple focus:ring-4 focus:ring-noir-purple/20 transition-all appearance-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-noir-black text-white">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Tier Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-noir-yellow font-mono text-sm font-bold">STEP 3:</span>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">
              CHOOSE PROMPT TIER
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(TIER_INFO) as Array<keyof typeof TIER_INFO>).map((t) => {
              const info = TIER_INFO[t]
              const isSelected = selectedTier === t
              const canAfford = credits >= COST_PER_GENERATION
              
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  disabled={!canAfford}
                  className={`p-6 border-2 rounded-xl transition-all text-left ${
                    isSelected
                      ? 'border-noir-yellow bg-noir-yellow/5'
                      : canAfford
                      ? 'border-noir-gray bg-noir-dark hover:border-noir-yellow/50'
                      : 'border-neutral-800 bg-neutral-900/50 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className={`text-lg font-bold mb-2 ${isSelected ? 'text-noir-yellow' : 'text-white'}`}>
                    {info.name}
                  </div>
                  <div className="text-3xl font-black text-noir-yellow mb-1">{info.generations}</div>
                  <div className="text-xs font-mono text-neutral-500 mb-2">GENERATIONS PER CREDIT</div>
                  <div className="text-sm font-mono text-neutral-400 mb-3">
                    {credits} generations possible with current credits
                  </div>
                  <ul className="space-y-1">
                    {info.features.map((feature) => (
                      <li key={feature} className="text-xs text-neutral-400 font-mono">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                  {isSelected && (
                    <div className="mt-3 text-xs font-bold text-noir-yellow uppercase tracking-wider">
                      SELECTED
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim() || credits < COST_PER_GENERATION || creditsLoading}
          className="w-full bg-noir-yellow text-noir-black py-6 font-black uppercase text-xl border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3 rounded-xl mb-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              ⚡ GENERATE (1 CREDIT)
            </>
          )}
        </button>

        {/* Credit Info */}
        <div className="text-center text-sm font-mono text-neutral-400 mb-6 space-y-2">
          <div>
            This generation uses: <span className="text-noir-yellow font-bold">1</span> credit
          </div>
          <div>
            You can generate <span className="text-white font-bold">{credits}</span> more prompts
          </div>
          <div className="text-neutral-500">
            Remaining after this: <span className="text-neutral-300">{credits - 1}</span> credits
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-6 bg-red-500/10 border-2 border-red-500 rounded-xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="font-mono font-bold text-red-400 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Result Display - Terminal Style */}
        {result && (
          <div className="border-2 border-noir-gray rounded-xl overflow-hidden bg-noir-dark">
            {/* Terminal Header */}
            <div className="bg-noir-black border-b-2 border-noir-gray px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-noir-black"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-noir-black"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 border border-noir-black"></div>
              </div>
              <span className="font-mono text-xs text-neutral-500">generated-prompt.txt</span>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase tracking-wider text-white">📝 Generated Prompt</h3>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-noir-yellow text-noir-black font-black uppercase border-2 border-black hover:bg-noir-yellow-dim transition-all flex items-center gap-2 rounded-lg"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              
              <div className="p-6 bg-noir-black border border-noir-gray rounded-lg mb-4">
                <p className="font-mono text-base leading-relaxed whitespace-pre-wrap text-neutral-300">
                  {result}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm font-mono text-neutral-500">
                {provider && (
                  <span>Generated using: <span className="text-noir-purple uppercase">{provider}</span></span>
                )}
                <span className="text-noir-yellow">
                  Credits remaining: <span className="text-lg font-bold">{credits}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 p-6 bg-noir-dark border border-noir-gray rounded-xl">
          <h4 className="text-lg font-black uppercase mb-3 text-white">💡 Tips for Better Results</h4>
          <ul className="space-y-2 font-mono text-sm text-neutral-400">
            <li>• Be specific about what you want to achieve</li>
            <li>• Mention technologies or frameworks you're using</li>
            <li>• Include context about your use case</li>
            <li>• Higher tiers provide more detailed and production-ready prompts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
