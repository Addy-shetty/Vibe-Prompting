import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupFormData } from '@/lib/validations'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect } from 'react'
import { Mail, Lock, User, Loader2, Github, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Particles } from '@/components/ui/particles'
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator'
import { csrfToken } from '@/lib/security'

export default function SignupPage() {
  const { signUp, signInWithGoogle, signInWithGithub, checkUsernameAvailability } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [csrf, setCsrf] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Generate CSRF token on mount
  useEffect(() => {
    const token = csrfToken.generateToken()
    setCsrf(token)
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const watchUsername = watch('username')
  const watchPassword = watch('password')

  // Update password state for strength indicator
  useEffect(() => {
    setPassword(watchPassword || '')
  }, [watchPassword])

  // Check username availability with debounce
  useEffect(() => {
    if (!watchUsername || watchUsername.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    const timer = setTimeout(async () => {
      const available = await checkUsernameAvailability(watchUsername)
      setUsernameAvailable(available)
      setCheckingUsername(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [watchUsername, checkUsernameAvailability])

  const onSubmit = async (data: SignupFormData) => {
    // Check honeypot field using native form elements
    const form = document.querySelector('form')
    const honeypot = form?.querySelector('input[name="honeypot_website"]') as HTMLInputElement
    if (honeypot?.value) {
      console.warn('Bot detected - honeypot field filled')
      return
    }

    // Validate CSRF token
    if (!csrfToken.validateToken(csrf)) {
      setError('Security validation failed. Please refresh and try again.')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error } = await signUp(data.email, data.password, data.username)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setIsLoading(false)
      // Clear CSRF token after successful signup
      csrfToken.clearToken()
      // Show success message and redirect after 2 seconds
      setTimeout(() => navigate('/login'), 2000)
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

  if (success) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-6 flex items-center justify-center bg-neo-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-neo p-12 border-3 border-black bg-neo-green shadow-neo-lg text-center max-w-md"
        >
          <div className="w-20 h-20 bg-white border-3 border-black rounded-neo flex items-center justify-center mx-auto mb-6 shadow-neo-sm">
            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black uppercase mb-4 text-black tracking-tighter">
            Check your email!
          </h2>
          <p className="font-mono font-bold text-lg text-black">
            We've sent you a confirmation link. Please check your inbox to verify your account.
          </p>
        </motion.div>
      </div>
    )
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
              Create Account
            </h1>
            <p className="font-mono font-bold text-lg">Join thousands of AI prompt creators</p>
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

          {/* Social Signup Buttons */}
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Honeypot field - hidden from real users, bots will fill it */}
            <input
              type="text"
              name="honeypot_website"
              tabIndex={-1}
              autoComplete="off"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0
              }}
            />
            
            {/* Username */}
            <div>
              <label className="block text-sm font-black uppercase mb-3 tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
                <input
                  {...register('username')}
                  type="text"
                  maxLength={20}
                  className="neo-input w-full pl-14 pr-14 py-4 text-lg"
                  placeholder="johndoe"
                />
                {/* Username Status Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {checkingUsername ? (
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                  ) : usernameAvailable === true ? (
                    <CheckCircle2 className="w-6 h-6 text-neo-green" />
                  ) : usernameAvailable === false ? (
                    <XCircle className="w-6 h-6 text-neo-pink" />
                  ) : null}
                </div>
              </div>
              {errors.username && (
                <p className="mt-2 text-sm font-bold text-neo-pink">{errors.username.message}</p>
              )}
              {!errors.username && usernameAvailable === false && (
                <p className="mt-2 text-sm font-bold text-neo-pink">Username already taken</p>
              )}
              {!errors.username && usernameAvailable === true && (
                <p className="mt-2 text-sm font-bold text-neo-green">Username available!</p>
              )}
            </div>

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
                  type={showPassword ? 'text' : 'password'}
                  maxLength={25}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 outline-none transition-all font-medium ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500 focus:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.4)]'
                      : 'bg-white border-black text-neutral-900 placeholder:text-neutral-400 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  } ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'} transition-colors`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator password={password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                }`} />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  maxLength={25}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 outline-none transition-all font-medium ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500 focus:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.4)]'
                      : 'bg-white border-black text-neutral-900 placeholder:text-neutral-400 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'} transition-colors`}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                theme === 'dark'
                ? 'bg-purple-600 border-white text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0'
                : 'bg-purple-600 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className={`mt-6 text-center text-sm ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-semibold hover:underline ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className={`mt-4 text-center text-xs ${
            theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'
          }`}>
            By signing up, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
