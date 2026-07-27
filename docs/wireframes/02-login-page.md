# Wireframe: Login Page

## Overview
Secure login interface with email/password and OAuth options. Follows Tech Noir aesthetic with clear visual hierarchy.

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]                                      [Back to Home]                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗ │
│  ║                                                                       ║ │
│  ║                    [ANIMATED TILES BACKGROUND]                        ║ │
│  ║                                                                       ║ │
│  ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                                                             │
│                              ┌──────────────────────┐                      │
│                              │                      │                      │
│                              │     ⚡ LOGIN ⚡      │                      │
│                              │                      │                      │
│                              │   Welcome back to   │                      │
│                              │    Vibe Prompting   │                      │
│                              │                      │                      │
│                              ├──────────────────────┤                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │ 📧             │  │                      │
│                              │  │                │  │                      │
│                              │  │ Email Address  │  │                      │
│                              │  │ user@email.com │  │                      │
│                              │  │                │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │ 🔒             │  │                      │
│                              │  │                │  │                      │
│                              │  │ Password       │  │                      │
│                              │  │ ••••••••       │  │                      │
│                              │  │                │  │                      │
│                              │  │ [Show/Hide 👁]  │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              │  [Forgot Password?]  │                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │                │  │                      │
│                              │  │   LOGIN →      │  │                      │
│                              │  │                │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              ├──────────────────────┤                      │
│                              │                      │                      │
│                              │     ─ OR ─          │                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │ [G] Continue   │  │                      │
│                              │  │ with Google    │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │ [⚡] Continue  │  │                      │
│                              │  │ with GitHub    │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              ├──────────────────────┤                      │
│                              │                      │                      │
│                              │  Don't have an      │                      │
│                              │  account? [Sign Up] │                      │
│                              │                      │                      │
│                              └──────────────────────┘                      │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [Footer: © 2024 Vibe Prompting | Terms | Privacy | Support]               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Header
**Elements:**
- Logo (clickable, links to home)
- "Back to Home" text link

**Tech Noir Theme:**
- Minimal header with dark background
- Yellow accent on hover

### 2. Background
**Elements:**
- Animated tiles pattern (reuse existing component)
- Dark overlay for contrast

### 3. Login Card
**Container:**
- Centered on page
- Max width: 420px
- Padding: 40px
- Border: 2px solid
- Border-radius: 16px
- Box-shadow: 8px 8px offset

**Header Section:**
- Icon: Lightning bolt
- Title: "LOGIN" (uppercase, bold)
- Subtitle: "Welcome back to Vibe Prompting"

### 4. Form Fields

#### Email Input
**Elements:**
- Label: "Email Address"
- Icon: Mail/Envelope (left)
- Placeholder: "user@email.com"
- Validation: Real-time email format check

**States:**
- Default: Gray border
- Focus: Yellow border + glow
- Error: Red border + error message
- Valid: Green checkmark

**Tech Noir Styling:**
```css
input {
  background: #0A0A0A;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 16px 16px 16px 48px; /* space for icon */
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
}

input:focus {
  border-color: #FFD700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
  outline: none;
}
```

#### Password Input
**Elements:**
- Label: "Password"
- Icon: Lock (left)
- Toggle: Eye icon (right) for show/hide
- Placeholder: "••••••••"

**Features:**
- Minimum 8 characters
- Real-time validation
- Show/Hide toggle

### 5. Forgot Password Link
**Position:** Right-aligned below password field
**Style:** Yellow text, underline on hover

### 6. Submit Button
**Design:**
- Full width
- Height: 56px
- Background: #FFD700 (Yellow)
- Text: "LOGIN →" (black, bold)
- Border: 2px solid black
- Shadow: 4px 4px offset black
- Border-radius: 8px

**States:**
- Default: Yellow background
- Hover: Slight lift, shadow disappears
- Loading: Spinner animation
- Disabled: Opacity 0.5

**Tech Noir Effect:**
```css
button {
  background: #FFD700;
  color: #0A0A0A;
  border: 2px solid #000;
  box-shadow: 4px 4px 0px 0px #000;
  transition: all 0.2s;
}

button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px #000;
}

button:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px 0px #000;
}
```

### 7. Divider
**Style:**
- Horizontal line with "OR" text
- Line color: #333
- Text color: #666

### 8. OAuth Buttons

#### Google Button
**Design:**
- Full width
- White background
- Google "G" icon (left)
- Text: "Continue with Google"
- Border: 2px solid #333
- Shadow: 4px 4px offset

