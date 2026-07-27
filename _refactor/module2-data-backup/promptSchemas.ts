/**
 * Zod Schemas for Anonymous Prompt Data
 * 
 * WHY: Validates data before saving to localStorage and before importing
 * from external JSON files. Prevents corrupted data from breaking the app.
 * 
 * TARGET LOCATION: /src/schemas/promptSchemas.ts
 */
import { z } from 'zod'

/**
 * Schema for a single prompt
 */
export const PromptSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(500),
  content: z.string().min(1).max(50000),
  category: z.string().default('Generated'),
  tier: z.enum(['basic', 'advanced', 'expert']).default('basic'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional().default([]),
  isFavorite: z.boolean().optional().default(false),
})

/**
 * Schema for the prompt collection (stored in localStorage)
 */
export const PromptCollectionSchema = z.object({
  version: z.number().default(1),
  prompts: z.array(PromptSchema),
  exportedAt: z.string().datetime().optional(),
  source: z.literal('vibe-prompting').optional(),
})

/**
 * Schema for backup file (stricter validation for imports)
 */
export const BackupFileSchema = z.object({
  version: z.number().min(1).max(10),
  source: z.literal('vibe-prompting'),
  exportedAt: z.string().datetime(),
  prompts: z.array(PromptSchema).min(0).max(10000),
})

// TypeScript types derived from schemas
export type Prompt = z.infer<typeof PromptSchema>
export type PromptCollection = z.infer<typeof PromptCollectionSchema>
export type BackupFile = z.infer<typeof BackupFileSchema>

/**
 * Validates a prompt object
 * Returns the validated prompt or throws ZodError
 */
export function validatePrompt(data: unknown): Prompt {
  return PromptSchema.parse(data)
}

/**
 * Safely validates a prompt, returning null on failure
 */
export function safeValidatePrompt(data: unknown): Prompt | null {
  const result = PromptSchema.safeParse(data)
  return result.success ? result.data : null
}

/**
 * Validates a backup file for import
 */
export function validateBackupFile(data: unknown): BackupFile {
  return BackupFileSchema.parse(data)
}

/**
 * Safely validates a backup file
 */
export function safeValidateBackupFile(data: unknown): { 
  success: true; data: BackupFile 
} | { 
  success: false; error: string 
} {
  const result = BackupFileSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  // Format Zod errors into readable message
  const errorMessages = result.error.issues.map(
    (issue) => `${issue.path.join('.')}: ${issue.message}`
  ).join('; ')
  
  return { success: false, error: errorMessages }
}
