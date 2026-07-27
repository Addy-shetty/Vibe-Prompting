/**
 * Prompt Generation Service Interface
 * 
 * WHY: Defines a contract for prompt generation that can be implemented
 * by different backends (Edge Functions, Mock, etc.). This enables:
 * - Easy testing with mock implementations
 * - Swapping backends without changing UI code
 * - Clear separation of concerns
 * 
 * TARGET LOCATION: /src/services/types.ts
 */

/**
 * Tier levels for prompt generation
 */
export type PromptTier = 'basic' | 'advanced' | 'expert'

/**
 * Parameters for generating a prompt
 */
export interface GeneratePromptRequest {
  userInput: string
  tier: PromptTier
  metadata?: Record<string, unknown>
}

/**
 * Successful generation response
 */
export interface GeneratePromptSuccess {
  success: true
  prompt: string
  creditsUsed: number
  creditsRemaining: number
  provider: string
  tier: string
}

/**
 * Failed generation response
 */
export interface GeneratePromptError {
  success: false
  error: string
  message: string
  currentCredits?: number
  retryAfter?: number
}

/**
 * Union type for generation response
 */
export type GeneratePromptResponse = GeneratePromptSuccess | GeneratePromptError

/**
 * User credits information
 */
export interface UserCredits {
  credits: number
  tier: string
}

/**
 * Prompt history item
 */
export interface PromptHistoryItem {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  tier?: string
}

/**
 * Service interface for prompt generation
 * Any implementation must fulfill this contract
 */
export interface IPromptGenerationService {
  /**
   * Generate an enhanced prompt
   */
  generatePrompt(request: GeneratePromptRequest): Promise<GeneratePromptResponse>

  /**
   * Get current user's credits
   */
  getUserCredits(): Promise<{ data: UserCredits | null; error: string | null }>

  /**
   * Get user's prompt history
   */
  getPromptHistory(limit?: number): Promise<{ data: PromptHistoryItem[] | null; error: string | null }>

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>
}

/**
 * Credit costs by tier
 * Kept here for consistency across implementations
 */
export const CREDIT_COSTS: Record<PromptTier, number> = {
  basic: 5,
  advanced: 3,
  expert: 2,
}
