import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Zap, Users, TrendingUp, ArrowRight, Wand2, Brain, Code, MessageSquare, Briefcase, Palette, Star, Chrome } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const CATEGORIES = [
  { name: 'Marketing', icon: TrendingUp, color: 'from-blue-500 to-cyan-500', desc: 'Social media & campaigns' },
  { name: 'Code', icon: Code, color: 'from-green-500 to-emerald-500', desc: 'Development & debugging' },
  { name: 'Writing', icon: MessageSquare, color: 'from-purple-500 to-pink-500', desc: 'Content & copywriting' },
  { name: 'Business', icon: Briefcase, color: 'from-orange-500 to-red-500', desc: 'Strategy & planning' },
  { name: 'Creative', icon: Palette, color: 'from-yellow-500 to-orange-500', desc: 'Design & art' },
  { name: 'AI', icon: Brain, color: 'from-indigo-500 to-purple-500', desc: 'Machine learning' },
]

const STATS = [
  { value: '10K+', label: 'Prompts Generated', icon: Sparkles },
  { value: '5K+', label: 'Happy Users', icon: Users },
  { value: '50+', label: 'Categories', icon: Zap },
]

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Content Creator', text: 'Excellent tool. Saves me hours daily.', rating: 5 },
  { name: 'Michael Rodriguez', role: 'Developer', text: 'The AI suggestions are spot-on. Makes my job easier.', rating: 5 },
  { name: 'Emma Watson', role: 'Marketing Manager', text: 'Perfect for generating campaign ideas quickly.', rating: 5 },
]

// 3D Tilt Card Component
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [typedText, setTypedText] = useState('')
  const fullText = 'One AI Assistant to Rule Them All!'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className={`relative pt-20 pb-16 px-6 ${
      theme === 'dark' ? 'bg-gradient-to-b from-[#053133] to-neutral-900' : 'bg-gradient-to-b from-[#EEF2FC] to-white'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-[linear-gradient(to_right,#213B41_1px,transparent_1px),linear-gradient(to_bottom,#213B41_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]'
        } bg-[size:4rem_4rem]`} />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Header */}
        <div className="text-center space-y-8 mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg ${
                theme === 'dark'
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white border border-neutral-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FC6423]" />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                View Instruction Video
              </span>
            </motion.div>
          </motion.div>

          {/* Main Heading with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#053133] to-[#FC6423]">
                {typedText}
              </span>
              <span className="animate-pulse text-[#FC6423]">|</span>
            </h1>
            <h2 className={`text-3xl md:text-5xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Your All-in-one AI Assistant
            </h2>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-700'
            }`}>
              Anytime, Anywhere!
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generate')}
              className="px-10 py-4 rounded-full bg-[#FC6423] text-white font-bold text-lg flex items-center gap-2 shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className={`px-10 py-4 rounded-full font-bold text-lg border-2 border-[#FC6423] transition-all flex items-center gap-2 ${
                theme === 'dark'
                  ? 'text-white hover:bg-[#FC6423]/10'
                  : 'text-[#053133] hover:bg-[#FC6423]/10'
              }`}
            >
              Download Extension
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`inline-flex items-center gap-4 px-6 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-white/5 border-[#FF6154]/30'
                  : 'bg-white border-[#FF6154]/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FF6154] flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div className="text-left">
                  <div className={`text-xs font-bold ${theme === 'dark' ? 'text-[#FF6154]' : 'text-[#FF6154]'}`}>
                    FEATURED ON
                  </div>
                  <div className={`font-bold ${theme === 'dark' ? 'text-[#FF6154]' : 'text-[#FF6154]'}`}>
                    Product Hunt
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#FF6154] fill-[#FF6154]" />
                <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                  544
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Explore Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <span className={`text-sm font-medium tracking-widest uppercase ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              EXPLORE
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold mt-2 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Choose Your Category
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon
              return (
                <TiltCard key={index}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/generate')}
                    className={`w-full p-6 rounded-2xl backdrop-blur-sm border transition-all ${
                      theme === 'dark'
                        ? 'bg-neutral-900/50 border-neutral-800 hover:border-[#FC6423]'
                        : 'bg-white border-neutral-200 hover:border-[#FC6423] shadow-sm hover:shadow-lg'
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-3`}
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`font-semibold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-neutral-900'
                    }`} style={{ transform: 'translateZ(10px)' }}>
                      {category.name}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-neutral-500' : 'text-neutral-600'
                    }`} style={{ transform: 'translateZ(5px)' }}>
                      {category.desc}
                    </div>
                  </motion.button>
                </TiltCard>
              )
            })}
          </div>
        </motion.div>

        {/* Stats Section - Trusted by Users */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-12 ${
            theme === 'dark' ? 'text-white' : 'text-neutral-900'
          }`}>
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC6423] to-purple-600">300,000+ users</span> worldwide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {STATS.map((stat, index) => {
              const Icon = stat.icon
              return (
                <TiltCard key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-2xl text-center backdrop-blur-sm border ${
                      theme === 'dark'
                        ? 'bg-neutral-900/50 border-neutral-800'
                        : 'bg-white border-neutral-200 shadow-lg'
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div style={{ transform: 'translateZ(30px)' }}>
                      <Icon className="w-8 h-8 text-[#FC6423] mx-auto mb-3" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#FC6423] to-purple-600 bg-clip-text text-transparent mb-2"
                      style={{ transform: 'translateZ(20px)' }}>
                      {stat.value}
                    </div>
                    <div className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}
                      style={{ transform: 'translateZ(10px)' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                </TiltCard>
              )
            })}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-neutral-900/50 border border-neutral-800'
                    : 'bg-[#F4F1ED] border border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${
                    theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-300'
                  }`} />
                  <div>
                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                      {testimonial.name}
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
                  {testimonial.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <span className={`text-sm font-medium tracking-widest uppercase ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              SIMPLE PROCESS
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold mt-2 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Describe Your Need', desc: 'Tell us what kind of prompt you want to generate', icon: MessageSquare },
              { step: '2', title: 'AI Generates', desc: 'Watch as our AI creates a perfect prompt in real-time', icon: Sparkles },
              { step: '3', title: 'Save & Use', desc: 'Save your prompt and use it anywhere you need', icon: Star },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className={`relative p-8 rounded-2xl backdrop-blur-sm border ${
                    theme === 'dark'
                      ? 'bg-neutral-900/50 border-neutral-800'
                      : 'bg-white border-neutral-200 shadow-lg'
                  }`}
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#FC6423] to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="mb-4">
                    <Icon className="w-12 h-12 text-[#FC6423]" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {item.title}
                  </h3>
                  <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
                    {item.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={`relative p-12 rounded-3xl backdrop-blur-sm text-center overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#053133] to-purple-900/20 border border-[#FC6423]/30'
              : 'bg-gradient-to-br from-[#053133] to-purple-100 border border-[#FC6423]/30'
          }`}
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Get Started with
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Vibe Prompting Now!
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/generate')}
                className="px-10 py-4 rounded-full bg-[#FC6423] text-white font-bold text-lg shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                Get Started
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/browse')}
                className="px-10 py-4 rounded-full bg-white text-[#053133] font-bold text-lg border-2 border-white hover:bg-neutral-100 transition-all flex items-center gap-2 justify-center"
              >
                Download Extension
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