#### GitHub Button
**Design:**
- Full width
- Dark background (#1A1A1A)
- GitHub icon (left)
- Text: "Continue with GitHub"
- Border: 2px solid #555
- Shadow: 4px 4px offset

### 9. Sign Up CTA
**Text:** "Don't have an account? Sign Up"
**Style:**
- "Sign Up" as yellow link
- Centered alignment

### 10. Footer
**Elements:**
- Copyright text
- Links: Terms, Privacy, Support
- Minimal styling

---

## User Actions

| Action | Trigger | Result | Validation |
|--------|---------|--------|------------|
| Enter Email | Type in field | Real-time format check | Must be valid email |
| Enter Password | Type in field | Show/hide toggle works | Min 8 chars |
| Toggle Password | Click eye icon | Show/hide password | - |
| Submit Login | Click Login button | API call to Supabase | Check credentials |
| OAuth Google | Click Google button | Redirect to Google OAuth | - |
| OAuth GitHub | Click GitHub button | Redirect to GitHub OAuth | - |
| Forgot Password | Click link | Navigate to reset page | - |
| Sign Up | Click link | Navigate to signup page | - |
| Back to Home | Click logo/link | Navigate to landing | - |

---

## Error States

### Email Errors:
```
┌────────────────────────────────┐
│ 📧                           X │  ← Red X icon for invalid
│                                │
│ Email Address                  │
│ invalid@email                  │
│                                │
│ ⚠ Please enter a valid email   │  ← Red error message
└────────────────────────────────┘
```

### Password Errors:
```
┌────────────────────────────────┐
│ 🔒                           👁 │
│                                │
│ Password                       │
│ short                          │
│                                │
│ ⚠ Password must be 8+ chars   │  ← Red error message
└────────────────────────────────┘
```

### API Errors:
- Display in red alert box above form
- "Invalid email or password"
- "Account not found"
- "Please verify your email first"

---

## Mobile Responsive Notes

### Breakpoints:
- **Desktop (>768px):** Card centered, max-width 420px
- **Mobile (<768px):**
  - Card full width with 16px margin
  - Padding reduced to 24px
  - Larger touch targets (min 48px)
  - OAuth buttons stacked

### Mobile Adjustments:
```
┌──────────────────────────┐
│ [LOGO]        [Close X] │
├──────────────────────────┤
│                          │
│      ⚡ LOGIN ⚡        │
│   Welcome back...       │
│                          │
│  ┌──────────────────┐   │
│  │ 📧 Email         │   │
│  │ user@email.com   │   │
│  └──────────────────┘   │
│                          │
│  ┌──────────────────┐   │
│  │ 🔒 Password   👁  │   │
│  │ ••••••••         │   │
│  └──────────────────┘   │
│                          │
│         [Forgot?]        │
│                          │
│  ┌──────────────────┐   │
│  │    LOGIN →       │   │
│  └──────────────────┘   │
│                          │
│        ─ OR ─           │
│                          │
│  ┌──────────────────┐   │
│  │ Continue Google  │   │
│  └──────────────────┘   │
│                          │
│  ┌──────────────────┐   │
│  │ Continue GitHub  │   │
│  └──────────────────┘   │
│                          │
│  No account? [Sign Up]   │
│                          │
└──────────────────────────┘
```

---

## Tech Noir Theme References

### Color Palette:
```css
:root {
  --bg-primary: #0A0A0A;
  --bg-secondary: #1A1A1A;
  --bg-input: #0A0A0A;
  --border-default: #333333;
  --border-focus: #FFD700;
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-muted: #666666;
  --accent-yellow: #FFD700;
  --accent-purple: #A855F7;
  --error: #EF4444;
  --success: #22C55E;
}
```

### Typography:
- **Title:** JetBrains Mono, 32px, bold, uppercase
- **Subtitle:** Inter, 16px, regular
- **Labels:** Inter, 14px, medium, uppercase
- **Input:** Inter, 16px, regular
- **Button:** Inter, 16px, bold, uppercase

### Effects:
- **Focus Glow:** `box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2)`
- **Card Shadow:** `box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1)`
- **Button Shadow:** `box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1)`
- **Hover Lift:** `transform: translate(-2px, -2px)`

---

## SVG Wireframe

```svg
<svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="900" fill="#0A0A0A"/>
  
  <!-- Animated Tiles Background (simplified) -->
  <g opacity="0.1">
    <rect x="50" y="50" width="100" height="100" fill="none" stroke="#FFD700" stroke-width="1"/>
    <rect x="170" y="50" width="100" height="100" fill="none" stroke="#A855F7" stroke-width="1"/>
    <rect x="290" y="50" width="100" height="100" fill="none" stroke="#FFD700" stroke-width="1"/>
    <rect x="410" y="50" width="100" height="100" fill="none" stroke="#A855F7" stroke-width="1"/>
    <rect x="530" y="50" width="100" height="100" fill="none" stroke="#FFD700" stroke-width="1"/>
    <rect x="650" y="50" width="100" height="100" fill="none" stroke="#A855F7" stroke-width="1"/>
  </g>
  
  <!-- Header -->
  <text x="40" y="40" fill="#FFD700" font-family="monospace" font-size="20" font-weight="bold">⚡ VIBE</text>
  <text x="640" y="40" fill="#A1A1AA" font-family="sans-serif" font-size="14">Back to Home →</text>
  
  <!-- Login Card -->
  <rect x="190" y="120" width="420" height="620" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="16"/>
  <rect x="190" y="120" width="420" height="620" fill="none" stroke="#FFD700" stroke-width="2" rx="16" opacity="0.3"/>
  
  <!-- Card Header -->
  <text x="400" y="180" fill="#FFD700" font-family="monospace" font-size="28" font-weight="bold" text-anchor="middle">⚡ LOGIN ⚡</text>
  <text x="400" y="215" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">Welcome back to Vibe Prompting</text>
  
  <!-- Divider -->
  <line x1="230" y1="240" x2="570" y2="240" stroke="#333" stroke-width="1"/>
  
  <!-- Email Input -->
  <text x="230" y="280" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="500">Email Address</text>
  <rect x="230" y="295" width="340" height="56" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="250" y="330" fill="#666" font-family="sans-serif" font-size="16">📧 user@email.com</text>
  
  <!-- Password Input -->
  <text x="230" y="385" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="500">Password</text>
  <rect x="230" y="400" width="340" height="56" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="250" y="435" fill="#666" font-family="sans-serif" font-size="16">🔒 ••••••••</text>
  <text x="540" y="435" fill="#A1A1AA" font-family="sans-serif" font-size="14">👁</text>
  
  <!-- Forgot Password -->
  <text x="480" y="480" fill="#FFD700" font-family="sans-serif" font-size="12" text-decoration="underline">Forgot Password?</text>
  
  <!-- Login Button -->
  <rect x="230" y="510" width="340" height="56" fill="#FFD700" stroke="#000" stroke-width="2" rx="8"/>
  <rect x="234" y="514" width="340" height="56" fill="none" stroke="#000" stroke-width="2" rx="8"/>
  <text x="400" y="545" fill="#0A0A0A" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">LOGIN →</text>
  
  <!-- OR Divider -->
  <line x1="230" y1="600" x2="340" y2="600" stroke="#333" stroke-width="1"/>
  <text x="400" y="605" fill="#666" font-family="sans-serif" font-size="12" text-anchor="middle">OR</text>
  <line x1="460" y1="600" x2="570" y2="600" stroke="#333" stroke-width="1"/>
  
  <!-- Google Button -->
  <rect x="230" y="630" width="340" height="48" fill="#FFFFFF" stroke="#333" stroke-width="2" rx="8"/>
  <text x="400" y="660" fill="#333" font-family="sans-serif" font-size="14" text-anchor="middle">G  Continue with Google</text>
  
  <!-- GitHub Button -->
  <rect x="230" y="690" width="340" height="48" fill="#1A1A1A" stroke="#555" stroke-width="2" rx="8"/>
  <text x="400" y="720" fill="#FFFFFF" font-family="sans-serif" font-size="14" text-anchor="middle">⚡ Continue with GitHub</text>
  
  <!-- Sign Up Link -->
  <text x="400" y="780" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">Don't have an account? </text>
  <text x="520" y="780" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold">Sign Up</text>
  
  <!-- Footer -->
  <text x="400" y="860" fill="#666" font-family="sans-serif" font-size="12" text-anchor="middle">© 2024 Vibe Prompting | Terms | Privacy | Support</text>
</svg>
```

---

## Implementation Notes

### Form Validation Schema (Zod):
```typescript
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
```

### Supabase Integration:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

### OAuth Flow:
```typescript
// Google
await supabase.auth.signInWithOAuth({
  provider: 'google',
})

// GitHub
await supabase.auth.signInWithOAuth({
  provider: 'github',
})
```

### Security Considerations:
- Rate limiting: Max 5 attempts per minute
- Show generic error: "Invalid credentials" (don't reveal which field is wrong)
- CSRF protection via Supabase
- HTTPS only

---

*Last Updated: 2024*
*Theme: Tech Noir*
*Status: Ready for Implementation*
