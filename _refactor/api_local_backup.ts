import { supabase } from './supabase'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type PromptTier = 'basic' | 'advanced' | 'expert'

export interface GeneratePromptParams {
  userInput: string
  tier: PromptTier
  metadata?: Record<string, unknown>
}

export interface GeneratePromptResponse {
  success: boolean
  prompt?: string
  creditsUsed?: number
  creditsRemaining?: number
  currentCredits?: number
  tier?: string
  provider?: string
  error?: string
  message?: string
  retryAfter?: number
}

export interface UsageStats {
  totalPrompts: number
  creditsUsed: number
  creditsRemaining: number
  tier: string
  lastGeneratedAt: string | null
}

/**
 * Interface for Prompt Service
 * All implementations must fulfill this contract
 */
export interface IPromptService {
  /**
   * Generate an enhanced prompt
   */
  generatePrompt(params: GeneratePromptParams): Promise<GeneratePromptResponse>

  /**
   * Get usage statistics for the current user
   */
  getUsageStats(): Promise<{ data: UsageStats | null; error: string | null }>
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CREDIT_COSTS: Record<PromptTier, number> = {
  basic: 5,
  advanced: 3,
  expert: 2,
}

const COMPLEXITY_INSTRUCTIONS: Record<string, string> = {
  basic: `Focus on clarity and core functionality. Keep it concise (50-150 words). Structure: Objective, Core Requirements, Tech Stack.`,
  advanced: `Include error handling and edge cases. Add performance optimization notes. Specify coding standards and best practices. Keep it detailed (150-300 words). Structure: Objective, Detailed Requirements, Error Handling, Tech Stack, Constraints.`,
  expert: `Comprehensive architecture and system design. Include UI/UX specifications. Detail backend schema, security policies, and auth. Add testing strategies and deployment notes. Keep it extensive (300-600 words). Structure: System Overview, Architecture, UI/UX, Backend/Schema, Security, Testing, Deployment.`,
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Template fallback when API fails
 */
function generateTemplateFallback(input: string, tier: string): string {
  const templates: Record<string, string> = {
    basic: `Enhanced prompt: ${input}\n\nPlease provide a clear and detailed response with examples where appropriate.`,
    advanced: `Act as an expert in this domain. Regarding: "${input}"\n\nPlease provide:\n1. Detailed analysis\n2. Step-by-step approach\n3. Best practices\n4. Concrete examples\n5. Potential pitfalls to avoid`,
    expert: `You are a world-class expert with deep knowledge in this field. Task: "${input}"\n\nProvide a comprehensive response including:\n\n1. Executive Summary\n2. Detailed Technical Analysis\n3. Implementation Strategy with step-by-step breakdown\n4. Code examples (where applicable)\n5. Edge cases and error handling\n6. Performance considerations\n7. Security best practices\n8. Testing approach\n9. Documentation requirements\n10. Real-world examples from production systems\n\nEnsure your response is actionable and production-ready.`,
  }

  return templates[tier] || templates.basic
}

/**
 * Call Gemini API directly from browser
 */
async function callGeminiAPI(input: string, tier: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    console.warn('No VITE_GEMINI_API_KEY found, using template fallback')
    return generateTemplateFallback(input, tier)
  }

  const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
${COMPLEXITY_INSTRUCTIONS[tier] || COMPLEXITY_INSTRUCTIONS.basic}

Output ONLY the generated prompt, no explanations or meta-commentary.

User input: ${input}`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('No text in Gemini response')
    }

    return text.trim()
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return generateTemplateFallback(input, tier)
  }
}

// ============================================================================
// SUPABASE PROMPT SERVICE (Real Implementation)
// ============================================================================

/**
 * Real implementation using Supabase Edge Functions and Gemini API
 */
export class SupabasePromptService implements IPromptService {
  /**
   * Generate an AI-enhanced prompt
   * Tries Edge Function first, falls back to direct Gemini API
   */
  async generatePrompt(params: GeneratePromptParams): Promise<GeneratePromptResponse> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        return {
          success: false,
          error: 'unauthorized',
          message: 'You must be logged in to generate prompts',
        }
      }

      const requestId = `${session.user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`
      const creditsNeeded = CREDIT_COSTS[params.tier]

      // Try Edge Function first
      try {
        const { data, error } = await supabase.functions.invoke('generate-prompt', {
          body: {
            userInput: params.userInput,
            tier: params.tier,
            requestId,
            metadata: {
              ...params.metadata,
              timestamp: new Date().toISOString(),
              source: 'web_app',
            },
          },
          headers: { 'X-Request-ID': requestId },
        })

        if (!error && data?.success) {
          return data
        }

        console.warn('Edge function failed, trying fallback:', error?.message || data?.error)
      } catch (edgeFnError) {
        console.warn('Edge function not available:', edgeFnError)
      }

      // Fallback: Direct Supabase + Gemini API
      return this.generateWithFallback(params, session.user.id, creditsNeeded)
    } catch (err) {
      console.error('API call error:', err)
      return {
        success: false,
        error: 'network_error',
        message: err instanceof Error ? err.message : 'Network error occurred',
      }
    }
  }

  /**
   * Fallback generation using direct Gemini API
   */
  private async generateWithFallback(
    params: GeneratePromptParams,
    userId: string,
    creditsNeeded: number
  ): Promise<GeneratePromptResponse> {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, tier')
      .eq('id', userId)
      .single()

    if (profileError) {
      return {
        success: false,
        error: 'profile_error',
        message: 'Could not fetch your profile. Please try again.',
      }
    }

    const currentCredits = profile?.credits ?? 0

    if (currentCredits < creditsNeeded) {
      return {
        success: false,
        error: 'insufficient_credits',
        message: `You need ${creditsNeeded} credits but have ${currentCredits}.`,
        currentCredits,
      }
    }

    // Deduct credits
    const newCredits = currentCredits - creditsNeeded
    await supabase
      .from('profiles')
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq('id', userId)

    // Generate the prompt
    const generatedPrompt = await callGeminiAPI(params.userInput, params.tier)

    // Save to prompts table
    await supabase.from('prompts').insert({
      user_id: userId,
      title: params.userInput.substring(0, 100),
      content: generatedPrompt,
      category: 'Generated',
      is_public: false,
    })

    return {
      success: true,
      prompt: generatedPrompt,
      creditsUsed: creditsNeeded,
      creditsRemaining: newCredits,
      provider: 'gemini-fallback',
      tier: profile?.tier || 'free',
    }
  }

  /**
   * Get usage statistics for the current user
   */
  async getUsageStats(): Promise<{ data: UsageStats | null; error: string | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        return { data: null, error: 'Not authenticated' }
      }

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits, tier')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        return { data: null, error: profileError.message }
      }

      // Get prompt count and last generation
      const { data: prompts, error: promptsError } = await supabase
        .from('prompts')
        .select('created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (promptsError) {
        return { data: null, error: promptsError.message }
      }

      const totalPrompts = prompts?.length ?? 0
      const lastGeneratedAt = prompts?.[0]?.created_at ?? null

      // Estimate credits used (10 initial - current)
      const creditsUsed = Math.max(0, 10 - (profile?.credits ?? 0))

      return {
        data: {
          totalPrompts,
          creditsUsed,
          creditsRemaining: profile?.credits ?? 0,
          tier: profile?.tier ?? 'free',
          lastGeneratedAt,
        },
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  }
}

// ============================================================================
// MOCK PROMPT SERVICE (For Testing/Development)
// ============================================================================

/**
 * Mock implementation that returns hardcoded responses after a delay
 * Useful for testing and development without hitting real APIs
 */
export class MockPromptService implements IPromptService {
  private credits = 10
  private promptCount = 0

  /**
   * Generate a mock prompt after 1 second delay
   */
  async generatePrompt(params: GeneratePromptParams): Promise<GeneratePromptResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const creditsNeeded = CREDIT_COSTS[params.tier]

    if (this.credits < creditsNeeded) {
      return {
        success: false,
        error: 'insufficient_credits',
        message: `You need ${creditsNeeded} credits but have ${this.credits}.`,
        currentCredits: this.credits,
      }
    }

    this.credits -= creditsNeeded
    this.promptCount++

    return {
      success: true,
      prompt: `[MOCK] Enhanced prompt for: "${params.userInput}"\n\nThis is a mock response generated for testing purposes.\nTier: ${params.tier}\nTimestamp: ${new Date().toISOString()}`,
      creditsUsed: creditsNeeded,
      creditsRemaining: this.credits,
      provider: 'mock',
      tier: 'free',
    }
  }

  /**
   * Get mock usage statistics after 1 second delay
   */
  async getUsageStats(): Promise<{ data: UsageStats | null; error: string | null }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      data: {
        totalPrompts: this.promptCount,
        creditsUsed: 10 - this.credits,
        creditsRemaining: this.credits,
        tier: 'free',
        lastGeneratedAt: this.promptCount > 0 ? new Date().toISOString() : null,
      },
      error: null,
    }
  }

  /**
   * Reset mock state (useful for tests)
   */
  reset(): void {
    this.credits = 10
    this.promptCount = 0
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Create service instance based on environment
 * Set VITE_USE_MOCK=true in .env to use mock service
 */
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const promptService: IPromptService = useMock
  ? new MockPromptService()
  : new SupabasePromptService()

// Log which service is being used (development only)
if (import.meta.env.DEV) {
  console.log(`📡 Using ${useMock ? 'Mock' : 'Supabase'} Prompt Service`)
}

// ============================================================================
// LEGACY EXPORTS (for backwards compatibility)
// ============================================================================

/**
 * @deprecated Use promptService.generatePrompt() instead
 */
export async function generatePrompt(params: GeneratePromptParams): Promise<GeneratePromptResponse> {
  return promptService.generatePrompt(params)
}

/**
 * Fetch user's prompt history
 */
export async function getPromptHistory(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Get user's request log for debugging/auditing
 */
export async function getRequestLog(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('request_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
