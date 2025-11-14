import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { 
  Book, 
  Shield, 
  Code, 
  Database, 
  Rocket, 
  Lock,
  FileText,
  Settings,
  GitBranch,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Search,
  Menu,
  X,
  Home,
  ArrowUp
} from 'lucide-react'

interface DocSection {
  id: string
  title: string
  icon: any
  content: string
  file: string
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    title: 'Project Overview',
    icon: Book,
    file: 'README.md',
    content: `
# 🚀 Vibe Prompting - AI-Powered Developer Prompts

A modern SaaS platform for generating and managing AI prompts specifically designed for developers.

## ✨ Features

### 🎯 Core Features
- **AI Prompt Generation** - Generate detailed, structured prompts using Google Gemini 2.0 Flash
- **28+ Curated Prompts** - Pre-built prompts for Frontend, Backend, DevOps, Security, etc.
- **Category Organization** - Organized by development domains
- **User Authentication** - Secure signup/login with Supabase Auth
- **Save & Manage Prompts** - Save favorites and manage from dashboard
- **Public/Private Prompts** - Share with community or keep private
- **Tags System** - Organize prompts with up to 5 tags each

### 🛡️ Security Features
- Input validation with Zod schemas
- XSS & SQL injection prevention
- Client-side rate limiting
- Password strength checking
- Row Level Security (RLS) in database

### 🎨 UI/UX
- Beautiful dark/light mode toggle
- Smooth animations with Framer Motion
- Responsive design (mobile-first)
- Interactive animated tiles background
- Real-time prompt generation streaming

## 📦 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Framer Motion
- React Router

**Backend:**
- Supabase (PostgreSQL + Auth + RLS)
- Google Gemini 2.0 Flash API
- OpenRouter API (fallback)

## 🎯 Key Statistics
- 28+ curated developer prompts
- 10+ categories
- Real-time AI streaming
- Full offline support
    `
  },
  {
    id: 'setup',
    title: 'Setup & Installation',
    icon: Settings,
    file: 'SUPABASE_SETUP.md',
    content: `
# 📦 Setup & Installation

## Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Gemini API key (or OpenRouter API key)

## Installation Steps

### 1. Clone Repository
\`\`\`bash
git clone <your-repo-url>
cd vibe-prompting
npm install
\`\`\`

### 2. Environment Variables

Create \`.env\` file:
\`\`\`env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API (use one or both)
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
\`\`\`

### 3. Database Setup

Run migrations in order in Supabase SQL Editor:

1. **Profiles Table** (\`001_profiles.sql\`)
   - Creates user profiles
   - Auto-creation trigger
   - Unique username generation

2. **Prompts Table** (\`002_prompts.sql\`)
   - Creates prompts storage
   - RLS policies
   - Indexes for performance

3. **Tags Column** (\`003_add_tags_column.sql\`)
   - Adds tags support
   - GIN index for search

4. **Seed Data** (\`insert_awesome_prompts.sql\`)
   - 28 curated prompts
   - Replace USER_ID before running

### 4. Start Development

\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:5173\`

## 📊 Database Schema

### profiles
- id (UUID, PK, references auth.users)
- username (TEXT, unique)
- avatar_url (TEXT, nullable)
- bio (TEXT, nullable)
- created_at, updated_at

### prompts
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- title (TEXT)
- content (TEXT)
- category (TEXT)
- tags (TEXT[])
- is_public (BOOLEAN)
- views_count, likes_count (INTEGER)
- created_at, updated_at
    `
  },
  {
    id: 'security',
    title: 'Security Implementation',
    icon: Shield,
    file: 'SECURITY.md',
    content: `
# 🛡️ Security Implementation

## Overview
Comprehensive security measures implemented at all layers.

## Input Validation

### Zod Schemas
\`\`\`typescript
// Email & Password
loginSchema = {
  email: 1-50 characters, valid email format
  password: 8-25 characters
}

// Signup
signupSchema = {
  username: 3-20 characters, alphanumeric + underscore
  email: 1-50 characters, valid format
  password: 8-25 characters, strength check
}
\`\`\`

## XSS Prevention
- Input sanitization before database operations
- HTML/script tag detection and removal
- Special character escaping

## SQL Injection Protection
- Parameterized queries via Supabase
- Input pattern validation
- SQL keyword detection

## Rate Limiting
- Login: 5 attempts per minute
- Signup: 3 attempts per minute
- Client-side enforcement

## Password Security
- Minimum 8 characters
- Strength scoring (0-4)
- Real-time feedback
- Visual strength indicator

## Database Security

### Row Level Security (RLS)
\`\`\`sql
-- Profiles: Users can only edit their own
-- Prompts: Users see public OR their own
\`\`\`

### Policies
- SELECT: Public prompts OR user's own
- INSERT: Authenticated users only
- UPDATE/DELETE: Own content only

## Character Limits
- Email: 50 characters
- Password: 25 characters
- Username: 20 characters
- Prompt Title: 100 characters
- Prompt Content: 5000 characters
- Tags: 20 characters each, max 5

## Unique Username Generation
- Base username + 4-char UUID prefix
- Prevents duplicates
- Format: \`username_abcd\`

## Best Practices
✅ Never store sensitive data in localStorage
✅ Use HTTPS in production
✅ Enable email verification in Supabase
✅ Add reCAPTCHA for signup/login
✅ Implement server-side rate limiting
✅ Regular security audits
    `
  },
  {
    id: 'database',
    title: 'Database Migrations',
    icon: Database,
    file: 'supabase/README.md',
    content: `
# 🗄️ Database Migrations

## Migration Files

### 001_profiles.sql
**Purpose:** User profiles with auto-creation

**Features:**
- Auto-creates profile on signup
- Unique username generation
- RLS policies for privacy
- Service role bypass for triggers

**Trigger:** \`handle_new_user()\`
- Generates unique username
- Creates profile on auth.users insert

### 002_prompts.sql
**Purpose:** Store AI-generated prompts

**Features:**
- Full CRUD operations
- Public/private visibility
- Category organization
- View & like counters
- RLS policies

**Indexes:**
- user_id, category, is_public
- created_at (DESC for recent first)

### 003_add_tags_column.sql
**Purpose:** Add tags support

**Features:**
- TEXT[] array for tags
- GIN index for fast search
- NULL by default

**Usage:**
\`\`\`sql
-- Query prompts by tag
SELECT * FROM prompts 
WHERE 'react' = ANY(tags);
\`\`\`

### insert_awesome_prompts.sql
**Purpose:** Seed 28 curated prompts

**Categories:**
- Frontend (14 prompts)
- Full Stack (7 prompts)
- Tools & Utilities (7 prompts)

**Before Running:**
1. Get your user_id from profiles
2. Replace 'YOUR_USER_ID_HERE' in script
3. Run entire script

## Running Migrations

### Order Matters!
1. ✅ 001_profiles.sql
2. ✅ 002_prompts.sql  
3. ✅ 003_add_tags_column.sql
4. ✅ insert_awesome_prompts.sql (optional)

### Via Supabase Dashboard
1. Go to SQL Editor
2. New query
3. Paste migration SQL
4. Run

### Verify Success
\`\`\`sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'prompts';
\`\`\`
    `
  },
  {
    id: 'authentication',
    title: 'Authentication Guide',
    icon: Lock,
    file: 'AUTH_GUIDE.md',
    content: `
# 🔐 Authentication Guide

## Features

### Email/Password Auth
- Signup with email verification (optional)
- Login with rate limiting
- Secure password hashing (bcrypt)
- Session management via Supabase

### Profile Auto-Creation
When user signs up:
1. Account created in \`auth.users\`
2. Trigger fires: \`handle_new_user()\`
3. Profile created in \`public.profiles\`
4. Unique username generated

### Username Generation
\`\`\`typescript
// Example
Input: "john"
Output: "john_a7b3"

// Format: {username}_{4-char-uuid}
\`\`\`

## Implementation

### Signup Flow
1. User enters email, username, password
2. Client validates with Zod schema
3. Checks username availability
4. Sanitizes input (XSS prevention)
5. Supabase creates auth account
6. Trigger creates profile
7. Auto login & redirect

### Login Flow
1. User enters email, password
2. Client validates format
3. Rate limiting check
4. Supabase authenticates
5. Session created
6. Redirect to dashboard

### Logout Flow
1. User clicks logout
2. Supabase signs out
3. Clear local state
4. Redirect to homepage

## Security Measures

### Password Requirements
- Minimum 8 characters
- Maximum 25 characters
- Strength indicator (0-4)
- Real-time feedback

### Username Rules
- 3-20 characters
- Alphanumeric + underscore
- Unique check before signup
- Auto-appends UUID suffix

### Rate Limiting
- Login: 5 attempts/minute
- Signup: 3 attempts/minute
- Tracks by email address

## AuthContext

### Hooks Available
\`\`\`typescript
const { user, signUp, signIn, signOut } = useAuth()
\`\`\`

### State Management
- User object with profile data
- Loading states
- Error handling
- Session persistence

## Protected Routes

### Pattern
\`\`\`typescript
useEffect(() => {
  if (!user) {
    navigate('/login')
  }
}, [user])
\`\`\`

### Protected Pages
- /generate
- /prompts (My Prompts)
- /profile (future)

## Future Enhancements
- [ ] OAuth (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Password reset flow
- [ ] Email verification
- [ ] Magic link login
    `
  },
  {
    id: 'features',
    title: 'Feature Implementation',
    icon: Rocket,
    file: 'CHANGES.md',
    content: `
# ✨ Feature Implementation

## Recent Changes (MVP Complete)

### 1. AI Provider Display ✅
- Shows "Powered by Google Gemini 2.0 Flash"
- Falls back to OpenRouter if no Gemini key
- Dynamic based on environment variables

### 2. Enhanced UI/UX ✅
- Prominent shadow with purple glow
- Smooth transitions
- Better visual hierarchy
- Responsive on all devices

### 3. Tags System ✅
**Features:**
- Add up to 5 tags per prompt
- 20 characters max per tag
- Press Enter to add quickly
- Visual tag chips
- Remove with X button
- Saved to database

**UI Elements:**
- Input field with Tag icon
- Tag chips with hashtag prefix
- "+X more" indicator
- Purple theme styling

### 4. Auto-Reset on Generation ✅
- Title clears automatically
- Tags reset on new generation
- Prevents data mixing
- Fresh start for each prompt

### 5. Tags in Gallery ✅
- Displayed in prompt cards
- Shows first 3 tags
- "+X more" for extras
- Clickable (future: filtering)

### 6. Complete Clear Button ✅
- Clears all fields
- Resets tags array
- Clears tag input
- Fresh slate with one click

## Core Features

### AI Prompt Generation
- Powered by Google Gemini 2.0 Flash
- Streaming responses (real-time)
- Category-based generation
- Custom user input
- Fallback to OpenRouter

### Prompt Management
- Save to database
- Public/private visibility
- Category organization
- Tag-based categorization
- Copy to clipboard
- Delete prompts

### User Interface
- Dark/light mode toggle
- Animated tiles background
- Framer Motion animations
- Toast notifications
- Loading states
- Error handling

### Search & Filter
- Search by title/content
- Filter by category
- Future: Filter by tags
- Real-time updates

## Performance

### Optimizations
- Code splitting with React.lazy
- Image optimization
- Debounced search
- Indexed database queries
- Cached API responses

### Metrics
- First load: <2s
- Time to Interactive: <3s
- Lighthouse Score: 90+
- Mobile responsive: 100%
    `
  },
  {
    id: 'api',
    title: 'API Integration',
    icon: Code,
    file: 'src/lib/ai.ts',
    content: `
# 🤖 AI API Integration

## Supported Providers

### Google Gemini (Primary)
- Model: gemini-2.0-flash
- Free tier: Generous limits
- Streaming: Yes
- Speed: Fast

### OpenRouter (Fallback)
- Model: llama-3.2-3b-instruct:free
- Free tier: Available
- Streaming: Yes
- Speed: Moderate

## Implementation

### Provider Selection
\`\`\`typescript
// Tries Gemini first, falls back to OpenRouter
if (VITE_GEMINI_API_KEY) {
  return generateWithGemini()
} else if (VITE_OPENROUTER_API_KEY) {
  return generateWithOpenRouter()
}
\`\`\`

### Streaming Response
\`\`\`typescript
// Real-time text generation
await generatePromptStream(
  userInput,
  category,
  (text) => {
    setGeneratedPrompt(text) // Updates UI in real-time
  }
)
\`\`\`

### Prompt Engineering
\`\`\`typescript
const systemPrompt = \`
You are an expert AI prompt engineer.

Guidelines:
- Make it clear, specific, actionable
- Include relevant context
- Optimize for {category}
- 50-300 words
- Output ONLY the prompt

User's request: {userInput}
\`
\`\`\`

## API Keys

### Google Gemini
1. Visit: https://makersuite.google.com/app/apikey
2. Create new API key
3. Add to \`.env\`: \`VITE_GEMINI_API_KEY=xxx\`

### OpenRouter
1. Visit: https://openrouter.ai/keys
2. Create new API key
3. Add to \`.env\`: \`VITE_OPENROUTER_API_KEY=xxx\`

## Rate Limits

### Gemini Free Tier
- 60 requests per minute
- 1500 requests per day
- Generous token limits

### OpenRouter Free Models
- Varies by model
- Usually 20 requests per minute
- Check specific model limits

## Error Handling
\`\`\`typescript
try {
  await generatePromptStream()
} catch (err) {
  // Show user-friendly error
  toast.error('Failed to generate prompt')
  // Log for debugging
  console.error(err)
}
\`\`\`

## Best Practices
✅ Always provide fallback
✅ Handle network errors
✅ Show loading states
✅ Implement retry logic
✅ Cache responses when possible
✅ Monitor API usage
    `
  },
  {
    id: 'deployment',
    title: 'Deployment Guide',
    icon: GitBranch,
    file: 'README.md',
    content: `
# 🚀 Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository
- Vercel account
- Environment variables ready

### Steps

1. **Push to GitHub**
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

2. **Import to Vercel**
- Visit vercel.com
- New Project
- Import from GitHub
- Select repository

3. **Configure Build**
- Framework: Vite
- Build Command: \`npm run build\`
- Output Directory: \`dist\`
- Install Command: \`npm install\`

4. **Environment Variables**
Add in Vercel dashboard:
\`\`\`env
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
VITE_GEMINI_API_KEY=xxx
\`\`\`

5. **Deploy**
- Click Deploy
- Wait for build
- Visit production URL

### Custom Domain
1. Domains tab in Vercel
2. Add domain
3. Configure DNS
4. Wait for SSL

## Netlify Deployment

### Steps
1. Build locally: \`npm run build\`
2. Drag \`dist\` folder to Netlify
3. Configure environment variables
4. Deploy

### netlify.toml
\`\`\`toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
\`\`\`

## Production Checklist

### Before Deploy
- [ ] Test all features
- [ ] Check environment variables
- [ ] Verify API keys
- [ ] Test authentication flow
- [ ] Check responsive design
- [ ] Run build locally
- [ ] Fix all TypeScript errors

### After Deploy
- [ ] Test production URL
- [ ] Verify API connections
- [ ] Check Supabase connection
- [ ] Test signup/login
- [ ] Generate test prompt
- [ ] Check console for errors
- [ ] Configure custom domain
- [ ] Enable SSL

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Monitor API usage
- [ ] Check database metrics
- [ ] Track user analytics

## Environment Variables

### Required
\`\`\`env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
\`\`\`

### Optional (at least one required)
\`\`\`env
VITE_GEMINI_API_KEY=<gemini-key>
VITE_OPENROUTER_API_KEY=<openrouter-key>
\`\`\`

## Performance Optimization

### Build
- Tree shaking enabled
- Code splitting
- Minification
- Compression (gzip/brotli)

### Assets
- Image optimization
- Lazy loading
- CDN for static files
- Caching headers

### Runtime
- Debounced search
- Optimistic UI updates
- Request deduplication
- Efficient re-renders
    `
  }
]

