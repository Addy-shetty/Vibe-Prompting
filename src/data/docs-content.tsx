export const DOCS_SECTIONS = [
  {
    id: 'overview',
    title: 'Project Overview',
    content: (
      <div
        className="text-[#A1A1AA]"
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
        dangerouslySetInnerHTML={{
          __html: `
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
            // Code blocks with terminal UI
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
              const language = lang || 'text'
              return `
                <div style="margin: 24px 0; border-radius: 12px; overflow: hidden; border: 2px solid #333; background: #1a1a1a; box-shadow: 4px 4px 0px 0px #000;">
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #0a0a0a; border-bottom: 2px solid #333;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="display: flex; gap: 6px;">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; border: 1px solid #000;"></div>
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; border: 1px solid #000;"></div>
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f; border: 1px solid #000;"></div>
                      </div>
                      <span style="font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; font-weight: bold; color: #FFD700;">${language}</span>
                    </div>
                  </div>
                  <pre style="margin: 0; padding: 16px; overflow-x: auto;"><code style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; line-height: 1.6; color: #e0e0e0;">${code.trim()}</code></pre>
                </div>
              `
            })
            // Inline code
            .replace(/`([^`]+)`/g, `<code style="background: #2d1b69; color: #c4b5fd; padding: 2px 6px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 14px; border: 1px solid #4c1d95; font-weight: bold;">$1</code>`)
            // Headings
            .replace(/^### (.+)$/gm, `<h3 style="font-size: 20px; font-weight: 800; margin-top: 48px; margin-bottom: 16px; color: #fff;">$1</h3>`)
            .replace(/^## (.+)$/gm, `<h2 style="font-size: 24px; font-weight: 900; margin-top: 56px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #404040; color: #fff;">$1</h2>`)
            .replace(/^# (.+)$/gm, `<h1 style="font-size: 32px; font-weight: 900; margin-bottom: 32px; color: #fff;">$1</h1>`)
            // Bold
            .replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight: 800; color: #fff;">$1</strong>`)
            // Lists
            .replace(/^- (.+)$/gm, `<li style="margin: 8px 0; margin-left: 24px; line-height: 1.8; font-weight: 500;">$1</li>`)
            // Checkboxes
            .replace(/- \[ \] (.+)/g, `<div style="display: flex; gap: 12px; margin: 8px 0;"><input type="checkbox" disabled style="margin-top: 4px; border: 2px solid #000;" /><span>$1</span></div>`)
            .replace(/- \[x\] (.+)/g, `<div style="display: flex; gap: 12px; margin: 8px 0;"><input type="checkbox" checked disabled style="margin-top: 4px; border: 2px solid #000;" /><span style="text-decoration: line-through; opacity: 0.6;">$1</span></div>`)
            // Horizontal rule
            .replace(/^---$/gm, `<hr style="margin: 48px 0; border: none; height: 2px; background: #404040;" />`)
            // Paragraphs - add spacing
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>')
        }}
      />
    )
  },
  {
    id: 'setup',
    title: 'Setup & Installation',
    content: (
      <div
        className="text-[#A1A1AA]"
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
        dangerouslySetInnerHTML={{
          __html: `
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
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
              const language = lang || 'text'
              return `
                <div style="margin: 24px 0; border-radius: 12px; overflow: hidden; border: 2px solid #333; background: #1a1a1a; box-shadow: 4px 4px 0px 0px #000;">
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #0a0a0a; border-bottom: 2px solid #333;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="display: flex; gap: 6px;">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; border: 1px solid #000;"></div>
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; border: 1px solid #000;"></div>
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f; border: 1px solid #000;"></div>
                      </div>
                      <span style="font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; font-weight: bold; color: #FFD700;">${language}</span>
                    </div>
                  </div>
                  <pre style="margin: 0; padding: 16px; overflow-x: auto;"><code style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; line-height: 1.6; color: #e0e0e0;">${code.trim()}</code></pre>
                </div>
              `
            })
            .replace(/`([^`]+)`/g, `<code style="background: #2d1b69; color: #c4b5fd; padding: 2px 6px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 14px; border: 1px solid #4c1d95; font-weight: bold;">$1</code>`)
            .replace(/^### (.+)$/gm, `<h3 style="font-size: 20px; font-weight: 800; margin-top: 48px; margin-bottom: 16px; color: #fff;">$1</h3>`)
            .replace(/^## (.+)$/gm, `<h2 style="font-size: 24px; font-weight: 900; margin-top: 56px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #404040; color: #fff;">$1</h2>`)
            .replace(/^# (.+)$/gm, `<h1 style="font-size: 32px; font-weight: 900; margin-bottom: 32px; color: #fff;">$1</h1>`)
            .replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight: 800; color: #fff;">$1</strong>`)
            .replace(/^- (.+)$/gm, `<li style="margin: 8px 0; margin-left: 24px; line-height: 1.8; font-weight: 500;">$1</li>`)
            .replace(/- \[ \] (.+)/g, `<div style="display: flex; gap: 12px; margin: 8px 0;"><input type="checkbox" disabled style="margin-top: 4px; border: 2px solid #000;" /><span>$1</span></div>`)
            .replace(/- \[x\] (.+)/g, `<div style="display: flex; gap: 12px; margin: 8px 0;"><input type="checkbox" checked disabled style="margin-top: 4px; border: 2px solid #000;" /><span style="text-decoration: line-through; opacity: 0.6;">$1</span></div>`)
            .replace(/^---$/gm, `<hr style="margin: 48px 0; border: none; height: 2px; background: #404040;" />`)
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>')
        }}
      />
    )
  },
  // Continue with remaining sections...
]
