import * as React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Tiles } from '@/components/ui/tiles'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import GeneratePromptPage from '@/pages/GeneratePromptPage'
import MyPromptsPage from '@/pages/MyPromptsPage'
import DocsPage from '@/pages/DocsPage'
import { useTheme } from '@/context/ThemeContext'

function HomePage() {
  return <Hero />
}

export default function App() {
  const { theme } = useTheme()

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-[#151316] to-[#1e1c1e]' 
        : 'bg-neutral-100'
    }`}>
      <Tiles 
        className={`absolute inset-0 h-full w-full ${theme === 'dark' ? 'opacity-70' : 'opacity-100'}`}
        rows={120} 
        cols={64} 
        tileSize="md" 
        tileClassName={theme === 'dark' ? 'border-neutral-700/40' : 'border-neutral-200/50'}
        tileColor={theme === 'dark' ? 'rgba(156, 163, 175, 0.25)' : 'rgba(156, 163, 175, 0.3)'}
        hoverColor={theme === 'dark' ? 'rgba(167, 139, 250, 0.5)' : 'rgba(99, 102, 241, 0.35)'}
      />
      <Navbar />
      <div className="relative z-10 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/generate" element={<GeneratePromptPage />} />
          <Route path="/prompts" element={<MyPromptsPage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </div>
    </div>
  )
}
