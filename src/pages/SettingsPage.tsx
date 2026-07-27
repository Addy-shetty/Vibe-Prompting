import toast from "react-hot-toast"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Shield, 
  LogOut, 
  Save, 
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/lib/supabase'
import { sanitizeInput, isValidUsername } from '@/lib/security'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const currentUsername = (user?.user_metadata as any)?.username || user?.email?.split('@')[0] || ''
  const [username, setUsername] = useState(currentUsername)
  const [bio, setBio] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const sanitizedUsername = sanitizeInput(username.toLowerCase().trim())
    const sanitizedBio = sanitizeInput(bio.trim())

    if (!isValidUsername(sanitizedUsername)) {
      setError('Username must be 3-20 characters: letters, numbers, underscores only.')
      return
    }

    setIsSaving(true)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          username: sanitizedUsername,
          bio: sanitizedBio || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (updateError) {
        setError(updateError.message)
        toast.error(updateError.message, { duration: 4000 })
      } else {
        setSuccess('Profile updated successfully!')
        toast.success('Profile updated!', { duration: 3000 })
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err) {
      const errorMessage = 'Failed to update profile. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage, { duration: 4000 })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-noir-black">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-noir-yellow transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-noir-yellow" />
            <h1 className="text-3xl md:text-4xl font-black uppercase text-white">Settings</h1>
          </div>
          <p className="text-neutral-500 font-mono text-sm mt-2">Manage your profile and preferences</p>
        </motion.div>

        {/* Status Messages */}
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
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Profile Section */}
          <motion.div variants={item}>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-noir-yellow" />
                  <h2 className="text-lg font-bold text-white uppercase">Profile</h2>
                </div>
              </div>
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-700 text-neutral-500 font-mono text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-neutral-600 mt-1">Email cannot be changed</p>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-noir-yellow focus:ring-1 focus:ring-noir-yellow/50 transition-all duration-200 font-mono text-sm"
                    placeholder="your_username"
                  />
                  <p className="text-xs text-neutral-600 mt-1">3-20 characters. Letters, numbers, and underscores.</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-noir-yellow focus:ring-1 focus:ring-noir-yellow/50 transition-all duration-200 font-mono text-sm resize-none"
                    placeholder="Tell us a bit about yourself..."
                  />
                  <p className="text-xs text-neutral-600 mt-1">{bio.length}/200 characters</p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg bg-noir-yellow text-noir-black hover:shadow-glow-yellow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Changes</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Appearance Section */}
          <motion.div variants={item}>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-noir-yellow" /> : <Sun className="w-5 h-5 text-noir-yellow" />}
                  <h2 className="text-lg font-bold text-white uppercase">Appearance</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Theme</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Currently using <span className="text-noir-yellow font-semibold">{theme}</span> mode
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:border-noir-yellow/50 transition-all text-sm font-medium"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div variants={item}>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-noir-yellow" />
                  <h2 className="text-lg font-bold text-white uppercase">Security</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
                  <div>
                    <p className="text-sm font-medium text-white">Password</p>
                    <p className="text-xs text-neutral-500 mt-1">Change your account password</p>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:border-noir-yellow/50 transition-all text-sm font-medium"
                  >
                    Change
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
                  <div>
                    <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-neutral-500 mt-1">Add an extra layer of security</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-600 text-xs font-mono">
                    Coming Soon
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-800/30 border border-neutral-800">
                  <div>
                    <p className="text-sm font-medium text-white">Active Sessions</p>
                    <p className="text-xs text-neutral-500 mt-1">Manage your active sessions</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold">
                    1 Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={item}>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
              <div className="p-6 border-b border-red-500/20">
                <h2 className="text-lg font-bold text-red-400 uppercase">Danger Zone</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Sign Out</p>
                    <p className="text-xs text-neutral-500 mt-1">Sign out of your account on this device</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
