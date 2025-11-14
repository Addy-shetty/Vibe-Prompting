import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, Zap, ArrowRight, Star, Quote, Code, Database, Globe, Shield, Rocket, CheckCircle2, Users, TrendingUp } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { Spotlight } from '@/components/ui/spotlight'
import { useNavigate } from 'react-router-dom'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Senior Full Stack Developer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'This tool generates incredibly detailed prompts for code reviews, documentation, and architecture decisions. A game-changer for my workflow!',
    rating: 5
  },
  {
    id: 2,
    name: 'Maya Chen',
    role: 'DevOps Engineer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'The infrastructure and deployment prompts are spot-on! Saves me hours on writing CI/CD configs and Kubernetes setups.',
    rating: 5
  },
  {
    id: 3,
    name: 'Jordan Smith',
    role: 'Frontend Developer',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    content: 'Perfect for React, Vue, and Angular development. The component architecture prompts are exactly what I need!',
    rating: 5
  },
  {
    id: 4,
    name: 'Priya Kumar',
    role: 'Backend Architect',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    content: 'Database schema, API design, microservices - this generates comprehensive prompts for all backend needs. Highly recommended!',
    rating: 5
  },
  {
    id: 5,
    name: 'Marcus Johnson',
    role: 'Mobile Developer',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    content: 'The React Native and Flutter prompts are incredibly detailed. This accelerated my development workflow significantly.',
    rating: 5
  },
  {
    id: 6,
    name: 'Sophie Anderson',
    role: 'QA Automation Engineer',
    avatar: 'https://randomuser.me/api/portraits/women/27.jpg',
    content: 'Test case generation and automation scripts are now so much easier. This tool understands testing workflows perfectly!',
    rating: 5
  }
]

const FEATURES = [
  {
    icon: Code,
    title: 'Frontend Development',
    description: 'Generate prompts for React, Vue, Angular components with detailed specifications and best practices.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Database,
    title: 'Backend & APIs',
    description: 'Create comprehensive prompts for database schemas, REST APIs, and microservices architecture.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Globe,
    title: 'Full Stack Projects',
    description: 'End-to-end project prompts covering frontend, backend, database, and deployment.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Security & Testing',
    description: 'Security best practices, authentication flows, and comprehensive testing strategies.',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    icon: Rocket,
    title: 'DevOps & CI/CD',
    description: 'Deployment pipelines, Docker configs, Kubernetes setups, and infrastructure as code.',
    gradient: 'from-orange-500 to-yellow-500'
  },
  {
    icon: Sparkles,
    title: 'AI Integration',
    description: 'Integrate AI capabilities, LLMs, and machine learning models into your applications.',
    gradient: 'from-violet-500 to-purple-500'
  }
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Describe Your Project',
    description: 'Tell us what you want to build - be specific about features, tech stack, and requirements.',
    icon: Users
  },
  {
    step: '2',
    title: 'AI Generates Prompt',
    description: 'Our AI analyzes your input and creates a detailed, structured prompt tailored to your needs.',
    icon: Sparkles
  },
  {
    step: '3',
    title: 'Copy & Use',
    description: 'Copy the prompt and use it with ChatGPT, Claude, or any AI assistant to get perfect code.',
    icon: CheckCircle2
  }
]

