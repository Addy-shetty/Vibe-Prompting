/**
 * Service Layer Index
 * 
 * WHY: Clean exports for the service layer module
 * 
 * TARGET LOCATION: /src/services/index.ts
 */

// Types
export * from './types'

// Services
export { SupabasePromptService, promptService } from './SupabasePromptService'
export { MockPromptService, mockPromptService } from './MockPromptService'

// Context
export { ServiceProvider, useServices, usePromptService } from './ServiceContext'
