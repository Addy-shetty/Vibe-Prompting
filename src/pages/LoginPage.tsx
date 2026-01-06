import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect } from 'react'
import { Mail, Lock, Loader2, Github, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Particles } from '@/components/ui/particles'
import { csrfToken } from '@/lib/security'

export default function LoginPage() {
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [csrf, setCsrf] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Generate CSRF token on mount
  useEffect(() => {
    const token = csrfToken.generateToken()
    setCsrf(token)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // Validate CSRF token
    if (!csrfToken.validateToken(csrf)) {
      setError('Security validation failed. Please refresh and try again.')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error } = await signIn(data.email, data.password)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      // Refresh CSRF token after successful login
      csrfToken.refreshToken()
      navigate('/dashboard')
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
    <div className="min-h-screen pt-28 pb-12 px-6 flex items-center justify-center relative overflow-hidden bg-neo-bg">
      {/* Animated Particles Background */}
      <Particles />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="rounded-neo p-10 border-3 border-black bg-white shadow-neo-lg">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black uppercase mb-3 text-black tracking-tighter">
              Welcome Back
            </h1>
            <p className="font-mono font-bold text-lg">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-neo bg-neo-pink border-3 border-black text-white text-sm font-black uppercase shadow-neo-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-8">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              className="w-full py-4 px-6 rounded-neo font-black uppercase flex items-center justify-center gap-3 transition-all border-3 bg-white text-black border-black hover:bg-neo-yellow shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] duration-150"
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
              whileTap={{ scale: 0.98 }}
              onClick={handleGithubSignIn}
              className="w-full py-4 px-6 rounded-neo font-black uppercase flex items-center justify-center gap-3 transition-all border-3 bg-neo-black text-white border-black hover:bg-neo-blue shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] duration-150"
            >
              <Github className="w-6 h-6" />
              Continue with GitHub
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-3 border-black" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white font-black uppercase">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-black uppercase mb-3 tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
                <input
                  {...register('email')}
                  type="email"
                  maxLength={50}
                  className="neo-input w-full pl-14 pr-4 py-4 text-lg"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm font-bold text-neo-pink">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-black uppercase mb-3 tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  maxLength={25}
                  className="neo-input w-full pl-14 pr-14 py-4 text-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-neo-pink transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm font-bold text-neo-pink">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-black accent-neo-pink"
                />
                <span className="text-sm font-bold">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-black uppercase hover:underline decoration-3 underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="neo-button-primary w-full py-4 px-6 text-lg shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin inline mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm font-mono font-bold">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-black uppercase hover:underline decoration-3 underline-offset-4 text-neo-blue"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