export default function Hero() {
  const { theme } = useTheme()
  const navigate = useNavigate()

  return (
    <section className="relative pt-32 pb-20 px-6">
      {/* SEO-optimized keywords: AI prompts, portrait generation, text-to-image, AI art, prompt engineering */}
      <Spotlight size={300} className="from-purple-500 via-purple-400 to-transparent" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-7">
          {/* Badge with keyword */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-purple-500/10 border-purple-500/30'
                  : 'bg-purple-50 border-purple-200'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                AI-Powered Developer Prompts
              </span>
            </motion.div>
          </motion.div>

          {/* SEO-optimized H1 with keywords: AI prompts, development, coding */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-5xl md:text-6xl font-normal leading-tight tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="inline-block"
            >
              Generate perfect prompts for
            </motion.span>
            <br />
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
            >
              developers & tech teams
            </motion.span>
          </motion.h1>

          {/* SEO Description with keywords */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            AI-powered prompts for <strong className="font-semibold">code generation</strong>, 
            <strong className="font-semibold"> architecture design</strong>, 
            <strong className="font-semibold"> testing workflows</strong>, and 
            <strong className="font-semibold"> technical documentation</strong> - built for developers who ship faster
          </motion.p>

          {/* Prompt Input with hover effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4"
          >
            <motion.div 
              whileHover={{ scale: 1.02, boxShadow: theme === 'dark' ? '0 0 30px rgba(147, 51, 234, 0.3)' : '0 0 30px rgba(99, 102, 241, 0.2)' }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-[500px] mx-auto h-[42px] rounded-full shadow-lg backdrop-blur-sm flex items-center ${
                theme === 'dark' ? 'bg-[#2C2B2E]' : 'bg-white border border-neutral-200'
              }`}
            >
              <input
                type="text"
                placeholder="e.g., Build a responsive dashboard with React..."
                aria-label="Developer prompt input for generating code, architecture, and technical prompts"
                className={`flex-1 bg-transparent text-[15px] tracking-wider px-5 outline-none ${
                  theme === 'dark'
                    ? 'text-white placeholder:text-[#AAAAAA]'
                    : 'text-neutral-900 placeholder:text-neutral-400'
                }`}
              />
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(147, 51, 234, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/generate')}
                className={`absolute right-[7px] h-[28px] px-4 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                }`}
                aria-label="Generate AI portrait"
              >
                <Zap className="w-3 h-3" />
                Generate
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Example Prompts with hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-3"
          >
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Try these examples:
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl mx-auto">
              {[
                { text: 'Build a React authentication system with JWT', category: 'Frontend' },
                { text: 'Create REST API with Node.js and MongoDB', category: 'Backend' },
                { text: 'Design microservices architecture for e-commerce', category: 'Architecture' },
                { text: 'Write unit tests for React components', category: 'Testing' },
                { text: 'Setup CI/CD pipeline with GitHub Actions', category: 'DevOps' }
              ].map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/generate', { state: { prompt: example.text } })}
                  title={`Example: ${example.category}`}
                  className={`px-4 py-2 rounded-full shadow-lg backdrop-blur-sm text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-[#2C2B2E] hover:bg-[#353438] hover:border-purple-500/50 border border-neutral-800 text-neutral-300 hover:text-white'
                      : 'bg-white border border-neutral-200 hover:border-purple-300 hover:bg-purple-50 text-neutral-600 hover:text-purple-700'
                  }`}
                >
                  {example.text}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: theme === 'dark' 
                  ? '0 20px 40px rgba(147, 51, 234, 0.4)' 
                  : '0 20px 40px rgba(99, 102, 241, 0.3)' 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generate')}
              className={`px-8 py-4 rounded-2xl font-semibold text-base flex items-center gap-2 shadow-lg transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
              aria-label="Start creating AI portraits for free"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/prompts')}
              className={`px-8 py-4 rounded-2xl font-semibold text-base backdrop-blur-sm border transition-all ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-purple-50 hover:border-purple-300'
              }`}
              aria-label="View AI art examples"
            >
              View Examples
            </motion.button>
          </motion.div>

          {/* Trust Badges / Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`pt-8 flex items-center justify-center gap-6 text-sm ${
              theme === 'dark' ? 'text-neutral-500' : 'text-neutral-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              10K+ Prompts Generated
            </span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              5K+ Happy Users
            </span>
          </motion.div>
        </div>
      </div>

      {/* Companies / Clients Section */}
      <div className="max-w-7xl mx-auto mt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className={`text-xs font-semibold tracking-wider mb-8 ${
            theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            TRUSTED BY LEADING COMPANIES
          </p>
          
          <div className="relative overflow-hidden py-4">
            {/* Gradient Overlays */}
            <div className={`absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-[#151316] to-transparent' 
                : 'bg-gradient-to-r from-neutral-100 to-transparent'
            }`}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none ${
              theme === 'dark' 
                ? 'bg-gradient-to-l from-[#151316] to-transparent' 
                : 'bg-gradient-to-l from-neutral-100 to-transparent'
            }`}></div>

            {/* Infinite Scroll Animation */}
            <motion.div
              animate={{
                x: [0, -1200],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
              className="flex gap-12 items-center"
              style={{ width: 'max-content' }}
            >
              {/* First Set of Logos */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-12 items-center">
                  {/* Google */}
                  <div className="flex items-center justify-center w-28">
                    <svg className={`h-7 ${theme === 'dark' ? 'opacity-50 hover:opacity-100' : 'opacity-40 hover:opacity-80'} transition-opacity`} viewBox="0 0 272 92" fill="none">
                      <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill={theme === 'dark' ? '#fff' : '#000'}/>
                      <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill={theme === 'dark' ? '#fff' : '#000'}/>
                      <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill={theme === 'dark' ? '#fff' : '#000'}/>
                      <path d="M225 3v65h-9.5V3h9.5z" fill={theme === 'dark' ? '#fff' : '#000'}/>
                      <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill={theme === 'dark' ? '#fff' : '#000'}/>
                      <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill={theme === 'dark' ? '#fff' : '#000'}/>
                    </svg>
                  </div>

                  {/* OpenAI */}
                  <div className="flex items-center justify-center w-28">
                    <svg className={`h-7 ${theme === 'dark' ? 'opacity-50 hover:opacity-100' : 'opacity-40 hover:opacity-80'} transition-opacity`} viewBox="0 0 120 30" fill={theme === 'dark' ? '#fff' : '#000'}>
                      <text x="0" y="20" fontSize="20" fontWeight="600" fontFamily="Arial, sans-serif">OpenAI</text>
                    </svg>
                  </div>

                  {/* Microsoft */}
                  <div className="flex items-center justify-center w-28">
                    <svg className={`h-7 ${theme === 'dark' ? 'opacity-50 hover:opacity-100' : 'opacity-40 hover:opacity-80'} transition-opacity`} viewBox="0 0 23 23" fill="none">
                      <rect width="10" height="10" fill="#F25022"/>
                      <rect x="13" width="10" height="10" fill="#7FBA00"/>
                      <rect y="13" width="10" height="10" fill="#00A4EF"/>
                      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                    </svg>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center justify-center w-28">
                    <svg className={`h-7 ${theme === 'dark' ? 'opacity-50 hover:opacity-100' : 'opacity-40 hover:opacity-80'} transition-opacity`} viewBox="0 0 98 96" fill={theme === 'dark' ? '#fff' : '#000'}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
                    </svg>
                  </div>

                  {/* Vercel */}
                  <div className="flex items-center justify-center w-28">
                    <svg className={`h-6 ${theme === 'dark' ? 'opacity-50 hover:opacity-100' : 'opacity-40 hover:opacity-80'} transition-opacity`} viewBox="0 0 76 65" fill={theme === 'dark' ? '#fff' : '#000'}>
                      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/>
                    </svg>
                  </div>

                  {/* Stripe */}
                  <div className="flex items-center justify-center w-28">
                    <svg className={`h-7 ${theme === 'dark' ? 'opacity-50 hover:opacity-100' : 'opacity-40 hover:opacity-80'} transition-opacity`} viewBox="0 0 120 50" fill={theme === 'dark' ? '#fff' : '#000'}>
                      <text x="0" y="30" fontSize="28" fontWeight="600" fontFamily="Arial, sans-serif">Stripe</text>
                    </svg>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto mt-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm mb-4"
            style={{
              background: theme === 'dark' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(99, 102, 241, 0.1)',
              borderColor: theme === 'dark' ? 'rgba(147, 51, 234, 0.3)' : 'rgba(99, 102, 241, 0.3)'
            }}
          >
            <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              Testimonials
            </span>
          </motion.div>

          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-neutral-900'
          }`}>
            What our users say
          </h2>
          <p className={`text-base md:text-lg ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            See what our customers have to say about us
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:shadow-xl hover:shadow-purple-500/10'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xl'
              }`}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-10 h-10" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>

              {/* Content */}
              <p className={`text-sm leading-relaxed mb-6 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                {testimonial.content}
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/20"
                />
                <div>
                  <h4 className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {testimonial.name}
                  </h4>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'
                  }`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto mt-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-neutral-900'
          }`}>
            Everything You Need to Build Faster
          </h2>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Comprehensive prompts for every aspect of modern development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative rounded-2xl p-8 border backdrop-blur-sm transition-all duration-300 group ${
                  theme === 'dark'
                    ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xl'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className={`text-xl font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}>
                  {feature.title}
                </h3>
                
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto mt-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-neutral-900'
          }`}>
            How It Works
          </h2>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Get professional-grade prompts in 3 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-purple-600 to-pink-600'
                }`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Connector Line (except last item) */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className={`hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 ${
                    theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'
                  }`} />
                )}

                <h3 className={`text-xl font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}>
                  {item.title}
                </h3>
                
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mt-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative rounded-3xl p-12 border backdrop-blur-sm overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30'
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative z-10 text-center space-y-6">
            <h2 className={`text-3xl md:text-4xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Ready to Build Something Amazing?
            </h2>
            
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              Join thousands of developers using AI-powered prompts to ship faster and build better
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className={`px-8 py-4 rounded-2xl font-semibold text-base flex items-center gap-2 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/prompts')}
                className={`px-8 py-4 rounded-2xl font-semibold text-base border ${
                  theme === 'dark'
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-neutral-300 text-neutral-700 hover:bg-white'
                }`}
              >
                Browse Prompts
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className={`flex items-center justify-center gap-8 pt-6 text-sm ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Free forever
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className={`max-w-7xl mx-auto mt-32 px-6 py-12 border-t ${
        theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}>
                Vibe Prompting
              </span>
            </div>
            <p className={`text-sm max-w-sm ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              AI-powered prompt generation for developers. Build faster, code smarter, ship better products.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className={`font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Product
            </h4>
            <ul className="space-y-2">
              {['Features', 'Prompts', 'Docs', 'Examples'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => item === 'Prompts' ? navigate('/prompts') : item === 'Docs' ? navigate('/docs') : null}
                    className={`text-sm hover:underline ${
                      theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Company
            </h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Contact', 'Privacy'].map((item) => (
                <li key={item}>
                  <button className={`text-sm hover:underline ${
                    theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={`pt-8 border-t text-center text-sm ${
          theme === 'dark' ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-600'
        }`}>
          © {new Date().getFullYear()} Vibe Prompting. All rights reserved.
        </div>
      </footer>
    </section>
  )
}
