/**
 * Data Management Modal Component
 * 
 * WHY: Provides UI for users to backup and restore their prompts.
 * Critical for preventing data loss when cache is cleared.
 * 
 * TARGET LOCATION: /src/components/DataManagementModal.tsx
 */
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle,
  FileJson,
  Trash2,
  HardDrive
} from 'lucide-react'
import { usePromptBackup } from '@/hooks/usePromptBackup'
import { useAnonymousPrompts } from '@/hooks/useAnonymousPrompts'
import toast from 'react-hot-toast'

interface DataManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DataManagementModal({ isOpen, onClose }: DataManagementModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  
  const { prompts, clearAll } = useAnonymousPrompts()
  const { 
    isExporting, 
    isImporting, 
    exportToFile, 
    importFromFile,
    validateFile 
  } = usePromptBackup()

  /**
   * Handle export button click
   */
  const handleExport = async () => {
    if (prompts.length === 0) {
      toast.error('No prompts to export')
      return
    }

    const result = await exportToFile(prompts)
    
    if (result.success) {
      toast.success(`Exported ${prompts.length} prompts to ${result.filename}`)
    } else {
      toast.error(result.error || 'Export failed')
    }
  }

  /**
   * Handle file selection for import
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate first
    const validation = await validateFile(file)
    
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid backup file')
      return
    }

    // Confirm import
    const confirmImport = window.confirm(
      `Import ${validation.promptCount} prompts? This will add to your existing prompts.`
    )

    if (!confirmImport) return

    const result = await importFromFile(file)
    
    if (result.success) {
      toast.success(`Restored ${result.promptsRestored} prompts`)
      onClose()
    } else {
      toast.error(result.error || 'Import failed')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Handle clear all data
   */
  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }

    clearAll()
    toast.success('All local prompts cleared')
    setConfirmClear(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full border-4 border-black"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-4 border-black">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              <h2 className="text-lg font-bold">Data Management</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Stats */}
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Local Prompts
                </span>
                <span className="font-bold">{prompts.length}</span>
              </div>
            </div>

            {/* Export Section */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Download className="w-4 h-4" />
                Backup
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download all your prompts as a JSON file
              </p>
              <button
                onClick={handleExport}
                disabled={isExporting || prompts.length === 0}
                className="w-full py-2 px-4 bg-neo-green border-2 border-black rounded font-bold
                         hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                <FileJson className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export Backup'}
              </button>
            </div>

            {/* Import Section */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Restore
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Import prompts from a backup file
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
                id="backup-file-input"
              />
              <label
                htmlFor="backup-file-input"
                className={`w-full py-2 px-4 bg-neo-blue border-2 border-black rounded font-bold
                         hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]
                         transition-all cursor-pointer flex items-center justify-center gap-2
                         ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-4 h-4" />
                {isImporting ? 'Importing...' : 'Import from File'}
              </label>
            </div>

            {/* Danger Zone */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <h3 className="font-semibold text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Danger Zone
              </h3>
              <button
                onClick={handleClearAll}
                className={`w-full py-2 px-4 border-2 border-red-500 rounded font-bold
                         transition-all flex items-center justify-center gap-2
                         ${confirmClear 
                           ? 'bg-red-500 text-white' 
                           : 'bg-white text-red-500 hover:bg-red-50'}`}
              >
                <Trash2 className="w-4 h-4" />
                {confirmClear ? 'Click Again to Confirm' : 'Clear All Local Data'}
              </button>
              {confirmClear && (
                <button
                  onClick={() => setConfirmClear(false)}
                  className="w-full py-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              💡 Tip: Export regularly to prevent data loss
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DataManagementModal
