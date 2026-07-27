/**
 * Example: Refactored GeneratePromptPage using Service Layer
 * 
 * WHY: Shows how to migrate from direct Supabase calls to using
 * the service layer. The component now only depends on the interface,
 * making it testable with mock services.
 * 
 * TARGET LOCATION: /src/pages/GeneratePromptPageRefactored.tsx
 * (Replace or merge with existing GeneratePromptPageSecure.tsx)
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles, AlertCircle, Copy, CheckCheck } from 'lucide-react'
import { usePromptService } from '@/services/ServiceContext'
import { useCredits } from '@/hooks/useCreditsSecure'
import { useAuth } from '@/context/AuthContext'
import { CREDIT_COSTS, PromptTier } from '@/services/types'
import toast from 'react-hot-toast'

/**
 * Tier information for UI display
 */
const TIER_INFO: Record<PromptTier, { name: string; description: string; color: string }> = {
  basic: {
    name: 'Basic',
    description: 'Simple prompt enhancement with clarity improvements',
    color: 'bg-neo-yellow',
  },
  advanced: {
    name: 'Advanced',
    description: 'Detailed prompt with context, examples, and best practices',
    color: 'bg-neo-blue',
  },
  expert: {
    name: 'Expert',
    description: 'Production-grade prompt with comprehensive technical details',
    color: 'bg-neo-pink',
  },
}

export default function GeneratePromptPageRefactored() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { credits, refetch: refetchCredits } = useCredits()
  
  // Get the prompt service from context (can be real or mock)
  const promptService = usePromptService()

  const [input, setInput] = useState('')
  const [selectedTier, setSelectedTier] = useState<PromptTier>('basic')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle prompt generation
   * Now uses the service layer instead of direct API calls
   */
  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter a prompt idea')
      return
    }

    const requiredCredits = CREDIT_COSTS[selectedTier]
    if (credits < requiredCredits) {
      toast.error(`Not enough credits. You need ${requiredCredits} but have ${credits}.`)
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedPrompt(null)

    try {
      // Use the service layer - abstracts away Supabase details
      const result = await promptService.generatePrompt({
        userInput: input.trim(),
        tier: selectedTier,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'web_app',
        },
      })

      if (result.success) {
        setGeneratedPrompt(result.prompt)
        toast.success(`Prompt generated! Used ${result.creditsUsed} credits.`)
        refetchCredits() // Refresh credit display
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Copy generated prompt to clipboard
   */
  const handleCopy = async () => {
    if (!generatedPrompt) return

    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  // Redirect if not authenticated
  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black">Generate Prompt</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform your idea into a powerful AI prompt
          </p>
        </div>

        {/* Credits Display */}
        <div className="text-center">
          <span className="text-sm">Credits: </span>
          <span className="font-bold text-xl">{credits}</span>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build or accomplish..."
            className="w-full h-40 p-4 border-4 border-black rounded-lg resize-none
                     focus:outline-none focus:ring-4 focus:ring-neo-yellow"
            maxLength={10000}
          />
          <div className="text-right text-sm text-gray-500">
            {input.length} / 10,000
          </div>
        </div>

        {/* Tier Selection */}
        <div className="grid grid-cols-3 gap-4">
          {(Object.keys(TIER_INFO) as PromptTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`p-4 border-4 border-black rounded-lg transition-all
                       ${selectedTier === tier
                         ? `${TIER_INFO[tier].color} translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_#000]`
                         : 'bg-white hover:bg-gray-50'
                       }`}
            >
              <div className="font-bold">{TIER_INFO[tier].name}</div>
              <div className="text-sm">{CREDIT_COSTS[tier]} credits</div>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !input.trim()}
          className="w-full py-4 bg-neo-pink border-4 border-black rounded-lg font-bold text-lg
                   hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]
                   transition-all disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate ({CREDIT_COSTS[selectedTier]} credits)
            </>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 border-4 border-red-500 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Generated Prompt */}
        {generatedPrompt && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Enhanced Prompt
              </h2>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-black text-white rounded flex items-center gap-2
                         hover:bg-gray-800 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="p-6 bg-neo-green border-4 border-black rounded-lg">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {generatedPrompt}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
