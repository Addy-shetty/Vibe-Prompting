import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  company?: string
  avatar: string
  content: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Content Creator',
    company: 'Digital Arts Studio',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    content: 'This prompt generator revolutionized my creative workflow. The AI-generated prompts are incredibly detailed and save me hours of brainstorming time!',
    rating: 5
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    company: 'Tech Innovations Inc',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    content: 'The coding prompts are spot-on! As a developer, I use this daily for documentation, code reviews, and learning new frameworks. Highly recommend!',
    rating: 5
  },
  {
    id: 3,
    name: 'Aisha Patel',
    role: 'Digital Artist',
    company: 'Creative Hub',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    content: 'The support and quality of prompts is exceptional. This tool has become an essential part of my creative process for generating stunning artwork.',
    rating: 5
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Product Designer',
    company: 'Design Co',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    content: 'Implementing this into my workflow was smooth and quick. The customizable prompts made it effortless to train my team on best practices.',
    rating: 5
  },
  {
    id: 5,
    name: 'Emma Rodriguez',
    role: 'Marketing Manager',
    company: 'Brand Studio',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    content: 'Its robust features and quick generation have transformed our content creation workflow, making us significantly more efficient and creative.',
    rating: 5
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'AI Researcher',
    company: 'ML Labs',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    content: 'The seamless integration with our tools enhanced our research operations. The prompt quality is consistently excellent and reliable.',
    rating: 5
  },
  {
    id: 7,
    name: 'Priya Sharma',
    role: 'UX Designer',
    company: 'User First',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    content: 'This platform exceeded my expectations. It streamlined my design process and helped me communicate ideas more effectively to stakeholders.',
    rating: 5
  },
  {
    id: 8,
    name: 'Alex Turner',
    role: 'Video Producer',
    company: 'Media House',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    content: 'The video generation prompts are incredibly detailed. This tool has become indispensable for our pre-production and storyboarding process.',
    rating: 5
  },
  {
    id: 9,
    name: 'Zara Ali',
    role: 'Content Strategist',
    company: 'Growth Marketing',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
    content: 'Game-changer for content creation! The variety of prompts helps us maintain consistency while exploring creative directions.',
    rating: 5
  }
]

export default function TestimonialsPage() {
  const { theme } = useTheme()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  }

  // Split testimonials into 3 columns
  const columns = [
    TESTIMONIALS.filter((_, i) => i % 3 === 0),
    TESTIMONIALS.filter((_, i) => i % 3 === 1),
    TESTIMONIALS.filter((_, i) => i % 3 === 2)
  ]

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm mb-6 bg-[#FFD700]/10 border-[#FFD700]/30"
          >
            <Star className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-medium text-[#FFD700] font-mono uppercase tracking-wider">
              Testimonials
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white font-mono uppercase tracking-tight">
            What our <span className="text-[#FFD700]">users say</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#A1A1AA]">
            See what our customers have to say about us.
          </p>
        </motion.div>

        {/* Testimonials Grid - 3 Columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-6">
              {column.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 bg-[#1A1A1A] border-[#333333] hover:border-[#FFD700]/40 hover:shadow-xl hover:shadow-[#FFD700]/10"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote className="w-12 h-12" />
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
                  <p className="text-sm leading-relaxed mb-6 text-[#A1A1AA]">
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
                      <h4 className="font-semibold text-sm text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-[#555]">
                        {testimonial.role}
                        {testimonial.company && (
                          <span className="ml-1">• {testimonial.company}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.div
            className="max-w-2xl mx-auto p-8 rounded-3xl border backdrop-blur-sm bg-gradient-to-r from-[#A855F7]/20 to-[#ec4899]/20 border-[#A855F7]/30"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white font-mono uppercase">
              Ready to transform your <span className="text-[#A855F7]">workflow?</span>
            </h3>
            <p className="mb-6 text-[#A1A1AA]">
              Join thousands of satisfied users and start creating amazing prompts today!
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
