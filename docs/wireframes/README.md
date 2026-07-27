# Vibe Prompting - Wireframes Documentation

## Overview
This folder contains low-fidelity wireframes for the Vibe Prompting application. Each wireframe includes ASCII diagrams, SVG visualizations, component breakdowns, user actions, and Tech Noir theme specifications.

---

## Wireframe Files

### 1. [01-landing-page.md](./01-landing-page.md)
**Purpose:** First impression page explaining the product

**Key Sections:**
- Hero with animated particles
- How It Works (4-step process)
- Features grid
- Live demo section
- Testimonials carousel
- CTA sections
- Footer

**Components:** 8 major sections
**Status:** ✅ Ready for implementation

---

### 2. [02-login-page.md](./02-login-page.md)
**Purpose:** Secure login interface with OAuth

**Key Sections:**
- Email/Password form
- Real-time validation
- Password show/hide toggle
- OAuth buttons (Google, GitHub)
- Forgot password link
- Sign up CTA

**Features:**
- Error states
- Loading states
- Rate limiting display
- Mobile responsive

**Status:** ✅ Ready for implementation

---

### 3. [03-signup-page.md](./03-signup-page.md)
**Purpose:** User registration with password strength

**Key Sections:**
- Username input with availability check
- Email validation
- Password with strength indicator
- Confirm password matching
- Terms checkbox
- OAuth alternatives

**Features:**
- Password strength algorithm (0-100%)
- Real-time requirements checklist
- Username availability animation
- Mobile responsive

**Status:** ✅ Ready for implementation

---

### 4. [04-dashboard.md](./04-dashboard.md)
**Purpose:** User hub with stats and quick actions

**Key Sections:**
- Welcome banner with credit display
- Quick stats cards (3 cards)
- Quick actions bar
- Recent activity list
- Usage statistics (4 metrics)
- Recommended prompts

**Features:**
- Real-time credit updates
- Activity timeline
- Statistics visualization
- Sidebar navigation

**Status:** ✅ Ready for implementation

---

### 5. [05-generate-prompt.md](./05-generate-prompt.md)
**Purpose:** Core feature - AI prompt generation

**Key Sections:**
- Multi-step input form
- Tier selector (Basic/Advanced/Expert)
- Cost calculation display
- Terminal-style result output
- Action buttons (Copy, Save, Refine)

**Features:**
- Character counter
- Streaming text generation
- Typewriter effect
- Markdown rendering
- Generation states (idle → loading → complete)

**Status:** ✅ Ready for implementation

---

### 6. [06-my-prompts.md](./06-my-prompts.md)
**Purpose:** User's saved prompt library

**Key Sections:**
- Search and filter bar
- Grid/List view toggle
- Prompt cards with preview
- Tags display
- Action buttons (View, Copy, Edit, Delete)
- Pagination
- Empty state

**Features:**
- Real-time search
- Category filtering
- Sort options
- Modals (View, Edit, Delete confirmation)
- Tag filtering

**Status:** ✅ Ready for implementation

---

### 7. [07-pricing-page.md](./07-pricing-page.md)
**Purpose:** Credit purchase and subscription plans

**Key Sections:**
- Hero with trust badges
- Current balance display
- 3-tier pricing cards
  - Starter: $4.99 (50 credits)
  - Pro: $12.99 (150 credits) - Most Popular
  - Ultimate: $34.99 (500 credits)
- Enterprise section
- Credit system explanation
- FAQ accordion
- Trust indicators

**Features:**
- Payment modal flow
- Cost per credit calculation
- Feature comparison
- Money-back guarantee

**Status:** ✅ Ready for implementation

---

### 8. [08-docs-help.md](./08-docs-help.md)
**Purpose:** Documentation with improved structure (fixes negative space issues)

**Key Sections:**
- Search bar
- Tabbed navigation (6 tabs)
- Quick start checklist
- Feature grid (3x2)
- How It Works visual flow
- Collapsible sections (6 topics)
- Quick links grid
- Help CTA

**Improvements from current docs:**
- Tabbed interface instead of sidebar
- Collapsible content sections
- Better content density
- Gamified checklist
- Feature highlights
- Mobile-optimized layout

**Status:** ✅ Ready for implementation

---

## Common Theme Specifications

### Colors
```css
--bg-primary: #0A0A0A      /* Main background */
--bg-secondary: #1A1A1A    /* Card background */
--accent-yellow: #FFD700   /* Primary accent */
--accent-purple: #A855F7   /* Secondary accent */
--text-primary: #FFFFFF    /* Headings */
--text-secondary: #A1A1AA  /* Body text */
--border-default: #333333  /* Default borders */
--border-focus: #FFD700    /* Focus states */
--success: #22C55E         /* Success states */
--error: #EF4444           /* Error states */
```

### Typography
- **Headings:** JetBrains Mono / Orbitron (bold, uppercase)
- **Body:** Inter (clean, readable)
- **Code:** JetBrains Mono

### Effects
- Neubrutalist shadows (4px, 4px offset)
- Yellow glow on focus
- Lift animation on hover
- Glitch text effects (hero only)

---

## File Structure

```
docs/wireframes/
├── README.md                    # This file
├── 01-landing-page.md          # Landing page wireframe
├── 02-login-page.md            # Login page wireframe
├── 03-signup-page.md           # Signup page wireframe
├── 04-dashboard.md             # Dashboard wireframe
├── 05-generate-prompt.md       # Generate prompt wireframe
├── 06-my-prompts.md            # My prompts wireframe
├── 07-pricing-page.md          # Pricing page wireframe
├── 08-docs-help.md             # Documentation wireframe
└── assets/                     # Wireframe images (if needed)
```

---

## Implementation Priority

### Phase 1: Core Flow
1. Landing Page (01)
2. Login Page (02)
3. Signup Page (03)
4. Dashboard (04)

### Phase 2: Main Features
5. Generate Prompt (05)
6. My Prompts (06)

### Phase 3: Supporting Pages
7. Pricing Page (07)
8. Docs/Help (08)

---

## Notes

- All wireframes use the **Tech Noir** theme
- Mobile responsive specifications included
- SVG visualizations provided for each page
- Component breakdowns with CSS snippets
- User action flows documented
- Error states and loading states covered

---

*Created: 2024*
*Theme: Tech Noir*
*Status: All wireframes complete and ready for implementation*