export default function DocsPage() {
  const { theme } = useTheme()
  const [selectedSection, setSelectedSection] = useState(DOC_SECTIONS[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Track scroll position for "scroll to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredSections = DOC_SECTIONS.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentIndex = DOC_SECTIONS.findIndex(s => s.id === selectedSection.id)
  const previousSection = currentIndex > 0 ? DOC_SECTIONS[currentIndex - 1] : null
  const nextSection = currentIndex < DOC_SECTIONS.length - 1 ? DOC_SECTIONS[currentIndex + 1] : null

  const handleSectionChange = (section: DocSection) => {
    setSelectedSection(section)
    setShowMobileSidebar(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Extract headings from content for table of contents
  const extractHeadings = (content: string) => {
    const headingRegex = /^(#{2,3}) (.+)$/gm
    const headings: { level: number; text: string; id: string }[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      headings.push({ level, text, id })
    }

    return headings
  }

  const tableOfContents = extractHeadings(selectedSection.content)

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className={`lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl ${
            theme === 'dark'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-600 text-white'
          }`}
        >
          {showMobileSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className={`fixed bottom-6 left-6 z-50 p-3 rounded-full shadow-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                  : 'bg-white text-neutral-900 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-10 h-10 text-purple-500" />
            <div>
              <h1 className={`text-4xl md:text-5xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}>
                Documentation
              </h1>
              <p className={`text-base md:text-lg mt-1 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Complete guide to Vibe Prompting
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className={`w-full pl-12 pr-6 py-4 rounded-xl border outline-none transition-all ${
                theme === 'dark'
                  ? 'bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
              }`}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Desktop & Mobile Overlay */}
          <AnimatePresence>
            {(showMobileSidebar || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`lg:col-span-3 ${
                  showMobileSidebar 
                    ? 'fixed inset-0 z-40 lg:relative lg:inset-auto'
                    : 'hidden lg:block'
                }`}
              >
                {/* Mobile Overlay Background */}
                {showMobileSidebar && (
                  <div 
                    className="absolute inset-0 bg-black/50 lg:hidden"
                    onClick={() => setShowMobileSidebar(false)}
                  />
                )}

                <div className={`relative ${showMobileSidebar ? 'w-80 h-full overflow-y-auto' : ''} lg:sticky lg:top-24`}>
                  <div className={`rounded-xl p-6 border h-full lg:h-auto ${
                    theme === 'dark'
                      ? 'bg-neutral-900/95 backdrop-blur-sm border-neutral-800'
                      : 'bg-white border-neutral-200'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-sm font-bold tracking-wide ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        CONTENTS
                      </h3>
                      {showMobileSidebar && (
                        <button
                          onClick={() => setShowMobileSidebar(false)}
                          className="lg:hidden"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <nav className="space-y-1">
                      {filteredSections.map((section) => {
                        const Icon = section.icon
                        const isActive = selectedSection.id === section.id
                        
                        return (
                          <motion.button
                            key={section.id}
                            whileHover={{ x: 4 }}
                            onClick={() => handleSectionChange(section)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left group ${
                              isActive
                                ? theme === 'dark'
                                  ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500'
                                  : 'bg-purple-50 text-purple-700 border-l-2 border-purple-600'
                                : theme === 'dark'
                                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${
                              isActive ? 'text-purple-500' : ''
                            }`} />
                            <span className="text-sm font-medium flex-1">{section.title}</span>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                          </motion.button>
                        )
                      })}
                    </nav>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.article
                key={selectedSection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Breadcrumb */}
                <div className={`flex items-center gap-2 mb-6 text-sm ${
                  theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  <Home className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                  <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>
                    {selectedSection.title}
                  </span>
                </div>

                {/* Content Card */}
                <div className={`rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-neutral-900/50 border-neutral-800'
                    : 'bg-white border-neutral-200'
                }`}>
                  {/* Header */}
                  <div className={`p-6 md:p-8 border-b ${
                    theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      {(() => {
                        const Icon = selectedSection.icon
                        return (
                          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        )
                      })()}
                      <div className="flex-1">
                        <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
                          theme === 'dark' ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {selectedSection.title}
                        </h2>
                        <div className="flex items-center gap-2">
                          <FileText className={`w-4 h-4 ${
                            theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                          }`} />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                          }`}>
                            Source: {selectedSection.file}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Table of Contents */}
                    {tableOfContents.length > 0 && (
                      <div className={`mt-6 pt-6 border-t ${
                        theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
                      }`}>
                        <h3 className={`text-sm font-bold mb-3 ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                        }`}>
                          ON THIS PAGE
                        </h3>
                        <ul className="space-y-2">
                          {tableOfContents.map((heading, index) => (
                            <li 
                              key={index}
                              className={`${heading.level === 3 ? 'ml-4' : ''}`}
                            >
                              <a
                                href={`#${heading.id}`}
                                className={`text-sm hover:underline transition-colors ${
                                  theme === 'dark'
                                    ? 'text-neutral-400 hover:text-purple-400'
                                    : 'text-neutral-600 hover:text-purple-600'
                                }`}
                              >
                                {heading.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div 
                      className={theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}
                      style={{ 
                        fontSize: '16px',
                        lineHeight: '1.8',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: selectedSection.content
                          // Code blocks with terminal UI
                          .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                            const language = lang || 'text'
                            return `
                              <div style="margin: 24px 0; border-radius: 8px; overflow: hidden; border: 1px solid ${theme === 'dark' ? '#404040' : '#e5e5e5'}; background: ${theme === 'dark' ? '#1a1a1a' : '#fafafa'};">
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: ${theme === 'dark' ? '#262626' : '#f0f0f0'}; border-bottom: 1px solid ${theme === 'dark' ? '#404040' : '#e5e5e5'};">
                                  <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="display: flex; gap: 6px;">
                                      <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></div>
                                      <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></div>
                                      <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div>
                                    </div>
                                    <span style="font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; color: ${theme === 'dark' ? '#999' : '#666'};">${language}</span>
                                  </div>
                                </div>
                                <pre style="margin: 0; padding: 16px; overflow-x: auto;"><code style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; line-height: 1.6; color: ${theme === 'dark' ? '#e0e0e0' : '#333'};">${code.trim()}</code></pre>
                              </div>
                            `
                          })
                          // Inline code
                          .replace(/`([^`]+)`/g, `<code style="background: ${theme === 'dark' ? '#2d1b69' : '#f3f0ff'}; color: ${theme === 'dark' ? '#c4b5fd' : '#7c3aed'}; padding: 2px 6px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 14px;">\$1</code>`)
                          // Headings
                          .replace(/^### (.+)$/gm, `<h3 style="font-size: 20px; font-weight: 700; margin-top: 48px; margin-bottom: 16px; color: ${theme === 'dark' ? '#fff' : '#171717'};">\$1</h3>`)
                          .replace(/^## (.+)$/gm, `<h2 style="font-size: 24px; font-weight: 700; margin-top: 56px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid ${theme === 'dark' ? '#404040' : '#e5e5e5'}; color: ${theme === 'dark' ? '#fff' : '#171717'};">\$1</h2>`)
                          .replace(/^# (.+)$/gm, `<h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px; color: ${theme === 'dark' ? '#fff' : '#171717'};">\$1</h1>`)
                          // Bold
                          .replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight: 600; color: ${theme === 'dark' ? '#fff' : '#171717'};">\$1</strong>`)
                          // Lists
                          .replace(/^- (.+)$/gm, `<li style="margin: 8px 0; margin-left: 24px; line-height: 1.8;">\$1</li>`)
                          // Checkboxes
                          .replace(/- \[ \] (.+)/g, `<div style="display: flex; gap: 12px; margin: 8px 0;"><input type="checkbox" disabled style="margin-top: 4px;" /><span>\$1</span></div>`)
                          .replace(/- \[x\] (.+)/g, `<div style="display: flex; gap: 12px; margin: 8px 0;"><input type="checkbox" checked disabled style="margin-top: 4px;" /><span style="text-decoration: line-through; opacity: 0.6;">\$1</span></div>`)
                          // Horizontal rule
                          .replace(/^---$/gm, `<hr style="margin: 48px 0; border: none; height: 1px; background: ${theme === 'dark' ? '#404040' : '#e5e5e5'};" />`)
                          // Paragraphs - add spacing
                          .replace(/\n\n/g, '<br/><br/>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  </div>

                  {/* Footer with Prev/Next */}
                  <div className={`p-6 md:p-8 border-t ${
                    theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
                  }`}>
                    {/* Metadata */}
                    <div className={`flex flex-wrap items-center gap-4 mb-6 pb-6 border-b text-sm ${
                      theme === 'dark' ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-400'
                    }`}>
                      <span>Last updated: {new Date().toLocaleDateString()}</span>
                      <span>•</span>
                      <a
                        href={`https://github.com/yourusername/vibe-prompting/blob/main/${selectedSection.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 font-medium transition-colors ${
                          theme === 'dark'
                            ? 'text-purple-400 hover:text-purple-300'
                            : 'text-purple-600 hover:text-purple-700'
                        }`}
                      >
                        Edit on GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Previous / Next Navigation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Previous */}
                      {previousSection ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSectionChange(previousSection)}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            theme === 'dark'
                              ? 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
                              : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className={`flex items-center gap-2 text-sm mb-1 ${
                            theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                          }`}>
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </div>
                          <div className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-neutral-900'
                          }`}>
                            {previousSection.title}
                          </div>
                        </motion.button>
                      ) : (
                        <div />
                      )}

                      {/* Next */}
                      {nextSection && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSectionChange(nextSection)}
                          className={`p-4 rounded-lg border transition-all text-right ${
                            theme === 'dark'
                              ? 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
                              : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className={`flex items-center justify-end gap-2 text-sm mb-1 ${
                            theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                          }`}>
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                          <div className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-neutral-900'
                          }`}>
                            {nextSection.title}
                          </div>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
