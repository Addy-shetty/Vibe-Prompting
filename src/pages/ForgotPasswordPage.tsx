import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { sanitizeInput, isValidEmail } from '@/lib/security'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim())

    if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/login`,
      })

      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 flex items-center justify-center relative overflow-hidden bg-noir-black noir-grid-bg">
      {/* Glowing orbs background — same as login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-noir-yellow/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-noir-yellow/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="rounded-xl p-10 border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm shadow-2xl">
          {/* Back Link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-noir-yellow transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {success ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h1 className="text-3xl font-display font-bold mb-3 text-white tracking-tight">
                Check Your Email
              </h1>
              <p className="font-mono text-neutral-400 text-sm mb-8 max-w-sm mx-auto">
                We've sent a password reset link to <span className="text-noir-yellow font-semibold">{email}</span>. 
                Check your inbox and follow the instructions.
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full py-4 px-6 text-center font-semibold rounded-lg bg-noir-yellow text-noir-black hover:shadow-glow-yellow transition-all duration-200"
                >
                  Return to Login
                </Link>
                <button
                  onClick={() => { setSuccess(false); setEmail('') }}
                  className="block w-full py-3 px-6 text-center text-sm font-medium text-neutral-500 hover:text-white transition-colors"
                >
                  Try a different email
                </button>
              </div>
            </motion.div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-display font-bold mb-3 text-white tracking-tight">
                  Reset Password
                </h1>
                <p className="font-mono text-neutral-400 text-sm">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3 tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={50}
                      className="w-full pl-12 pr-4 py-4 text-lg rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-noir-yellow focus:ring-1 focus:ring-noir-yellow/50 transition-all duration-200"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 text-lg font-semibold rounded-lg bg-noir-yellow text-noir-black hover:shadow-glow-yellow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-400">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-medium text-noir-yellow hover:text-noir-glow transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
