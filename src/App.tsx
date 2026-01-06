import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'

import { Tiles } from '@/components/ui/tiles'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import GeneratePromptPage from '@/pages/GeneratePromptPageSecure'
import MyPromptsPage from '@/pages/MyPromptsPage'
import ExplorePage from '@/pages/ExplorePage'
import DocsPage from '@/pages/DocsPage'
import PricingPage from '@/pages/PricingPage'
import DashboardPage from '@/pages/DashboardPage'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

function HomePage() {
  return <Hero />
}

// Loading component for auth initialization
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-neo-pink mx-auto mb-4" />
        <p className="font-mono font-bold text-neutral-600">Loading...</p>
      </div>
    </div>
  )
}

// Protected Route component - redirects to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <AuthLoading />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

export default function App() {
  const { theme } = useTheme()
  const { loading } = useAuth()

  // Show loading state while auth initializes
  if (loading) {
    return <AuthLoading />
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen w-full font-sans ${
        theme === 'dark' 
          ? 'bg-neutral-950 text-white selection:bg-neo-pink selection:text-white' 
          : 'bg-neo-bg text-black selection:bg-neo-yellow selection:text-black'
      }`}>
        <Tiles className="fixed inset-0 -z-10" />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute><GeneratePromptPage /></ProtectedRoute>} />
          <Route path="/prompts" element={<ProtectedRoute><MyPromptsPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
        <Analytics />
      </div>
    </ErrorBoundary>
  )
}
