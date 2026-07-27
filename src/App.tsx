import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Loader2 } from 'lucide-react'

import { Tiles } from '@/components/ui/tiles'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

// ── Code-split page imports ──
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const GeneratePromptPage = lazy(() => import('@/pages/GeneratePromptPageSecure'))
const MyPromptsPage = lazy(() => import('@/pages/MyPromptsPage'))
const ExplorePage = lazy(() => import('@/pages/ExplorePage'))
const DocsPage = lazy(() => import('@/pages/DocsPage'))
const PricingPage = lazy(() => import('@/pages/PricingPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

function HomePage() {
  return <Hero />
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-black">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-noir-yellow mx-auto mb-4" />
        <p className="font-mono font-bold text-neutral-500">Loading...</p>
      </div>
    </div>
  )
}

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-black">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-noir-yellow mx-auto mb-4" />
        <p className="font-display uppercase tracking-wider text-neutral-500">Loading...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <AuthLoading />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { theme } = useTheme()
  const { loading } = useAuth()

  if (loading) return <AuthLoading />

  return (
    <ErrorBoundary>
      <main className={`min-h-screen w-full font-sans ${
        theme === 'dark'
          ? 'bg-neutral-950 text-white selection:bg-noir-yellow selection:text-black'
          : 'bg-noir-bg text-black selection:bg-noir-pink selection:text-white'
      }`}>
        <Tiles className="fixed inset-0 -z-10" />
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/generate" element={<ProtectedRoute><GeneratePromptPage /></ProtectedRoute>} />
            <Route path="/prompts" element={<ProtectedRoute><MyPromptsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
          </Routes>
        </Suspense>
        <Analytics />
      </main>
    </ErrorBoundary>
  )
}
