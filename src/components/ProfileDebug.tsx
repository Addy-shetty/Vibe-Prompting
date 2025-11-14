import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/context/ThemeContext'

export function ProfileDebug() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setLoading(true)
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Profile fetch error:', error)
          }
          setProfile(data)
          setLoading(false)
        })
    }
  }, [user])

  if (!user) return null

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm ${
      theme === 'dark' ? 'bg-neutral-800 text-white border border-neutral-700' : 'bg-white text-neutral-900 border border-neutral-200'
    }`}>
      <h3 className="font-bold mb-2">🔍 Profile Debug</h3>
      <div className="text-sm space-y-1">
        <p><strong>Auth ID:</strong> {user.id.slice(0, 8)}...</p>
        <p><strong>Email:</strong> {user.email}</p>
        {loading ? (
          <p className="text-yellow-500">Loading profile...</p>
        ) : profile ? (
          <>
            <p className="text-green-500">✅ Profile exists!</p>
            <p><strong>Username:</strong> {profile.username}</p>
            {profile.avatar_url && <p><strong>Avatar:</strong> ✅</p>}
          </>
        ) : (
          <p className="text-red-500">❌ No profile row found</p>
        )}
      </div>
    </div>
  )
}
