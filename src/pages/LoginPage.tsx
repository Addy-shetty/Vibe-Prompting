import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'
import { Mail, Lock, Loader2, Github } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Particles } from '@/components/ui/particles'

export default function LoginPage() {
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    const { error } = await signIn(data.email, data.password)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      navigate('/')
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
    }
  }

  const handleGithubSignIn = async () => {
    setError(null)
    const { error } = await signInWithGithub()
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Animated Particles Background */}
      <Particles />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className={`rounded-2xl p-8 shadow-xl backdrop-blur-sm border ${
          theme === 'dark'
            ? 'bg-neutral-900/50 border-neutral-800'
            : 'bg-white border-neutral-200'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Welcome Back
            </h1>
            <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGithubSignIn}
              className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border ${
                theme === 'dark'
                  ? 'bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700'
                  : 'bg-white text-neutral-900 hover:bg-neutral-50 border-neutral-300'
              }`}
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme === 'dark' ? 'bg-neutral-900/50 text-neutral-400' : 'bg-white text-neutral-600'}`}>
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                }`} />
                <input
                  {...register('email')}
                  type="email"
                  maxLength={50}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500'
                      : 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500'
                  } ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                }`} />
                <input
                  {...register('password')}
                  type="password"
                  maxLength={25}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500'
                      : 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500'
                  } ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className={`text-sm font-medium hover:underline ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <p className={`mt-6 text-center text-sm ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className={`font-semibold hover:underline ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
