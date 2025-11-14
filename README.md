# 🎨 Vibe Prompting

<div align="center">

**AI-Powered Prompt Generator with Smart Credit System**

Transform your ideas into powerful AI prompts instantly. Built with React, TypeScript, and Supabase.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

[Demo](#) • [Documentation](./SECURITY.md) • [Report Bug](https://github.com/Addy-shetty/Vibe-Prompting/issues) • [Request Feature](https://github.com/Addy-shetty/Vibe-Prompting/issues)

</div>

---

## ✨ Features

### 🚀 Core Features
- **AI Prompt Generation** - Generate high-quality prompts using Google Gemini 2.0 Flash or OpenRouter Llama 3.2
- **Smart Categories** - 14 specialized categories (Frontend, Backend, DevOps, Security, etc.)
- **Tag System** - Organize prompts with up to 5 custom tags per prompt
- **Credit System** - Fair usage with 50 free credits for signed-up users
- **Public Gallery** - Browse and discover community prompts
- **Real-time Streaming** - See your prompts being generated in real-time

### 🎯 User Experience
- **Anonymous Preview** - Try 3 free generations without signup
- **Dark/Light Theme** - Beautiful UI that adapts to your preference
- **Copy to Clipboard** - One-click copying of generated prompts
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **GitHub-style Docs** - Comprehensive documentation with next/prev navigation

### 🔒 Security
- **Row Level Security (RLS)** - Database-level access control
- **IDOR Protection** - Users can only modify their own data
- **Input Validation** - Zod schemas for all inputs
- **XSS Prevention** - Sanitization for all user content
- **Rate Limiting** - Client-side protection against abuse
- **Password Strength** - Requirements enforced with visual feedback

### 📊 Credits System
| User Type | Generations | Prompt Views | Storage |
|-----------|-------------|--------------|---------|
| Anonymous | 3 free | 3 free views | localStorage |
| Signed Up | 50 credits | Unlimited | Database |

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library
- **TypeScript 5.5** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router DOM** - Client-side routing

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Robust database with RLS
- **Edge Functions** - Serverless functions

### AI Integration
- **Google Gemini 2.0 Flash** - Primary AI model
- **OpenRouter (Llama 3.2)** - Fallback option

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+ and npm
Git
Supabase account (free tier)
Google Gemini API key OR OpenRouter API key
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Addy-shetty/Vibe-Prompting.git
cd Vibe-Prompting
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys (Choose one or both)
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

4. **Set up Supabase**

Run migrations in order:
```bash
npx supabase db reset
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
vibe-prompting/
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── context/           # React context
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── styles/            # Global styles
├── supabase/
│   └── migrations/        # Database migrations
├── docs/                  # Documentation
└── public/                # Static assets
```

---

## 📖 Documentation

- **[Security Policy](./SECURITY.md)** - Vulnerability reporting & security measures
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Authentication Guide](./docs/AUTH_GUIDE.md)** - Auth implementation
- **[Credits System](./docs/CREDITS_SYSTEM.md)** - Credit system details
- **[Database Setup](./docs/SUPABASE_SETUP.md)** - Supabase configuration
- **[Security Implementation](./docs/SECURITY_IMPLEMENTATION_FULL.md)** - Complete security guide

---

## 🎮 Usage

### Anonymous Users
1. Visit homepage
2. Click example prompts
3. Generate up to 3 prompts
4. Copy to clipboard
5. Sign up to save permanently

### Registered Users
1. Sign up (get 50 credits)
2. Generate prompts
3. Save with tags
4. Browse gallery
5. Manage your prompts

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- Google Gemini - AI model
- Supabase - Backend infrastructure
- Tailwind CSS - Styling
- Framer Motion - Animations
- React - UI library

---

## 📧 Contact

**Harshith M S (Addy Shetty)**

- GitHub: [@Addy-shetty](https://github.com/Addy-shetty)
- Email: Harshithms@gmail.com

---

<div align="center">

**Made with ❤️ by [Addy Shetty](https://github.com/Addy-shetty)**

⭐ Star this repo if you find it useful!

</div>
