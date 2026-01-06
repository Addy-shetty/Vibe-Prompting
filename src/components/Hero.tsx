import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight, 
  Code, 
  Database, 
  Shield, 
  Zap, 
  Terminal, 
  Globe,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import Footer from './Footer'

export default function HeroV3() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [mounted, setMounted] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [statsCounter, setStatsCounter] = useState({ prompts: 0, users: 0, satisfaction: 0 })

  useEffect(() => {
    setMounted(true)
    
    // Animate stats counter
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setStatsCounter({
        prompts: Math.floor(10000 * progress),
        users: Math.floor(5000 * progress),
        satisfaction: Math.floor(99 * progress)
      })
      
      if (step >= steps) clearInterval(timer)
    }, interval)
    
    return () => clearInterval(timer)
  }, [])
  
  // Demo typing animation
  useEffect(() => {
    const demoTimer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 3)
    }, 4000)
    
    return () => clearInterval(demoTimer)
  }, [])

  const handleQuickGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      navigate('/generate', { state: { prompt: input, autoGenerate: true } })
    }
  }

  const isDark = theme === 'dark'

  return (
    <div className="relative w-full min-h-screen font-sans overflow-hidden bg-transparent">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-transparent">
        {/* Floating Code Snippets */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-neo-blue opacity-10 font-mono text-xs"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
            }}
            animate={{ 
              y: [null, Math.random() * -20 - 10 + '%'],
              x: [null, Math.random() * 20 - 10 + '%'],
            }}
            transition={{ 
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear'
            }}
          >
            {['const ', 'function', '() =>', 'async', 'await', 'return'][i]}
          </motion.div>
        ))}
        
        {/* Gradient Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neo-blue opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neo-pink opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge - Neo-Brutalist Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-3 mb-10 border-3 border-black bg-neo-sunshine shadow-neo-sm rounded-neo transform -rotate-2 hover:rotate-0 transition-transform cursor-default"
          >
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-black"></span>
            </span>
            <span className="font-black uppercase tracking-wider text-base">System v2.0 Online</span>
          </motion.div>

          {/* Headline */}
          <h1 className={`text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-10 ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Prompt Engineering <br />
            <span className="inline-block mt-3 text-neo-blue">
              For Developers
            </span>
          </h1>

          <p className={`max-w-2xl mx-auto text-xl md:text-2xl font-mono font-bold mb-12 leading-relaxed ${
            isDark ? 'text-neutral-300' : 'text-black'
          }`}>
            Stop wrestling with generic AI responses. Generate production-ready prompts optimized for coding, debugging, and architecture.
          </p>

          {/* Input Section */}
          <div className="w-full max-w-3xl relative z-20 mb-16">
            <div className={`border-3 p-3 shadow-neo-lg transform rotate-1 hover:rotate-0 transition-all duration-300 ${
              isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-black'
            }`}>
              <form onSubmit={handleQuickGenerate} className="flex items-stretch">
                <div className={`flex items-center pl-5 ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  <Terminal className="w-7 h-7" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe required system parameters..."
                  className={`flex-1 px-5 py-5 bg-transparent border-none focus:ring-0 text-lg font-mono font-bold placeholder:text-neutral-400 ${
                    isDark ? 'text-white' : 'text-black'
                  }`}
                />
                <button
                  type="submit"
                  className="bg-neo-pink text-white px-10 py-5 font-black uppercase tracking-wider hover:bg-neo-blue transition-all border-l-3 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] duration-150"
                >
                  Execute <ArrowRight className="w-6 h-6 ml-2 inline-block" />
                </button>
              </form>
            </div>
            
            {/* Quick Tags */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {['React Component', 'SQL Query', 'API Endpoint', 'Unit Tests'].map((tag, i) => (
                <button
                  key={tag}
                  onClick={() => setInput(tag)}
                  className={`px-6 py-3 border-3 text-sm font-black uppercase shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-neo-yellow transition-all duration-150 ${
                    isDark ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-white border-black text-black'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-12 md:gap-20"
          >
            {[
              { icon: Code, label: 'React' },
              { icon: Terminal, label: 'TypeScript' },
              { icon: Database, label: 'SQL' },
              { icon: Globe, label: 'Next.js' },
              { icon: Shield, label: 'Auth' },
            ].map((tech, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.15, y: -5 }}
              className="flex items-center gap-3 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
            >
              <tech.icon className={`w-7 h-7 ${
                isDark ? 'text-white' : 'text-black'
              }`} />
              <span className="font-black uppercase text-sm">{tech.label}</span>
            </motion.div>
          ))}
          </motion.div>
        </div>
      </div>

      {/* Live Prompt Preview/Demo Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            See It In <span className="text-neo-pink">Action</span>
          </h2>
          <p className={`text-xl font-mono font-bold ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>Watch your prompts transform in real-time</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <div className={`border-3 p-8 shadow-neo rounded-neo ${
            isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-black'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-2 bg-neo-pink text-white font-black uppercase text-sm border-2 border-black rounded-neo">
                Before
              </div>
              <span className={`font-mono font-bold text-sm ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>Your Input</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={demoStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`font-mono text-base leading-relaxed ${
                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                {demoStep === 0 && '"Build a React dashboard with authentication"'}
                {demoStep === 1 && '"Optimize this slow database query"'}
                {demoStep === 2 && '"Fix TypeScript type errors in my API"'}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* After */}
          <div className="bg-neo-green border-3 border-black p-8 shadow-neo rounded-neo">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-2 bg-black text-white font-black uppercase text-sm border-2 border-black rounded-neo">
                After
              </div>
              <span className="font-mono font-bold text-sm">AI-Enhanced Prompt</span>
              <Sparkles className="w-5 h-5 text-black ml-auto" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={demoStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-mono text-sm text-black leading-relaxed"
              >
                {demoStep === 0 && '"Act as a senior React architect with expertise in Next.js 14, TypeScript, and modern authentication patterns. I need to build a production-grade admin dashboard with: role-based access control (RBAC), protected routes using middleware, JWT token refresh logic, secure session management, and responsive layouts. Include best practices for: component composition, state management (Context vs Zustand), error boundaries, loading states, and type-safe API calls. Provide a scalable folder structure and explain security considerations."'}
                {demoStep === 1 && '"Act as a PostgreSQL database performance expert. I have a slow query joining 4 tables (users, orders, products, reviews) with 2M+ records. Current execution time: 8 seconds. Analyze this query and provide: 1) EXPLAIN ANALYZE output interpretation, 2) Missing index recommendations with CREATE INDEX statements, 3) Query rewrite using CTEs or window functions if beneficial, 4) Partitioning strategy for the orders table, 5) Caching opportunities. Focus on reducing execution time to under 500ms while maintaining data accuracy."'}
                {demoStep === 2 && '"Act as a TypeScript expert and senior debugger. My Next.js 14 API route is throwing \'Type instantiation is excessively deep and possibly infinite\' errors. The API accepts a generic request body with nested objects 5 levels deep. Provide: 1) Root cause analysis of the type error, 2) Refactored type definitions using utility types (Pick, Omit, Partial), 3) Runtime validation strategy (Zod schema), 4) Unit tests to prevent regression, 5) Documentation of the type-safe API contract. Include before/after code snippets with explanations."'}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Demo Progress Indicator */}
        <div className="flex justify-center gap-3 mt-8">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setDemoStep(i)}
              className={`w-3 h-3 rounded-full border-2 border-black transition-all ${
                demoStep === i ? 'bg-neo-pink scale-125' : 'bg-white hover:bg-neo-yellow'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bento Grid Section - Unique Features Showcase */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Everything You <span className="text-neo-pink">Need</span>
          </h2>
          <p className={`text-xl font-mono font-bold ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>Built for developers who care about quality</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
          {/* Large Feature - Spans 2 columns */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-2 bg-neo-blue border-3 border-black p-10 shadow-neo-lg hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-neo relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 text-9xl opacity-10">⚡</div>
            <Zap className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">Lightning Fast</h3>
            <p className="font-mono font-bold text-lg mb-6 leading-relaxed">
              Generate production-ready prompts in seconds. Our AI-powered engine optimizes for speed without compromising quality.
            </p>
            <div className="flex flex-wrap gap-3 mt-auto">
              <span className="px-4 py-2 bg-white border-2 border-black font-black text-sm uppercase rounded-neo">&lt; 2s Response</span>
              <span className="px-4 py-2 bg-white border-2 border-black font-black text-sm uppercase rounded-neo">Real-time</span>
            </div>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-neo-green border-3 border-black p-8 shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-neo"
          >
            <Shield className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-black uppercase mb-3 tracking-tighter">OWASP Secure</h3>
            <p className="font-mono font-bold text-sm leading-relaxed">
              Built with security-first mindset. PII stripping included.
            </p>
          </motion.div>

          {/* Code Icon */}
          <motion.div
            whileHover={{ y: -5, rotate: 5 }}
            className="bg-neo-sunshine border-3 border-black p-8 shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-neo flex items-center justify-center"
          >
            <div className="text-center">
              <Code className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tighter">Dev-First</h3>
            </div>
          </motion.div>

          {/* API Integration */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-neo-pink border-3 border-black p-8 shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-neo"
          >
            <Terminal className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-black uppercase mb-3 tracking-tighter">API Access</h3>
            <p className="font-mono font-bold text-sm mb-4">
              Integrate directly into your workflow. REST API with comprehensive docs.
            </p>
            <div className="bg-black text-neo-green p-4 rounded-neo font-mono text-xs border-2 border-black">
              curl -X POST api.vibe/generate
            </div>
          </motion.div>

          {/* Team Collaboration */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border-3 border-black p-8 shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-neo"
          >
            <Users className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-black uppercase mb-3 tracking-tighter">Team Ready</h3>
            <p className="font-mono font-bold text-sm">
              Share prompts across your team. Built for collaboration.
            </p>
          </motion.div>

          {/* Database Icon */}
          <motion.div
            whileHover={{ y: -5, scale: 1.05 }}
            className="bg-neo-yellow border-3 border-black p-8 shadow-neo hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-neo flex items-center justify-center"
          >
            <div className="text-center">
              <Database className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tighter">Saved History</h3>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tech Stack Strip */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Code className="w-10 h-10" />,
              title: "Context-Aware",
              desc: "Injects your tech stack automatically.",
              color: "bg-neo-blue"
            },
            {
              icon: <Shield className="w-10 h-10" />,
              title: "Security First",
              desc: "Built-in PII stripping and OWASP checks.",
              color: "bg-neo-green"
            },
            {
              icon: <Zap className="w-10 h-10" />,
              title: "Model Tuned",
              desc: "Optimized for GPT-4, Claude 3, and Gemini.",
              color: "bg-neo-pink"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -8 }}
              className={`${feature.color} border-3 border-black p-10 shadow-neo-lg hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 cursor-pointer`}
            >
              <div className="mb-8 p-4 bg-white border-3 border-black inline-block rounded-neo shadow-neo-sm">
                {feature.icon}
              </div>
              <h3 className="text-3xl font-black uppercase mb-5 text-black tracking-tighter">{feature.title}</h3>
              <p className="font-mono font-bold text-lg text-black">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="bg-neo-black text-white p-16 border-3 border-black shadow-neo-xl relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 tracking-tighter">
              Ready to Vibe?
            </h2>
            <p className="text-2xl font-mono font-bold mb-12 text-neo-yellow">
              Join {statsCounter.users.toLocaleString()}+ developers generating better code.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-neo-pink text-white text-xl px-12 py-5 font-black uppercase border-3 border-white hover:bg-neo-green hover:text-black transition-all transform hover:rotate-2 shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] duration-150"
            >
              Initialize System →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Footer Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: <Zap className="w-8 h-8" />,
              value: statsCounter.prompts.toLocaleString() + '+',
              label: 'Prompts Generated',
              color: 'bg-neo-pink'
            },
            { 
              icon: <Users className="w-8 h-8" />,
              value: statsCounter.users.toLocaleString() + '+',
              label: 'Active Users',
              color: 'bg-neo-blue'
            },
            { 
              icon: <TrendingUp className="w-8 h-8" />,
              value: statsCounter.satisfaction + '%',
              label: 'Satisfaction Rate',
              color: 'bg-neo-green'
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              className={`${stat.color} border-3 border-black p-8 shadow-neo text-center rounded-neo`}
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-5xl font-black uppercase mb-2 tracking-tighter">
                {stat.value}
              </div>
              <div className="font-mono font-bold text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
