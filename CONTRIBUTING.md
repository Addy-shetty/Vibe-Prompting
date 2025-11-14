# Contributing to Vibe Prompting

First off, thank you for considering contributing to Vibe Prompting! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When you create a bug report, include:
- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:
- **Clear use case**
- **Expected behavior**
- **Current limitations**
- **Possible implementation** (optional)

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Simple issues perfect for beginners
- `help wanted` - Issues where we need community help

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account
- Google Gemini API key or OpenRouter API key

### Setup Steps

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/Vibe-Prompting.git
cd Vibe-Prompting
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. **Set up Supabase**
```bash
npx supabase db reset
```

5. **Start development server**
```bash
npm run dev
```

### Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── styles/           # Global styles

supabase/
└── migrations/       # Database migrations
```

## 🔄 Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Follow our [coding standards](#coding-standards)
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
```bash
npm run build
npm run preview
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add amazing feature"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request**
   - Use a clear title
   - Describe your changes
   - Reference related issues
   - Add screenshots for UI changes

### Pull Request Requirements

- ✅ Code follows project conventions
- ✅ No TypeScript errors
- ✅ No console warnings
- ✅ All features work as expected
- ✅ Documentation updated (if needed)
- ✅ Responsive design maintained

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper types
- Use interfaces for object shapes
- Export types with code

```typescript
// Good
interface User {
  id: string
  email: string
  username: string
}

// Bad
const user: any = {...}
```

### React Components

- Use functional components with hooks
- Use TypeScript for props
- Keep components small and focused
- Extract reusable logic into hooks

```typescript
// Good
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme
- Maintain dark/light theme support
- Use responsive classes (sm:, md:, lg:)

```tsx
// Good
<div className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors">
  Button
</div>
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `GeneratePromptPage.tsx`)
- Hooks: `camelCase.ts` (e.g., `useCredits.ts`)
- Utils: `camelCase.ts` (e.g., `security.ts`)
- Types: `PascalCase.ts` (e.g., `User.ts`)

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add password reset functionality

Add password reset feature using Supabase Auth.
Includes email sending and password update flow.

Closes #123

---

fix(ui): resolve mobile menu overflow issue

Fixed sidebar overflow on mobile devices by adding
proper overflow handling and z-index.

---

docs: update README with deployment instructions
```

## 🧪 Testing

- Test all user flows before submitting PR
- Check responsive design on mobile
- Test both dark and light themes
- Verify all forms and validations
- Test error states

## 📚 Documentation

When adding new features:
- Update README.md if needed
- Add JSDoc comments for functions
- Update relevant .md files in docs/
- Include code examples

## 🎨 Design Guidelines

- Maintain consistent spacing (use Tailwind units)
- Follow existing color palette
- Use Framer Motion for animations
- Ensure accessibility (ARIA labels, keyboard navigation)
- Support dark/light themes

## 🐛 Debugging

- Use browser DevTools
- Check Supabase logs
- Review network requests
- Test with different user states (logged in/out)

## 📞 Need Help?

- 💬 Open a [GitHub Discussion](https://github.com/Addy-shetty/Vibe-Prompting/discussions)
- 🐛 Report bugs via [GitHub Issues](https://github.com/Addy-shetty/Vibe-Prompting/issues)
- 📧 Email: Harshithms@gmail.com

## 🌟 Recognition

All contributors will be recognized in our README and release notes!

---

Thank you for contributing to Vibe Prompting! 🚀

**Happy Coding!** 💜
