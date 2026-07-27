/**
 * Service Factory and Context Provider
 * 
 * WHY: Provides a way to inject different service implementations
 * (real or mock) throughout the app using React Context. This enables:
 * - Testing with mock services
 * - Development mode with mock data
 * - Production with real Supabase service
 * 
 * TARGET LOCATION: /src/services/ServiceContext.tsx
 */
import React, { createContext, useContext, ReactNode, useMemo } from 'react'
import { IPromptGenerationService } from './types'
import { SupabasePromptService } from './SupabasePromptService'
import { MockPromptService } from './MockPromptService'

/**
 * Service context type
 */
interface ServiceContextType {
  promptService: IPromptGenerationService
}

/**
 * Create context with undefined default
 */
const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

/**
 * Environment detection
 */
const isDevelopment = import.meta.env.DEV
const useMockServices = import.meta.env.VITE_USE_MOCK_SERVICES === 'true'

/**
 * Create appropriate service based on environment
 */
function createPromptService(): IPromptGenerationService {
  // Use mock if explicitly enabled or in test environment
  if (useMockServices || import.meta.env.MODE === 'test') {
    console.log('🧪 Using Mock Prompt Service')
    return new MockPromptService({ simulateDelay: true, delayMs: 300 })
  }

  // Use real service in production and development
  if (isDevelopment) {
    console.log('🔧 Using Supabase Prompt Service (Development)')
  }
  
  return new SupabasePromptService()
}

/**
 * Props for ServiceProvider
 */
interface ServiceProviderProps {
  children: ReactNode
  /**
   * Optional custom prompt service (useful for testing)
   */
  promptService?: IPromptGenerationService
}

/**
 * Service Provider Component
 * Wraps the app and provides services via context
 */
export function ServiceProvider({ children, promptService }: ServiceProviderProps) {
  // Memoize service creation to prevent unnecessary re-renders
  const services = useMemo<ServiceContextType>(() => ({
    promptService: promptService ?? createPromptService(),
  }), [promptService])

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  )
}

/**
 * Hook to access the prompt service
 * 
 * @example
 * function MyComponent() {
 *   const { promptService } = useServices()
 *   
 *   const handleGenerate = async () => {
 *     const result = await promptService.generatePrompt({
 *       userInput: 'Create a React app',
 *       tier: 'basic',
 *     })
 *   }
 * }
 */
export function useServices(): ServiceContextType {
  const context = useContext(ServiceContext)
  
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider')
  }
  
  return context
}

/**
 * Hook specifically for prompt service
 */
export function usePromptService(): IPromptGenerationService {
  const { promptService } = useServices()
  return promptService
}
