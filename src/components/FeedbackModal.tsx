import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Bug, Lightbulb, Send, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

type FeedbackType = 'bug' | 'suggestion' | 'feedback'

const FEEDBACK_TYPES = [
  { id: 'bug' as FeedbackType, label: 'Bug Report', icon: Bug, color: 'bg-red-500', hoverColor: 'hover:bg-red-600' },
  { id: 'suggestion' as FeedbackType, label: 'Suggestion', icon: Lightbulb, color: 'bg-neo-yellow', hoverColor: 'hover:bg-yellow-500' },
  { id: 'feedback' as FeedbackType, label: 'General Feedback', icon: MessageSquare, color: 'bg-neo-blue', hoverColor: 'hover:bg-blue-600' },
]

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuth()
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feedback')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const resetForm = () => {
    setTitle('')
    setMessage('')
    setFeedbackType('feedback')
    setIsSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id || null,
        email: user?.email || null,
        type: feedbackType,
        title: title.trim(),
        message: message.trim(),
        status: 'new',
        metadata: {
          user_agent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        },
      })

      if (error) throw error

      setIsSuccess(true)
      toast.success('Thank you for your feedback!')
      
      // Auto-close after success
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      console.error('Failed to submit feedback:', err)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white border-3 border-black rounded-neo shadow-neo-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-3 border-black bg-neo-pink">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-black uppercase text-white tracking-tight">
                    Send Feedback
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 text-center"
                >
                  <div className="w-16 h-16 bg-neo-green border-3 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-neo">
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-2">Thank You!</h3>
                  <p className="font-mono font-bold text-neutral-600">
                    Your feedback has been submitted successfully.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Feedback Type Selection */}
                  <div>
                    <label className="block text-sm font-black uppercase mb-3 tracking-wider">
                      What type of feedback?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {FEEDBACK_TYPES.map((type) => {
                        const Icon = type.icon
                        const isSelected = feedbackType === type.id
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFeedbackType(type.id)}
                            className={`p-4 border-3 border-black rounded-neo font-bold text-sm transition-all ${
                              isSelected
                                ? `${type.color} text-white shadow-none translate-x-[2px] translate-y-[2px]`
                                : 'bg-white text-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-black'}`} />
                            <span className="block text-xs uppercase">{type.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-black uppercase mb-3 tracking-wider">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        feedbackType === 'bug' 
                          ? "e.g., Button doesn't work on mobile"
                          : feedbackType === 'suggestion'
                          ? "e.g., Add dark mode for docs"
                          : "e.g., Love the new feature!"
                      }
                      maxLength={100}
                      className="w-full p-4 border-3 border-black rounded-neo font-mono font-bold shadow-neo focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] focus:outline-none transition-all"
                    />
                    <div className="mt-1 text-xs font-mono text-neutral-500 text-right">
                      {title.length}/100
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-black uppercase mb-3 tracking-wider">
                      {feedbackType === 'bug' ? 'Describe the bug' : 'Your message'}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        feedbackType === 'bug'
                          ? "Please describe what happened, what you expected, and steps to reproduce..."
                          : feedbackType === 'suggestion'
                          ? "Tell us about your idea and how it would help..."
                          : "Share your thoughts with us..."
                      }
                      rows={5}
                      maxLength={2000}
                      className="w-full p-4 border-3 border-black rounded-neo font-mono font-bold shadow-neo focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] focus:outline-none transition-all resize-none"
                    />
                    <div className="mt-1 text-xs font-mono text-neutral-500 text-right">
                      {message.length}/2000
                    </div>
                  </div>

                  {/* User info hint */}
                  {user && (
                    <p className="text-xs font-mono text-neutral-500">
                      Submitting as <span className="font-bold">{user.email}</span>
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !message.trim()}
                    className="w-full bg-neo-pink text-white py-4 font-black uppercase text-lg border-3 border-black rounded-neo shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Feedback
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
