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
import SplitFlapText from '@/components/ui/SplitFlapText'
import { SideNav } from '@/components/SideNav'
import { CursorFollower } from '@/components/CursorFollower'
import { SignalsSection } from '@/components/SignalsSection'
import { HighlightText } from '@/components/HighlightText'

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
    <div className="relative w-full min-h-screen font-sans overflow-hidden bg-[#0a0a0a]">
      
      {/* Cursor Follower Orb */}
      <CursorFollower />
      
      {/* Side Navigation */}
      <SideNav />
      
      {/* Tech Noir Grid Background */}
      <div className="absolute inset-0 noir-grid-bg opacity-50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Code Snippets - Yellow tinted */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-noir-yellow opacity-20 font-mono text-xs"
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
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-noir-yellow opacity-5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-noir-yellow opacity-3 rounded-full blur-[80px]"></div>
      </div>
      
      {/* Hero Section */}
      <div id="hero" className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 md:pt-36 md:pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge - Tech Noir Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 mb-10 border border-noir-yellow/30 bg-noir-yellow/5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-noir-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-noir-yellow shadow-glow-yellow-sm"></span>
            </span>
            <span className="font-display uppercase tracking-widest text-sm text-noir-yellow">System v2.0 Online</span>
          </motion.div>

          {/* Headline with Split-Flap Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-wide leading-[0.9] mb-10 text-white">
            <SplitFlapText text="Prompt Engineering" delay={0.3} stagger={0.04} /> <br />
            <span className="inline-block mt-4 text-noir-yellow text-glow">
              <SplitFlapText text="For Developers" delay={0.8} stagger={0.05} />
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl font-sans text-neutral-400 mb-12 leading-relaxed">
            Stop wrestling with generic AI responses. Generate production-ready prompts optimized for coding, debugging, and architecture.
          </p>

          {/* Input Section - Tech Noir Style */}
          <div className="w-full max-w-3xl relative z-20 mb-16">
            <div className="border border-neutral-800 bg-noir-gray/50 backdrop-blur-sm p-1 hover:border-noir-yellow/30 transition-all duration-300 group">
              <form onSubmit={handleQuickGenerate} className="flex items-stretch">
                <div className="flex items-center pl-5 text-noir-yellow">
                  <Terminal className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe required system parameters..."
                  className="flex-1 px-5 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-lg font-mono text-white placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  className="bg-noir-yellow text-noir-black px-8 py-4 font-display font-bold uppercase tracking-wider hover:shadow-glow-yellow transition-all duration-300"
                >
                  ⚡ Generate High-ROI Prompts
                </button>
              </form>
            </div>
            
            {/* Quick Tags - Tech Noir */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['React Component', 'SQL Query', 'API Endpoint', 'Unit Tests'].map((tag, i) => (
                <button
                  key={tag}
                  onClick={() => setInput(tag)}
                  className="px-5 py-2.5 border border-neutral-800 text-sm font-display uppercase tracking-wider text-neutral-400 hover:border-noir-yellow/50 hover:text-noir-yellow hover:bg-noir-yellow/5 transition-all duration-300"
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
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
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
              whileHover={{ scale: 1.1, y: -3 }}
              className="flex items-center gap-2 cursor-pointer transition-all duration-300 group px-4 py-2 border border-neutral-800 hover:border-noir-yellow/50 bg-neutral-900/50 hover:bg-noir-yellow/10"
            >
              <tech.icon className="w-5 h-5 text-neutral-400 group-hover:text-noir-yellow transition-colors" />
              <span className="font-display uppercase text-sm text-neutral-300 group-hover:text-noir-yellow transition-colors">{tech.label}</span>
            </motion.div>
          ))}
          </motion.div>
        </div>
      </div>

      {/* What's New - Feature Updates Section */}
      <SignalsSection />

      {/* Experiments Section - Prompt Showcase */}
      <div id="demo" className="py-32 pl-6 md:pl-28">
        {/* Section Header */}
        <div className="mb-16 pr-6 md:pr-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-yellow">02 / Experiments</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-4 gap-6">
            <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white">PROMPT<br/>SHOWCASE</h2>
            <p className="text-neutral-400 font-mono text-sm max-w-md leading-relaxed">
              Real transformation examples across development, DevOps, testing, and security domains.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-0 overflow-x-auto mb-12 pr-6 md:pr-12" style={{ scrollbarWidth: "none" }}>
          {[
            { id: 0, label: 'DEVELOPMENT', active: true },
            { id: 1, label: 'DEVOPS' },
            { id: 2, label: 'TESTING' },
            { id: 3, label: 'SECURITY' },
            { id: 4, label: 'ARCHITECTURE' },
          ].map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setDemoStep(cat.id)}
              className={`flex-shrink-0 px-8 py-4 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-b-2 ${
                demoStep === cat.id 
                  ? 'text-noir-yellow border-noir-yellow bg-noir-yellow/5' 
                  : 'text-neutral-500 border-neutral-800 hover:text-neutral-300 hover:border-neutral-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Before/After Cards */}
        <div className="grid md:grid-cols-2 gap-6 pr-6 md:pr-12">
          {/* Before */}
          <div className="border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-1.5 bg-red-500/20 text-red-400 font-mono uppercase text-[10px] tracking-widest border border-red-500/30">
                Input
              </div>
              <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">Raw Prompt</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={demoStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-base leading-relaxed text-neutral-400"
              >
                {demoStep === 0 && '"Build a React dashboard with authentication"'}
                {demoStep === 1 && '"Set up CI/CD pipeline for my Node.js app"'}
                {demoStep === 2 && '"Write tests for my user service"'}
                {demoStep === 3 && '"Check my API for security vulnerabilities"'}
                {demoStep === 4 && '"Design a microservices architecture"'}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* After */}
          <div className="border border-noir-yellow/30 bg-noir-yellow/5 p-8 backdrop-blur-sm relative overflow-hidden group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-noir-yellow/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-1.5 bg-noir-yellow text-noir-black font-mono uppercase text-[10px] tracking-widest">
                  Output
                </div>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">AI-Enhanced</span>
                <Sparkles className="w-4 h-4 text-noir-yellow ml-auto" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={demoStep}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-xs text-neutral-300 leading-relaxed"
                >
                  {demoStep === 0 && (
                    <span>"Act as a <span className="text-noir-yellow">Senior React Architect</span> with Next.js 14 expertise. Build a production-grade admin dashboard with: <span className="text-noir-yellow">RBAC</span>, protected routes via middleware, <span className="text-noir-yellow">JWT refresh logic</span>, secure sessions. Apply: component composition, Zustand state management, error boundaries, <span className="text-noir-yellow">type-safe API calls</span>. Include folder structure + security considerations."</span>
                  )}
                  {demoStep === 1 && (
                    <span>"Act as a <span className="text-noir-yellow">DevOps Engineer</span> specializing in GitHub Actions and AWS. Design a production CI/CD pipeline with: <span className="text-noir-yellow">multi-stage Docker builds</span>, automated testing gates, <span className="text-noir-yellow">blue-green deployments</span>, secrets management via AWS Secrets Manager, <span className="text-noir-yellow">Slack notifications</span>, rollback strategies. Include: Terraform IaC, cost optimization, and monitoring with CloudWatch."</span>
                  )}
                  {demoStep === 2 && (
                    <span>"Act as a <span className="text-noir-yellow">QA Architect</span> with Jest/Vitest expertise. Write comprehensive tests for UserService including: <span className="text-noir-yellow">unit tests</span> with 90%+ coverage, <span className="text-noir-yellow">integration tests</span> with test containers, mock strategies for external APIs, <span className="text-noir-yellow">edge case handling</span> (null, undefined, race conditions), performance benchmarks. Follow AAA pattern, include CI integration."</span>
                  )}
                  {demoStep === 3 && (
                    <span>"Act as a <span className="text-noir-yellow">Security Auditor</span> (OWASP-certified). Perform comprehensive API security review: <span className="text-noir-yellow">SQL injection</span> analysis, XSS vulnerabilities, <span className="text-noir-yellow">CSRF protection</span> audit, rate limiting assessment, <span className="text-noir-yellow">JWT implementation</span> review, CORS configuration check. Provide: severity ratings, exploit PoCs, remediation code, and compliance checklist (SOC2, GDPR)."</span>
                  )}
                  {demoStep === 4 && (
                    <span>"Act as a <span className="text-noir-yellow">Solutions Architect</span> (AWS-certified). Design event-driven microservices: <span className="text-noir-yellow">domain boundaries</span> via DDD, async messaging with SQS/SNS, <span className="text-noir-yellow">saga pattern</span> for transactions, API gateway with rate limiting, <span className="text-noir-yellow">service mesh</span> (Istio). Include: C4 diagrams, failure modes, scaling strategies, cost projections for 10K/100K/1M users."</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Principles Section - HOW WE WORK */}
      <div id="features" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="mb-20">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-yellow">03 / Principles</span>
            <h2 className="mt-4 font-display text-6xl md:text-8xl tracking-tight text-white uppercase">HOW WE WORK</h2>
          </div>

          {/* Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Principle 1 - Interface */}
            <motion.div
              whileHover={{ y: -5 }}
              className="border border-neutral-800 bg-neutral-900/30 p-10 backdrop-blur-sm transition-all duration-300 hover:border-noir-yellow/50 group"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 block mb-8">01 / Interface</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                <HighlightText className="font-display uppercase">INTENT-BASED</HighlightText>
                <span className="text-white font-display uppercase ml-2">COMPUTING</span>
              </h3>
              <p className="font-mono text-sm text-neutral-400 leading-relaxed">
                We replaced rigid forms with high-fidelity prompt engineering. Our Vibe NLE parses abstract intent into technical constraints.
              </p>
            </motion.div>

            {/* Principle 2 - Architecture */}
            <motion.div
              whileHover={{ y: -5 }}
              className="border border-neutral-800 bg-neutral-900/30 p-10 backdrop-blur-sm transition-all duration-300 hover:border-noir-yellow/50 group"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 block mb-8">02 / Architecture</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                <HighlightText className="font-display uppercase">DETERMINISTIC</HighlightText>
                <span className="text-white font-display uppercase ml-2">PLANNING</span>
              </h3>
              <p className="font-mono text-sm text-neutral-400 leading-relaxed">
                AI coding hallucinates; Vibe architects. We pre-compile strict Agile Frameworks enforcing SOLID principles and OWASP security.
              </p>
            </motion.div>

            {/* Principle 3 - Fabrication */}
            <motion.div
              whileHover={{ y: -5 }}
              className="border border-neutral-800 bg-neutral-900/30 p-10 backdrop-blur-sm transition-all duration-300 hover:border-noir-yellow/50 group"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 block mb-8">03 / Fabrication</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                <HighlightText className="font-display uppercase">AGENTIC</HighlightText>
                <span className="text-white font-display uppercase ml-2">FABRICATION</span>
              </h3>
              <p className="font-mono text-sm text-neutral-400 leading-relaxed">
                Specialized Builder Agents generate production-ready React & Rust code, automating the SDLC from branch to deployment.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section - Tech Noir */}
      <div id="cta" className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="bg-noir-gray/50 border border-noir-yellow/30 p-16 relative overflow-hidden backdrop-blur-sm group hover:border-noir-yellow/50 transition-all duration-500">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-noir-yellow/0 via-noir-yellow/5 to-noir-yellow/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-8 tracking-wide text-white">
              Ready to <span className="text-noir-yellow text-glow">Vibe</span>?
            </h2>
            <p className="text-xl font-sans mb-12 text-neutral-400">
              Join <span className="text-noir-yellow font-display">{statsCounter.users.toLocaleString()}+</span> developers generating better code.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-noir-yellow text-noir-black text-lg px-10 py-4 font-display font-bold uppercase tracking-wider hover:shadow-glow-yellow-lg transition-all duration-300"
            >
              Initialize System →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Footer Section - Tech Noir */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              icon: <Zap className="w-6 h-6" />,
              value: statsCounter.prompts.toLocaleString() + '+',
              label: 'Prompts Generated',
              borderColor: 'border-noir-yellow/30',
              iconColor: 'text-noir-yellow'
            },
            { 
              icon: <Users className="w-6 h-6" />,
              value: statsCounter.users.toLocaleString() + '+',
              label: 'Active Users',
              borderColor: 'border-blue-500/30',
              iconColor: 'text-blue-400'
            },
            { 
              icon: <TrendingUp className="w-6 h-6" />,
              value: statsCounter.satisfaction + '%',
              label: 'Satisfaction Rate',
              borderColor: 'border-green-500/30',
              iconColor: 'text-green-400'
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              className={`${stat.borderColor} border bg-noir-gray/30 p-8 text-center backdrop-blur-sm`}
            >
              <div className={`flex justify-center mb-4 ${stat.iconColor}`}>{stat.icon}</div>
              <div className="text-4xl font-display font-bold uppercase mb-2 tracking-wide text-white">
                {stat.value}
              </div>
              <div className="font-sans text-sm uppercase tracking-wider text-neutral-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Credits Section */}
      <div className="py-32 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-yellow">04 / Colophon</span>
            <h2 className="mt-4 font-display text-6xl md:text-8xl tracking-tight text-white uppercase">CREDITS</h2>
          </div>

          {/* Credits Grid - Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-neutral-800">
            {/* Design */}
            <div className="border-r border-b border-neutral-800 p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 block mb-6">Design</span>
              <p className="font-mono text-sm text-neutral-300">Vibe Prompting</p>
              <p className="font-mono text-sm text-neutral-300">Studio</p>
            </div>

            {/* Stack */}
            <div className="border-r border-b border-neutral-800 p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 block mb-6">Stack</span>
              <p className="font-mono text-sm text-neutral-300">React + Vite</p>
              <p className="font-mono text-sm text-neutral-300">Tailwind CSS</p>
              <p className="font-mono text-sm text-neutral-300">Supabase</p>
            </div>

            {/* Typography */}
            <div className="border-r border-b border-neutral-800 p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 block mb-6">Typography</span>
              <p className="font-mono text-sm text-neutral-300">Orbitron</p>
              <p className="font-mono text-sm text-neutral-300">Inter</p>
              <p className="font-mono text-sm text-neutral-300">JetBrains Mono</p>
            </div>

            {/* Location */}
            <div className="border-r border-b border-neutral-800 p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 block mb-6">Location</span>
              <p className="font-mono text-sm text-neutral-300">Remote</p>
              <p className="font-mono text-sm text-neutral-300">Everywhere</p>
            </div>
          </div>

          {/* Credits Grid - Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-l border-neutral-800 mb-16">
            {/* Contact */}
            <div className="border-r border-b border-neutral-800 p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 block mb-6">Contact</span>
              <a href="mailto:#" className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block">Email</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block">Twitter/X</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block">LinkedIn</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block">GitHub</a>
            </div>

            {/* Year */}
            <div className="border-r border-b border-neutral-800 p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 block mb-6">Year</span>
              <p className="font-mono text-sm text-neutral-300">2025</p>
              <p className="font-mono text-sm text-neutral-300">Ongoing</p>
            </div>

            {/* Product */}
            <div className="border-r border-b border-neutral-800 p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 block mb-6">Product</span>
              <button onClick={() => navigate('/generate')} className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block text-left">Generate</button>
              <button onClick={() => navigate('/explore')} className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block text-left">Explore</button>
              <button onClick={() => navigate('/pricing')} className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block text-left">Pricing</button>
              <button onClick={() => navigate('/dashboard')} className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block text-left">Dashboard</button>
            </div>

            {/* Resources */}
            <div className="border-r border-b border-neutral-800 p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 block mb-6">Resources</span>
              <button onClick={() => navigate('/docs')} className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block text-left">Docs</button>
              <button onClick={() => navigate('/docs')} className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block text-left">API</button>
              <button onClick={() => navigate('/docs')} className="font-mono text-sm text-neutral-300 hover:text-noir-yellow transition-colors block text-left">Examples</button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-xs text-neutral-500">
              © {new Date().getFullYear()} VibePrompting. All rights reserved.
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-noir-yellow/30 to-transparent mx-8 hidden md:block"></div>
            <p className="font-mono text-xs text-neutral-500">
              Built for developers, by developers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
