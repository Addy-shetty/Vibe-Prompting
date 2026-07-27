/**
 * Supabase Edge Function Implementation of Prompt Generation Service
 * 
 * WHY: Encapsulates all Supabase-specific logic. The UI components only
 * interact with the IPromptGenerationService interface, not with Supabase directly.
 * This makes testing easier and allows swapping backends.
 * 
 * TARGET LOCATION: /src/services/SupabasePromptService.ts
 */
import { supabase } from '@/lib/supabase'
import {
  IPromptGenerationService,
  GeneratePromptRequest,
  GeneratePromptResponse,
  UserCredits,
  PromptHistoryItem,
  CREDIT_COSTS,
} from './types'

/**
 * Complexity instructions for different tiers
 */
const COMPLEXITY_INSTRUCTIONS: Record<string, string> = {
  basic: `Focus on clarity and core functionality. Keep it concise (50-150 words). Structure: Objective, Core Requirements, Tech Stack.`,
  advanced: `Include error handling and edge cases. Add performance optimization notes. Specify coding standards and best practices. Keep it detailed (150-300 words). Structure: Objective, Detailed Requirements, Error Handling, Tech Stack, Constraints.`,
  expert: `Comprehensive architecture and system design. Include UI/UX specifications. Detail backend schema, security policies, and auth. Add testing strategies and deployment notes. Keep it extensive (300-600 words). Structure: System Overview, Architecture, UI/UX, Backend/Schema, Security, Testing, Deployment.`,
}

/**
 * Supabase-based implementation of the Prompt Generation Service
 */
export class SupabasePromptService implements IPromptGenerationService {
  private geminiApiKey: string | undefined

  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession()
    return session !== null
  }

  /**
   * Get current user's credits from profiles table
   */
  async getUserCredits(): Promise<{ data: UserCredits | null; error: string | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return { data: null, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('credits, tier')
        .eq('id', session.user.id)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return {
        data: {
          credits: data?.credits ?? 10,
          tier: data?.tier ?? 'free',
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

  /**
   * Get user's prompt history
   */
  async getPromptHistory(limit = 20): Promise<{ data: PromptHistoryItem[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('id, title, content, category, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return { data: null, error: error.message }
      }

      const prompts: PromptHistoryItem[] = (data || []).map((p) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        category: p.category,
        createdAt: p.created_at,
      }))

      return { data: prompts, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  }

  /**
   * Generate an enhanced prompt
   * Tries Edge Function first, falls back to direct Gemini API
   */
  async generatePrompt(request: GeneratePromptRequest): Promise<GeneratePromptResponse> {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return {
        success: false,
        error: 'unauthorized',
        message: 'You must be logged in to generate prompts',
      }
    }

    const creditsNeeded = CREDIT_COSTS[request.tier]
    const requestId = `${session.user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Try Edge Function first
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: {
          userInput: request.userInput,
          tier: request.tier,
          requestId,
          metadata: request.metadata,
        },
      })

      if (!error && data?.success) {
        return data as GeneratePromptResponse
      }
    } catch (edgeFnError) {
      console.warn('Edge function unavailable, using fallback')
    }

    // Fallback: Direct Gemini API call
    return this.generateWithFallback(request, session.user.id, creditsNeeded)
  }

  /**
   * Fallback generation using direct Gemini API
   */
  private async generateWithFallback(
    request: GeneratePromptRequest,
    userId: string,
    creditsNeeded: number
  ): Promise<GeneratePromptResponse> {
    // Check credits
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

    // Generate with Gemini
    const generatedPrompt = await this.callGeminiAPI(request.userInput, request.tier)

    // Save to prompts table
    await supabase.from('prompts').insert({
      user_id: userId,
      title: request.userInput.substring(0, 100),
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
   * Direct Gemini API call
   */
  private async callGeminiAPI(input: string, tier: string): Promise<string> {
    if (!this.geminiApiKey) {
      return this.generateTemplateFallback(input, tier)
    }

    const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
${COMPLEXITY_INSTRUCTIONS[tier] || COMPLEXITY_INSTRUCTIONS.basic}

Output ONLY the generated prompt, no explanations or meta-commentary.

User input: ${input}`

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiApiKey}`,
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
      return this.generateTemplateFallback(input, tier)
    }
  }

  /**
   * Template fallback when API fails
   */
  private generateTemplateFallback(input: string, tier: string): string {
    const templates: Record<string, string> = {
      basic: `Enhanced prompt: ${input}\n\nPlease provide a clear and detailed response with examples where appropriate.`,
      advanced: `Act as an expert in this domain. Regarding: "${input}"\n\nPlease provide:\n1. Detailed analysis\n2. Step-by-step approach\n3. Best practices\n4. Concrete examples\n5. Potential pitfalls to avoid`,
      expert: `You are a world-class expert with deep knowledge in this field. Task: "${input}"\n\nProvide a comprehensive response including:\n\n1. Executive Summary\n2. Detailed Technical Analysis\n3. Implementation Strategy\n4. Code examples (where applicable)\n5. Edge cases and error handling\n6. Performance considerations\n7. Security best practices\n8. Testing approach\n9. Documentation requirements\n10. Real-world examples\n\nEnsure your response is actionable and production-ready.`,
    }

    return templates[tier] || templates.basic
  }
}

/**
 * Singleton instance of the service
 */
export const promptService = new SupabasePromptService()
