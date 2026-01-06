import { supabase } from './supabase'

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

// Helper function for exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Credit costs (simpler = more credits)
const CREDIT_COSTS = {
  basic: 5,
  advanced: 3,
  expert: 2,
}

export interface GeneratePromptParams {
  userInput: string
  tier: 'basic' | 'advanced' | 'expert'
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

/**
 * Call Gemini API directly from browser
 */
async function callGeminiAPI(input: string, tier: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  if (!apiKey) {
    console.warn('No VITE_GEMINI_API_KEY found, using template fallback')
    return generateTemplateFallback(input, tier)
  }

  const complexityInstructions: Record<string, string> = {
    basic: `Focus on clarity and core functionality. Keep it concise (50-150 words). Structure: Objective, Core Requirements, Tech Stack.`,
    advanced: `Include error handling and edge cases. Add performance optimization notes. Specify coding standards and best practices. Keep it detailed (150-300 words). Structure: Objective, Detailed Requirements, Error Handling, Tech Stack, Constraints.`,
    expert: `Comprehensive architecture and system design. Include UI/UX specifications. Detail backend schema, security policies, and auth. Add testing strategies and deployment notes. Keep it extensive (300-600 words). Structure: System Overview, Architecture, UI/UX, Backend/Schema, Security, Testing, Deployment.`
  }

  const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
${complexityInstructions[tier] || complexityInstructions.basic}

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
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API error:', response.status, errorData)
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

/**
 * Template fallback when API fails
 */
function generateTemplateFallback(input: string, tier: string): string {
  const templates = {
    basic: `Enhanced prompt: ${input}\n\nPlease provide a clear and detailed response with examples where appropriate.`,
    advanced: `Act as an expert in this domain. Regarding: "${input}"\n\nPlease provide:\n1. Detailed analysis\n2. Step-by-step approach\n3. Best practices\n4. Concrete examples\n5. Potential pitfalls to avoid`,
    expert: `You are a world-class expert with deep knowledge in this field. Task: "${input}"\n\nProvide a comprehensive response including:\n\n1. Executive Summary\n2. Detailed Technical Analysis\n3. Implementation Strategy with step-by-step breakdown\n4. Code examples (where applicable)\n5. Edge cases and error handling\n6. Performance considerations\n7. Security best practices\n8. Testing approach\n9. Documentation requirements\n10. Real-world examples from production systems\n\nEnsure your response is actionable and production-ready.`,
  }

  return templates[tier as keyof typeof templates] || templates.basic
}

/**
 * Generate an AI-enhanced prompt
 * Tries Edge Function first, falls back to local generation
 * 
 * @param params - Generation parameters
 * @returns Response with generated prompt or error
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
        headers: {
          'X-Request-ID': requestId,
        },
      })

      if (!error && data?.success) {
        return data
      }

      console.warn('Edge function failed, trying fallback:', error?.message || data?.error)
    } catch (edgeFnError) {
      console.warn('Edge function not available:', edgeFnError)
    }

    // Fallback: Use direct Supabase + local prompt generation
    console.log('Using fallback mode...')

    // Check credits from profile directly
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, tier')
      .eq('id', session.user.id)
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

    // Deduct credits directly (less secure but works as fallback)
    const newCredits = currentCredits - creditsNeeded
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq('id', session.user.id)

    if (updateError) {
      console.error('Failed to update credits:', updateError)
      // Continue anyway - don't block generation
    }

    // Generate the prompt using Gemini API
    const generatedPrompt = await callGeminiAPI(params.userInput, params.tier)

    // Save to prompts table
    await supabase.from('prompts').insert({
      user_id: session.user.id,
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
      provider: 'fallback',
      tier: profile?.tier || 'free',
    }
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
 * Fetch user's prompt history
 * 
 * @param limit - Number of prompts to fetch (default: 20)
 * @returns Array of prompt objects or error
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
 * Get user's request log for debugging/auditing
 * 
 * @param limit - Number of logs to fetch (default: 50)
 * @returns Array of request log entries
 */
export async function getRequestLog(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('request_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching request log:', error)
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
