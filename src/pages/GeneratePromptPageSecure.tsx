import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles, AlertCircle, Copy, CheckCheck } from 'lucide-react'
import { generatePrompt } from '@/lib/api'
import { useCredits } from '@/hooks/useCreditsSecure'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const TIER_INFO = {
  basic: {
    name: 'Basic',
    cost: 5,
    description: 'Simple prompt enhancement with clarity improvements',
    color: 'bg-neo-yellow',
  },
  advanced: {
    name: 'Advanced',
    cost: 3,
    description: 'Detailed prompt with context, examples, and best practices',
    color: 'bg-neo-blue',
  },
  expert: {
    name: 'Expert',
    cost: 2,
    description: 'Production-grade prompt with comprehensive technical details',
    color: 'bg-neo-pink',
  },
}

export default function GeneratePromptPageSecure() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { credits, tier, loading: creditsLoading, refetch: refetchCredits } = useCredits()
  
  const [input, setInput] = useState('')
  const [selectedTier, setSelectedTier] = useState<'basic' | 'advanced' | 'expert'>('basic')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
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

    // Check credits
    const requiredCredits = TIER_INFO[selectedTier].cost
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
        metadata: {
          source: 'web_app',
          timestamp: new Date().toISOString(),
        },
      })

      if (response.success && response.prompt) {
        setResult(response.prompt)
        setProvider(response.provider || null)
        
        // Refresh credits to show updated balance
        await refetchCredits()
        
        // Show success feedback
        console.log(`Generation successful. Credits used: ${response.creditsUsed}, Remaining: ${response.creditsRemaining}`)
      } else {
        // Handle specific error cases
        if (response.error === 'insufficient_credits') {
          setError(
            `Insufficient credits. You need ${requiredCredits} credits but have ${response.currentCredits || 0}.`
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
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black uppercase mb-4 tracking-tighter">
            Generate Enhanced Prompt
          </h1>
          <div className="flex items-center gap-4 font-mono font-bold">
            <span className="text-lg">
              Credits: <span className="text-neo-pink text-2xl">{credits}</span>
            </span>
            <span className="text-lg">
              Tier: <span className="text-neo-blue uppercase">{tier}</span>
            </span>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-black uppercase mb-4 tracking-wider">Select Quality Tier</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(TIER_INFO) as Array<keyof typeof TIER_INFO>).map((t) => {
              const info = TIER_INFO[t]
              const isSelected = selectedTier === t
              const canAfford = credits >= info.cost
              
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  disabled={!canAfford}
                  className={`p-6 border-3 border-black font-black uppercase transition-all rounded-neo shadow-neo ${
                    isSelected
                      ? `${info.color} text-black`
                      : canAfford
                      ? 'bg-white text-black hover:bg-neo-yellow'
                      : 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed'
                  } ${!canAfford ? '' : 'hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'}`}
                >
                  <div className="text-xl mb-2">{info.name}</div>
                  <div className="text-sm font-mono mb-3">{info.cost} credit{info.cost > 1 ? 's' : ''}</div>
                  <div className="text-xs font-mono font-normal normal-case leading-relaxed">
                    {info.description}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Input */}
        <div className="mb-8">
          <label className="block text-xl font-black uppercase mb-3 tracking-wider">
            Your Prompt Idea
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Ctrl+Enter or Cmd+Enter to generate
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                if (!loading && input.trim() && credits >= TIER_INFO[selectedTier].cost) {
                  handleGenerate()
                }
              }
            }}
            placeholder="Enter your prompt idea... (e.g., 'Build a React dashboard with authentication')"
            rows={6}
            maxLength={10000}
            className="w-full p-6 border-3 border-black font-mono font-bold text-lg rounded-neo shadow-neo focus:outline-none focus:ring-4 focus:ring-neo-pink bg-white"
          />
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm font-mono text-neutral-500">
              Press <kbd className="px-1.5 py-0.5 bg-neutral-200 rounded text-xs">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-neutral-200 rounded text-xs">Enter</kbd> to generate
            </span>
            <span className={`text-sm font-mono font-bold ${
              input.length > 9000 ? 'text-red-600' : 
              input.length > 7500 ? 'text-orange-500' : 
              input.length > 5000 ? 'text-yellow-600' : 'text-neutral-500'
            }`}>
              {input.length.toLocaleString()} / 10,000
            </span>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim() || credits < TIER_INFO[selectedTier].cost || creditsLoading}
          className="w-full bg-neo-pink text-white py-6 font-black uppercase text-xl border-3 border-black shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 rounded-neo mb-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate Enhanced Prompt ({TIER_INFO[selectedTier].cost} credit{TIER_INFO[selectedTier].cost > 1 ? 's' : ''})
            </>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-6 bg-red-100 border-3 border-red-600 rounded-neo flex items-start gap-4 shadow-neo">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="font-mono font-bold text-red-800 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="p-8 bg-neo-green border-3 border-black rounded-neo shadow-neo-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black uppercase tracking-wider">✨ Enhanced Prompt</h3>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-black text-white font-black uppercase border-3 border-black hover:bg-neutral-800 transition-all flex items-center gap-2 rounded-neo"
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
            
            <div className="p-6 bg-white border-2 border-black rounded-neo mb-4">
              <p className="font-mono font-bold text-base leading-relaxed whitespace-pre-wrap">
                {result}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm font-mono font-bold text-black/60">
              {provider && (
                <span>Generated using: <span className="uppercase">{provider}</span></span>
              )}
              <span className="text-neo-pink">
                Credits remaining: <span className="text-lg">{credits}</span>
              </span>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 p-6 bg-white border-3 border-black rounded-neo shadow-neo">
          <h4 className="text-lg font-black uppercase mb-3">💡 Tips for Better Results</h4>
          <ul className="space-y-2 font-mono font-bold text-sm">
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
