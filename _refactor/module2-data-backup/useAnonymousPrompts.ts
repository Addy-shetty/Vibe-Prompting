/**
 * Hook for Managing Anonymous Prompts in localStorage
 * 
 * WHY: Centralizes all localStorage interactions with Zod validation.
 * Prevents corrupted data from crashing the app and provides type safety.
 * 
 * TARGET LOCATION: /src/hooks/useAnonymousPrompts.ts
 */
import { useState, useEffect, useCallback } from 'react'
import { 
  Prompt, 
  PromptCollection, 
  PromptCollectionSchema,
  safeValidatePrompt 
} from '@/schemas/promptSchemas'

const STORAGE_KEY = 'vibe-prompting-anonymous-prompts'
const CURRENT_VERSION = 1

interface UseAnonymousPromptsReturn {
  prompts: Prompt[]
  loading: boolean
  error: string | null
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt'>) => Prompt
  updatePrompt: (id: string, updates: Partial<Prompt>) => boolean
  deletePrompt: (id: string) => boolean
  clearAll: () => void
  getPromptById: (id: string) => Prompt | undefined
  toggleFavorite: (id: string) => boolean
}

/**
 * Generates a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Safely loads prompts from localStorage with validation
 */
function loadFromStorage(): PromptCollection {
  const defaultCollection: PromptCollection = {
    version: CURRENT_VERSION,
    prompts: [],
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultCollection

    const parsed = JSON.parse(stored)
    const validated = PromptCollectionSchema.safeParse(parsed)

    if (validated.success) {
      return validated.data
    }

    // If validation fails, log error but return empty collection
    // Don't crash the app due to corrupted data
    console.error('Invalid prompt data in localStorage:', validated.error)
    return defaultCollection
  } catch (err) {
    console.error('Failed to load prompts from localStorage:', err)
    return defaultCollection
  }
}

/**
 * Saves prompts to localStorage
 */
function saveToStorage(collection: PromptCollection): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection))
    return true
  } catch (err) {
    console.error('Failed to save prompts to localStorage:', err)
    return false
  }
}

/**
 * Hook for managing anonymous user prompts
 * Provides CRUD operations with localStorage persistence and Zod validation
 */
export function useAnonymousPrompts(): UseAnonymousPromptsReturn {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load prompts on mount
  useEffect(() => {
    try {
      const collection = loadFromStorage()
      setPrompts(collection.prompts)
      setError(null)
    } catch (err) {
      setError('Failed to load prompts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save prompts whenever they change
  useEffect(() => {
    if (!loading) {
      const collection: PromptCollection = {
        version: CURRENT_VERSION,
        prompts,
      }
      saveToStorage(collection)
    }
  }, [prompts, loading])

  /**
   * Add a new prompt
   */
  const addPrompt = useCallback((promptData: Omit<Prompt, 'id' | 'createdAt'>): Prompt => {
    const newPrompt: Prompt = {
      ...promptData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    }

    // Validate before adding
    const validated = safeValidatePrompt(newPrompt)
    if (!validated) {
      throw new Error('Invalid prompt data')
    }

    setPrompts((prev) => [validated, ...prev])
    return validated
  }, [])

  /**
   * Update an existing prompt
   */
  const updatePrompt = useCallback((id: string, updates: Partial<Prompt>): boolean => {
    let updated = false
    
    setPrompts((prev) =>
      prev.map((prompt) => {
        if (prompt.id === id) {
          const updatedPrompt = {
            ...prompt,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
          const validated = safeValidatePrompt(updatedPrompt)
          if (validated) {
            updated = true
            return validated
          }
        }
        return prompt
      })
    )

    return updated
  }, [])

  /**
   * Delete a prompt by ID
   */
  const deletePrompt = useCallback((id: string): boolean => {
    let deleted = false
    
    setPrompts((prev) => {
      const newPrompts = prev.filter((p) => p.id !== id)
      deleted = newPrompts.length < prev.length
      return newPrompts
    })

    return deleted
  }, [])

  /**
   * Clear all prompts
   */
  const clearAll = useCallback(() => {
    setPrompts([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  /**
   * Get a prompt by ID
   */
  const getPromptById = useCallback((id: string): Prompt | undefined => {
    return prompts.find((p) => p.id === id)
  }, [prompts])

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback((id: string): boolean => {
    return updatePrompt(id, { 
      isFavorite: !prompts.find((p) => p.id === id)?.isFavorite 
    })
  }, [prompts, updatePrompt])

  return {
    prompts,
    loading,
    error,
    addPrompt,
    updatePrompt,
    deletePrompt,
    clearAll,
    getPromptById,
    toggleFavorite,
  }
}
