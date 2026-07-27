/**
 * Mock Implementation of Prompt Generation Service
 * 
 * WHY: Enables testing without hitting real APIs or Supabase.
 * Also useful for development when backend is unavailable.
 * 
 * TARGET LOCATION: /src/services/MockPromptService.ts
 */
import {
  IPromptGenerationService,
  GeneratePromptRequest,
  GeneratePromptResponse,
  UserCredits,
  PromptHistoryItem,
  CREDIT_COSTS,
} from './types'

/**
 * Configuration for mock service behavior
 */
interface MockConfig {
  initialCredits: number
  simulateDelay: boolean
  delayMs: number
  shouldFail: boolean
  failureMessage: string
}

const DEFAULT_CONFIG: MockConfig = {
  initialCredits: 10,
  simulateDelay: true,
  delayMs: 500,
  shouldFail: false,
  failureMessage: 'Mock service failure',
}

/**
 * Mock implementation for testing and development
 */
export class MockPromptService implements IPromptGenerationService {
  private config: MockConfig
  private credits: number
  private history: PromptHistoryItem[] = []
  private isLoggedIn: boolean = true

  constructor(config: Partial<MockConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.credits = this.config.initialCredits
  }

  /**
   * Set whether the mock user is authenticated
   */
  setAuthenticated(value: boolean): void {
    this.isLoggedIn = value
  }

  /**
   * Set the mock credits
   */
  setCredits(value: number): void {
    this.credits = value
  }

  /**
   * Configure mock to fail
   */
  setFailure(shouldFail: boolean, message?: string): void {
    this.config.shouldFail = shouldFail
    if (message) {
      this.config.failureMessage = message
    }
  }

  /**
   * Reset mock state
   */
  reset(): void {
    this.credits = this.config.initialCredits
    this.history = []
    this.isLoggedIn = true
    this.config.shouldFail = false
  }

  /**
   * Simulate network delay
   */
  private async delay(): Promise<void> {
    if (this.config.simulateDelay) {
      await new Promise((resolve) => setTimeout(resolve, this.config.delayMs))
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    await this.delay()
    return this.isLoggedIn
  }

  /**
   * Get mock user credits
   */
  async getUserCredits(): Promise<{ data: UserCredits | null; error: string | null }> {
    await this.delay()

    if (!this.isLoggedIn) {
      return { data: null, error: 'Not authenticated' }
    }

    if (this.config.shouldFail) {
      return { data: null, error: this.config.failureMessage }
    }

    return {
      data: {
        credits: this.credits,
        tier: 'free',
      },
      error: null,
    }
  }

  /**
   * Get mock prompt history
   */
  async getPromptHistory(limit = 20): Promise<{ data: PromptHistoryItem[] | null; error: string | null }> {
    await this.delay()

    if (!this.isLoggedIn) {
      return { data: null, error: 'Not authenticated' }
    }

    if (this.config.shouldFail) {
      return { data: null, error: this.config.failureMessage }
    }

    return {
      data: this.history.slice(0, limit),
      error: null,
    }
  }

  /**
   * Generate a mock prompt
   */
  async generatePrompt(request: GeneratePromptRequest): Promise<GeneratePromptResponse> {
    await this.delay()

    if (!this.isLoggedIn) {
      return {
        success: false,
        error: 'unauthorized',
        message: 'You must be logged in to generate prompts',
      }
    }

    if (this.config.shouldFail) {
      return {
        success: false,
        error: 'mock_failure',
        message: this.config.failureMessage,
      }
    }

    const creditsNeeded = CREDIT_COSTS[request.tier]

    if (this.credits < creditsNeeded) {
      return {
        success: false,
        error: 'insufficient_credits',
        message: `You need ${creditsNeeded} credits but have ${this.credits}.`,
        currentCredits: this.credits,
      }
    }

    // Deduct credits
    this.credits -= creditsNeeded

    // Generate mock prompt
    const generatedPrompt = this.generateMockPrompt(request.userInput, request.tier)

    // Add to history
    const historyItem: PromptHistoryItem = {
      id: `mock-${Date.now()}`,
      title: request.userInput.substring(0, 50),
      content: generatedPrompt,
      category: 'Generated',
      createdAt: new Date().toISOString(),
      tier: request.tier,
    }
    this.history.unshift(historyItem)

    return {
      success: true,
      prompt: generatedPrompt,
      creditsUsed: creditsNeeded,
      creditsRemaining: this.credits,
      provider: 'mock',
      tier: 'free',
    }
  }

  /**
   * Generate a mock enhanced prompt
   */
  private generateMockPrompt(input: string, tier: string): string {
    const enhancementsByTier: Record<string, string> = {
      basic: `[MOCK BASIC] Enhanced prompt for: "${input}"

Please provide a clear response with relevant examples.`,
      
      advanced: `[MOCK ADVANCED] Expert prompt for: "${input}"

Please analyze this topic and provide:
1. Detailed explanation
2. Step-by-step approach
3. Best practices
4. Real-world examples
5. Common pitfalls to avoid`,
      
      expert: `[MOCK EXPERT] Production-ready prompt for: "${input}"

As a world-class expert, provide:

## System Overview
Comprehensive analysis of the requirements

## Architecture
Technical architecture and design patterns

## Implementation
Step-by-step implementation guide with code examples

## Testing
Unit and integration testing strategies

## Deployment
Production deployment considerations

## Security
Security best practices and considerations`,
    }

    return enhancementsByTier[tier] || enhancementsByTier.basic
  }
}

/**
 * Pre-configured mock instance for quick testing
 */
export const mockPromptService = new MockPromptService()
