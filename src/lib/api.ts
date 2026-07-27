import { supabase } from './supabase'

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000

// Credit costs
const CREDIT_COSTS = {
  basic: 5,
  advanced: 3,
  expert: 2,
}

export interface GeneratePromptParams {
  userInput: string
  tier: 'basic' | 'advanced' | 'expert'
  category?: string
  metadata?: Record<string, unknown>
}

export interface GeneratePromptResponse {
  success: boolean
  prompt?: string
  creditsUsed?: number
  creditsRemaining?: number
  promptId?: string
  tier?: string
  provider?: string
  error?: string
  message?: string
  retryAfter?: number
}

/**
 * Generate an AI-enhanced prompt
 * Uses the new v3 secure credit system
 */
export async function generatePrompt(
  params: GeneratePromptParams
): Promise<GeneratePromptResponse> {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return {
        success: false,
        error: 'unauthorized',
        message: 'You must be logged in to generate prompts',
      }
    }

    // Generate idempotency key
    const requestId = `${session.user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const creditsNeeded = CREDIT_COSTS[params.tier]

    // Call the secure Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: {
          userInput: params.userInput,
          tier: params.tier,
          category: params.category || 'default',
          requestId,
          metadata: {
            ...params.metadata,
            timestamp: new Date().toISOString(),
            source: 'web_app',
          },
        },
        headers: {
          'X-Request-ID': requestId,
        },
      })

      if (!error && data?.success) {
        return {
          success: true,
          prompt: data.prompt,
          creditsUsed: data.creditsUsed,
          creditsRemaining: data.creditsRemaining,
          promptId: data.promptId,
          tier: params.tier,
          provider: data.provider,
        }
      }

      // Handle specific error types
      if (data?.error === 'insufficient_credits') {
        return {
          success: false,
          error: 'insufficient_credits',
          message: `You need ${creditsNeeded} credits but have ${data.currentCredits || 0}.`,
          creditsRemaining: data.currentCredits,
        }
      }

      if (data?.error === 'rate_limit_exceeded') {
        return {
          success: false,
          error: 'rate_limit_exceeded',
          message: 'Too many requests. Please wait before trying again.',
          retryAfter: data.retryAfter,
        }
      }

      console.warn('Edge function failed:', error?.message || data?.error)
    } catch (edgeFnError) {
      console.warn('Edge function error:', edgeFnError)
    }

    // Fallback: Direct Supabase call (less secure but functional)
    return await fallbackGenerate(params, session.user.id, creditsNeeded, requestId)
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
 * Fallback generation when Edge Function fails
 */
async function fallbackGenerate(
  params: GeneratePromptParams,
  userId: string,
  creditsNeeded: number,
  requestId: string
): Promise<GeneratePromptResponse> {
  try {
    // Check and consume credits via RPC
    const { data: creditResult, error: creditError } = await supabase.rpc('consume_credits', {
      p_user_id: userId,
      p_amount: creditsNeeded,
      p_type: 'usage',
      p_description: `Generated ${params.tier} tier prompt (fallback)`,
      p_request_id: requestId,
    })

    if (creditError || !creditResult?.success) {
      return {
        success: false,
        error: creditResult?.error || 'credit_error',
        message: creditResult?.message || 'Failed to process credits',
        creditsRemaining: creditResult?.current_credits,
      }
    }

    // Simple template fallback
    const templates = {
      basic: `Enhanced prompt: ${params.userInput}\n\nPlease provide a clear and detailed response with examples where appropriate.`,
      advanced: `Act as an expert in this domain. Regarding: "${params.userInput}"\n\nPlease provide detailed analysis and best practices.`,
      expert: `You are a world-class expert. Task: "${params.userInput}"\n\nProvide a comprehensive production-ready response.`,
    }

    const generatedPrompt = templates[params.tier]

    // Save to prompts table
    const { data: promptData } = await supabase.from('prompts').insert({
      user_id: userId,
      title: params.userInput.substring(0, 200),
      content: generatedPrompt,
      category: params.category || 'Generated',
      tier_used: params.tier,
      credits_used: creditsNeeded,
      is_public: false,
    }).select().single()

    return {
      success: true,
      prompt: generatedPrompt,
      creditsUsed: creditsNeeded,
      creditsRemaining: creditResult.credits_remaining,
      promptId: promptData?.id,
      tier: params.tier,
export interface SubmitFeedbackParams {
  promptId: string
  rating?: number
  copied?: boolean
  reused?: boolean
}

export async function submitFeedback(params: SubmitFeedbackParams) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const { error } = await supabase.functions.invoke('submit-feedback', {
      body: params,
    })
    return { success: !error, error: error?.message }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed' }
  }
}
      provider: 'fallback',
    }
  } catch (err) {
    console.error('Fallback generation failed:', err)
    return {
      success: false,
      error: 'fallback_failed',
      message: 'Generation failed. Please try again.',
    }
  }
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
      console.error('Error fetching prompt history:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Get user's credit transaction history
 */
export async function getCreditTransactionHistory(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching credit transactions:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Get user's security events
 */
export async function getSecurityEvents(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('security_events_v3')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching security events:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
