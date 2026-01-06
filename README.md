# 🎨 Vibe Prompting

<div align="center">

**AI-Powered Prompt Generator**

Transform your ideas into powerful, detailed AI prompts. Built with React, TypeScript, and Google Gemini 2.0 Flash.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://vibe-prompting.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

[🚀 Live Demo](https://vibe-prompting.vercel.app/) • [📖 Docs](#documentation) • [🤝 Contributing](./CONTRIBUTING.md)

</div>

---

## ✨ Features

- 🤖 **AI Prompt Generation** - Powered by Google Gemini 2.0 Flash
- 🎯 **Three Tiers** - Basic (5 credits), Advanced (3 credits), Expert (2 credits)
- 🎁 **10 Free Credits** - On signup for new users
- 🔐 **Secure Auth** - Email/password, Google & GitHub OAuth
- 🎨 **Neo-Brutalist UI** - Dark/light theme with smooth animations
- 📋 **One-Click Copy** - Copy prompts instantly
- 📱 **Responsive** - Works on desktop, tablet & mobile

---

## 🛠️ Tech Stack

| Frontend | Backend | AI |
|----------|---------|-----|
| React 18.3 | Supabase | Google Gemini 2.0 Flash |
| TypeScript 5.5 | PostgreSQL | OpenRouter (fallback) |
| Vite 7.2 | Row Level Security | |
| Tailwind CSS 3.4 | Edge Functions | |
| Framer Motion | | |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Google AI API key

### Installation

```bash
# Clone the repo
git clone https://github.com/Addy-shetty/Vibe-Prompting.git
cd Vibe-Prompting

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your API keys

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## 📁 Project Structure

```
src/
├── components/     # UI components
├── context/        # React context (Auth, Theme)
├── hooks/          # Custom hooks
├── lib/            # API, utilities
├── pages/          # Route pages
└── styles/         # Global styles

supabase/
├── functions/      # Edge Functions
└── migrations/     # Database schema
```

---

## 🎮 How to Use

1. **Sign up** with email or OAuth (Google/GitHub)
2. **Get 10 free credits** on registration
3. **Enter your idea** in the prompt input
4. **Select a tier**:
   - **Basic** (5 credits) - Simple enhancement
   - **Advanced** (3 credits) - Detailed with examples
   - **Expert** (2 credits) - Production-ready prompt
5. **Generate** and copy your enhanced prompt

---

## 📖 Documentation

- [Supabase Setup](./docs/SUPABASE_SETUP.md)
- [Auth Guide](./docs/AUTH_GUIDE.md)
- [Threat Model](./docs/THREAT_MODEL.md)

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git commit -m "Add your feature"

# Push and create PR
git push origin feature/your-feature
```

---

## 📝 License

MIT License - see [LICENSE](./LICENSE)

---

## 📧 Contact

**Addy Shetty** - [@Addy-shetty](https://github.com/Addy-shetty)

Project Link: [https://github.com/Addy-shetty/Vibe-Prompting](https://github.com/Addy-shetty/Vibe-Prompting)

---

<div align="center">
Made with ❤️ by Addy Shetty
</div>
