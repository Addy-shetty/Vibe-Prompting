/**
 * Hook for Prompt Backup and Restore
 * 
 * WHY: Allows users to export their prompts as JSON for backup
 * and import them back, preventing data loss from cache clears.
 * Uses Zod validation to ensure imported data is valid.
 * 
 * TARGET LOCATION: /src/hooks/usePromptBackup.ts
 */
import { useCallback, useState } from 'react'
import { 
  Prompt, 
  BackupFile,
  safeValidateBackupFile 
} from '@/schemas/promptSchemas'

interface BackupResult {
  success: boolean
  error?: string
  filename?: string
}

interface RestoreResult {
  success: boolean
  error?: string
  promptsRestored?: number
  promptsSkipped?: number
}

interface UsePromptBackupReturn {
  isExporting: boolean
  isImporting: boolean
  lastError: string | null
  exportToFile: (prompts: Prompt[]) => Promise<BackupResult>
  importFromFile: (file: File) => Promise<RestoreResult>
  validateFile: (file: File) => Promise<{ valid: boolean; error?: string; promptCount?: number }>
}

/**
 * Generates a timestamped filename for backup
 */
function generateBackupFilename(): string {
  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const time = new Date().toTimeString().slice(0, 5).replace(':', '-') // HH-MM
  return `vibe-backup-${date}-${time}.json`
}

/**
 * Triggers a file download in the browser
 */
function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object
  URL.revokeObjectURL(url)
}

/**
 * Reads a file as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Hook for backing up and restoring prompts
 */
export function usePromptBackup(): UsePromptBackupReturn {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  /**
   * Export prompts to a JSON file
   */
  const exportToFile = useCallback(async (prompts: Prompt[]): Promise<BackupResult> => {
    setIsExporting(true)
    setLastError(null)

    try {
      const backupData: BackupFile = {
        version: 1,
        source: 'vibe-prompting',
        exportedAt: new Date().toISOString(),
        prompts,
      }

      const filename = generateBackupFilename()
      const jsonContent = JSON.stringify(backupData, null, 2)
      
      downloadFile(jsonContent, filename)

      return { success: true, filename }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed'
      setLastError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsExporting(false)
    }
  }, [])

  /**
   * Validate a backup file before importing
   */
  const validateFile = useCallback(async (file: File): Promise<{
    valid: boolean
    error?: string
    promptCount?: number
  }> => {
    try {
      // Check file type
      if (!file.name.endsWith('.json')) {
        return { valid: false, error: 'File must be a JSON file' }
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return { valid: false, error: 'File too large (max 10MB)' }
      }

      const content = await readFileAsText(file)
      const parsed = JSON.parse(content)
      
      const validation = safeValidateBackupFile(parsed)
      
      if (validation.success) {
        return { 
          valid: true, 
          promptCount: validation.data.prompts.length 
        }
      }

      return { valid: false, error: validation.error }
    } catch (err) {
      return { 
        valid: false, 
        error: err instanceof Error ? err.message : 'Invalid file format' 
      }
    }
  }, [])

  /**
   * Import prompts from a backup file
   * Returns the prompts to be merged by the caller
   */
  const importFromFile = useCallback(async (file: File): Promise<RestoreResult> => {
    setIsImporting(true)
    setLastError(null)

    try {
      // Validate first
      const validation = await validateFile(file)
      if (!validation.valid) {
        setLastError(validation.error || 'Invalid file')
        return { success: false, error: validation.error }
      }

      // Parse the file
      const content = await readFileAsText(file)
      const parsed = JSON.parse(content)
      const validatedData = safeValidateBackupFile(parsed)

      if (!validatedData.success) {
        setLastError(validatedData.error)
        return { success: false, error: validatedData.error }
      }

      const { prompts } = validatedData.data

      // Return success - caller will merge prompts
      return {
        success: true,
        promptsRestored: prompts.length,
        promptsSkipped: 0,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Import failed'
      setLastError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsImporting(false)
    }
  }, [validateFile])

  return {
    isExporting,
    isImporting,
    lastError,
    exportToFile,
    importFromFile,
    validateFile,
  }
}
