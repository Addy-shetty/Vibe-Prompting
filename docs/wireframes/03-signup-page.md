# Wireframe: Signup Page

## Overview
User registration page with email/password creation, username selection, password strength indicator, and OAuth options. Tech Noir themed with clear visual feedback.

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
│                              │    ⚡ SIGN UP ⚡     │                      │
│                              │                      │                      │
│                              │  Create your free   │                      │
│                              │      account        │                      │
│                              │                      │                      │
│                              │  ✓ 10 Free Credits  │                      │
│                              │  ✓ No credit card   │                      │
│                              │    required         │                      │
│                              │                      │                      │
│                              ├──────────────────────┤                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │ 👤             │  │                      │
│                              │  │                │  │                      │
│                              │  │ Username       │  │                      │
│                              │  │ johndeveloper  │  │                      │
│                              │  │                │  │                      │
│                              │  │ ✓ Available    │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │ 📧             │  │                      │
│                              │  │                │  │                      │
│                              │  │ Email Address  │  │                      │
│                              │  │ john@email.com │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │ 🔒             │  │                      │
│                              │  │                │  │                      │
│                              │  │ Password       │  │                      │
│                              │  │ ••••••••••     │  │                      │
│                              │  │ [Show/Hide 👁]  │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              │  PASSWORD STRENGTH   │                      │
│                              │  ████░░░░░ 40%       │                      │
│                              │  Weak - Add symbols   │                      │
│                              │                      │                      │
│                              │  [8+ chars] [#$%@]   │                      │
│                              │  [1+ number] [A-Z]   │                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │ 🔒             │  │                      │
│                              │  │                │  │                      │
│                              │  │ Confirm        │  │                      │
│                              │  │ Password       │  │                      │
│                              │  │ ••••••••••     │  │                      │
│                              │  └────────────────┘  │                      │
│                              │                      │                      │
│                              │  [✓] I agree to      │                      │
│                              │      Terms & Privacy │                      │
│                              │                      │                      │
│                              │  ┌────────────────┐  │                      │
│                              │  │                │  │                      │
│                              │  │  CREATE ACCOUNT│  │                      │
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
│                              │  Already have an    │                      │
│                              │  account? [Login]   │                      │
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

### 2. Signup Card
**Container:**
- Max width: 480px (wider than login for extra fields)
- Padding: 40px
- Border: 2px solid with glow effect
- Border-radius: 16px
- Box-shadow: 8px 8px offset

**Header Section:**
- Icon: Lightning bolt
- Title: "SIGN UP" (uppercase, bold)
- Subtitle: "Create your free account"
- Benefits list with checkmarks:
  - 10 Free Credits
  - No credit card required

### 3. Form Fields

#### Username Input
**Elements:**
- Label: "Username"
- Icon: User/Person (left)
- Placeholder: "johndeveloper"
- Real-time availability check
- Validation indicator (checkmark/X)

**Validation Rules:**
- 3-20 characters
- Alphanumeric + underscore only
- Must be unique
- Auto-suggest if taken

**States:**
```
Available:   "johndeveloper ✓" (green)
Taken:       "john ✗ Username taken" (red)
Checking:    "john..." (loading spinner)
Invalid:     "john@ ✗ Only letters, numbers, _" (red)
```

**Tech Noir Styling:**
- Yellow border on focus
- Green checkmark or red X on right
- Pulsing animation while checking

#### Email Input
**Same as Login Page**
- Real-time validation
- Format checking
- Error states

#### Password Input
**Elements:**
- Label: "Password"
- Icon: Lock (left)
- Toggle: Eye icon (right)
- Placeholder: "••••••••••"

**Password Strength Indicator:**
```
┌────────────────────────────────┐
│ 🔒 Password              [👁]  │
│ ••••••••••                    │
│                               │
│ PASSWORD STRENGTH             │
│ ████████░░ 80%               │
│ Strong ✓                      │
│                               │
│ Requirements:                 │
│ ✓ 8+ characters               │
│ ✓ 1+ number                   │
│ ✓ 1+ uppercase                │
│ ✓ 1+ symbol (#$%@)           │
└────────────────────────────────┘
```

**Strength Levels:**
- **0-20%:** Very Weak (Red) - "Add more characters"
- **21-40%:** Weak (Orange) - "Add symbols"
- **41-60%:** Fair (Yellow) - "Getting there"
- **61-80%:** Good (Light Green) - "Almost there"
- **81-100%:** Strong (Green) - "Perfect! ✓"

**Progress Bar Colors:**
```css
/* Dynamic gradient based on strength */
strength-0-20 { background: linear-gradient(to right, #EF4444, #DC2626); }
strength-21-40 { background: linear-gradient(to right, #F97316, #EA580C); }
strength-41-60 { background: linear-gradient(to right, #FFD700, #F59E0B); }
strength-61-80 { background: linear-gradient(to right, #22C55E, #16A34A); }
strength-81-100 { background: linear-gradient(to right, #10B981, #059669); }
```

**Password Requirements Checklist:**
- Real-time checkmarks as user types
- Gray → Yellow when met
- Animated checkmark icon

#### Confirm Password Input
**Elements:**
- Label: "Confirm Password"
- Icon: Lock (left)
- Toggle: Eye icon (right)
- Validation: Must match password
- Real-time match indicator

**Match States:**
```
Match:    "✓ Passwords match" (green)
Mismatch: "✗ Passwords don't match" (red)
Empty:    No indicator
```

### 4. Terms Checkbox
**Elements:**
- Custom checkbox (Tech Noir style)
- Label: "I agree to Terms & Privacy"
- Links: "Terms" and "Privacy" (yellow, underlined)

**Styling:**
```
┌──────────────────────────┐
│  ┌────┐ I agree to       │
│  │ ✓  │ Terms & Privacy  │
│  └────┘     ^      ^     │
│             |      |     │
│       (yellow links)     │
└──────────────────────────┘
```

**Checkbox Design:**
- 20x20px square
- 2px border (yellow when checked)
- Yellow checkmark animation
- Yellow glow when focused

### 5. Submit Button
**Design:**
- Full width
- Height: 56px
- Background: #FFD700 (Yellow)
- Text: "CREATE ACCOUNT" (black, bold)
- Border: 2px solid black
- Shadow: 4px 4px offset
- Disabled until all validations pass

**States:**
- **Disabled:** Opacity 0.5, no shadow
- **Active:** Full yellow, clickable
- **Loading:** Spinner + "Creating Account..."
- **Success:** Checkmark + "Success!" → Redirect

### 6. Divider & OAuth
**Same as Login Page**
- "OR" divider
- Google OAuth button
- GitHub OAuth button

### 7. Login CTA
**Text:** "Already have an account? Login"
**Style:** Yellow "Login" link

---

## Password Strength Algorithm

### Scoring System:
```typescript
function calculatePasswordStrength(password: string): number {
  let score = 0;
  
  // Length (max 40 points)
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 15;
  
  // Character variety (max 40 points)
  if (/[a-z]/.test(password)) score += 10;  // Lowercase
  if (/[A-Z]/.test(password)) score += 10;  // Uppercase
  if (/[0-9]/.test(password)) score += 10;  // Numbers
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;  // Special chars
  
  // Complexity bonus (max 20 points)
  if (password.length >= 8 && 
      /[a-z]/.test(password) && 
      /[A-Z]/.test(password) && 
      /[0-9]/.test(password) && 
      /[^a-zA-Z0-9]/.test(password)) {
    score += 20;
  }
  
  return Math.min(score, 100);
}
```

### Visual Feedback:
```typescript
function getStrengthLabel(score: number): { label: string; color: string } {
  if (score <= 20) return { label: 'Very Weak', color: '#EF4444' };
  if (score <= 40) return { label: 'Weak', color: '#F97316' };
  if (score <= 60) return { label: 'Fair', color: '#FFD700' };
  if (score <= 80) return { label: 'Good', color: '#22C55E' };
  return { label: 'Strong', color: '#10B981' };
}
```

---

## User Actions

| Action | Trigger | Result | Validation |
|--------|---------|--------|------------|
| Enter Username | Type | Real-time availability check | 3-20 chars, alphanumeric |
| Enter Email | Type | Format validation | Valid email format |
| Enter Password | Type | Strength calculation + checklist update | Min 8 chars |
| Toggle Password | Click eye icon | Show/hide password | - |
| Confirm Password | Type | Match validation | Must match password |
| Check Terms | Click checkbox | Enable submit button | Required |
| Submit Form | Click button | API call to Supabase | All validations pass |
| OAuth Signup | Click OAuth buttons | Redirect to OAuth | - |

---

## Error States

### Username Errors:
```
┌────────────────────────────────┐
│ 👤                           X │
│                                │
│ Username                       │
│ jo                             │
│                                │
│ ⚠ Must be 3-20 characters     │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 👤                           X │
│                                │
│ Username                       │
│ john_doe@                      │
│                                │
│ ⚠ Only letters, numbers, _    │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 👤                        🔄   │  ← Loading spinner
│                                │
│ Username                       │
│ johndeveloper                  │
│                                │
│ Checking availability...        │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 👤                           ✓ │  ← Green check
│                                │
│ Username                       │
│ johndeveloper                  │
│                                │
│ ✓ Username available           │
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
│ PASSWORD STRENGTH              │
│ ██░░░░░░░░ 15%                 │
│ Very Weak                      │
│                                │
│ ⚠ Add 5 more characters        │
└────────────────────────────────┘
```

### Confirm Password Errors:
```
┌────────────────────────────────┐
│ 🔒                           👁 │
│                                │
│ Confirm Password               │
│ •••••••••                      │
│                                │
│ ✗ Passwords don't match        │
└────────────────────────────────┘
```

---

## Mobile Responsive Notes

### Mobile Layout:
```
┌──────────────────────────┐
│ [LOGO]        [Close X] │
├──────────────────────────┤
│                          │
│     ⚡ SIGN UP ⚡        │
│  Create your free       │
│      account            │
│                          │
│  ✓ 10 Free Credits      │
│  ✓ No credit card       │
│    required             │
│                          │
│  ┌──────────────────┐   │
│  │ 👤 Username      │   │
│  │ johndeveloper    │   │
│  │ ✓ Available      │   │
│  └──────────────────┘   │
│                          │
│  ┌──────────────────┐   │
│  │ 📧 Email         │   │
│  │ john@email.com   │   │
│  └──────────────────┘   │
│                          │
│  ┌──────────────────┐   │
│  │ 🔒 Password   👁  │   │
│  │ ••••••••••       │   │
│  └──────────────────┘   │
│                          │
│  STRENGTH               │
│  ████████░░ 80%         │
│  Strong ✓               │
│                          │
│  ✓ 8+ chars ✓ 1+ num   │
│  ✓ 1+ UPPER ✓ Symbol    │
│                          │
│  ┌──────────────────┐   │
│  │ 🔒 Confirm    👁  │   │
│  │ ••••••••••       │   │
│  │ ✓ Match          │   │
│  └──────────────────┘   │
│                          │
│  [✓] I agree to Terms   │
│                          │
│  ┌──────────────────┐   │
│  │ CREATE ACCOUNT   │   │
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
│  Have account? [Login]  │
│                          │
└──────────────────────────┘
```

### Mobile Adjustments:
- Card full width with 16px padding
- Strength bar full width
- Requirements in 2x2 grid
- Larger touch targets (48px min)

---

## Tech Noir Theme References

### Password Strength Colors:
```css
/* Gradient stops for strength meter */
--strength-very-weak: #EF4444;    /* Red */
--strength-weak: #F97316;         /* Orange */
--strength-fair: #FFD700;         /* Yellow */
--strength-good: #22C55E;         /* Green */
--strength-strong: #10B981;       /* Emerald */

/* Progress bar gradient */
.strength-bar {
  background: linear-gradient(90deg, 
    #EF4444 0%, 
    #F97316 25%, 
    #FFD700 50%, 
    #22C55E 75%, 
    #10B981 100%
  );
}
```

### Animation Effects:
```css
/* Checkmark animation */
@keyframes checkmark {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Strength bar fill */
@keyframes strengthFill {
  from { width: 0%; }
  to { width: var(--strength-percentage); }
}

/* Username checking pulse */
@keyframes checking {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## SVG Wireframe

```svg
<svg viewBox="0 0 800 1100" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="1100" fill="#0A0A0A"/>
  
  <!-- Animated Tiles Background (simplified) -->
  <g opacity="0.1">
    <rect x="50" y="50" width="100" height="100" fill="none" stroke="#FFD700" stroke-width="1"/>
    <rect x="170" y="50" width="100" height="100" fill="none" stroke="#A855F7" stroke-width="1"/>
    <rect x="650" y="50" width="100" height="100" fill="none" stroke="#FFD700" stroke-width="1"/>
    <rect x="50" y="950" width="100" height="100" fill="none" stroke="#A855F7" stroke-width="1"/>
    <rect x="650" y="950" width="100" height="100" fill="none" stroke="#FFD700" stroke-width="1"/>
  </g>
  
  <!-- Header -->
  <text x="40" y="40" fill="#FFD700" font-family="monospace" font-size="20" font-weight="bold">⚡ VIBE</text>
  <text x="640" y="40" fill="#A1A1AA" font-family="sans-serif" font-size="14">Back to Home →</text>
  
  <!-- Signup Card -->
  <rect x="160" y="80" width="480" height="920" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="16"/>
  <rect x="160" y="80" width="480" height="920" fill="none" stroke="#FFD700" stroke-width="2" rx="16" opacity="0.3"/>
  
  <!-- Card Header -->
  <text x="400" y="140" fill="#FFD700" font-family="monospace" font-size="28" font-weight="bold" text-anchor="middle">⚡ SIGN UP ⚡</text>
  <text x="400" y="175" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">Create your free account</text>
  
  <!-- Benefits -->
  <text x="250" y="210" fill="#22C55E" font-family="sans-serif" font-size="12">✓ 10 Free Credits</text>
  <text x="250" y="230" fill="#22C55E" font-family="sans-serif" font-size="12">✓ No credit card required</text>
  
  <!-- Divider -->
  <line x1="200" y1="250" x2="600" y2="250" stroke="#333" stroke-width="1"/>
  
  <!-- Username Input -->
  <text x="200" y="290" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="500">Username</text>
  <rect x="200" y="305" width="400" height="56" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="220" y="340" fill="#666" font-family="sans-serif" font-size="16">👤 johndeveloper</text>
  <text x="560" y="340" fill="#22C55E" font-family="sans-serif" font-size="16">✓</text>
  <text x="200" y="375" fill="#22C55E" font-family="sans-serif" font-size="12">✓ Username available</text>
  
  <!-- Email Input -->
  <text x="200" y="415" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="500">Email Address</text>
  <rect x="200" y="430" width="400" height="56" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="220" y="465" fill="#666" font-family="sans-serif" font-size="16">📧 john@email.com</text>
  
  <!-- Password Input -->
  <text x="200" y="520" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="500">Password</text>
  <rect x="200" y="535" width="400" height="56" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="220" y="570" fill="#666" font-family="sans-serif" font-size="16">🔒 ••••••••••</text>
  <text x="560" y="570" fill="#A1A1AA" font-family="sans-serif" font-size="14">👁</text>
  
  <!-- Password Strength -->
  <text x="200" y="610" fill="#A1A1AA" font-family="sans-serif" font-size="12" font-weight="500">PASSWORD STRENGTH</text>
  <rect x="200" y="625" width="400" height="8" fill="#333" rx="4"/>
  <rect x="200" y="625" width="320" height="8" fill="url(#strengthGradient)" rx="4"/>
  <text x="200" y="650" fill="#22C55E" font-family="sans-serif" font-size="12">Strong ✓</text>
  
  <!-- Requirements -->
  <text x="200" y="680" fill="#22C55E" font-family="sans-serif" font-size="12">✓ 8+ chars</text>
  <text x="320" y="680" fill="#22C55E" font-family="sans-serif" font-size="12">✓ 1+ number</text>
  <text x="200" y="700" fill="#22C55E" font-family="sans-serif" font-size="12">✓ 1+ UPPER</text>
  <text x="320" y="700" fill="#22C55E" font-family="sans-serif" font-size="12">✓ Symbol</text>
  
  <!-- Confirm Password -->
  <text x="200" y="740" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="500">Confirm Password</text>
  <rect x="200" y="755" width="400" height="56" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="220" y="790" fill="#666" font-family="sans-serif" font-size="16">🔒 ••••••••••</text>
  <text x="200" y="825" fill="#22C55E" font-family="sans-serif" font-size="12">✓ Passwords match</text>
  
  <!-- Terms Checkbox -->
  <rect x="200" y="855" width="20" height="20" fill="#0A0A0A" stroke="#FFD700" stroke-width="2" rx="4"/>
  <text x="210" y="870" fill="#FFD700" font-family="sans-serif" font-size="14">✓</text>
  <text x="235" y="870" fill="#A1A1AA" font-family="sans-serif" font-size="12">I agree to </text>
  <text x="310" y="870" fill="#FFD700" font-family="sans-serif" font-size="12" text-decoration="underline">Terms</text>
  <text x="360" y="870" fill="#A1A1AA" font-family="sans-serif" font-size="12"> & </text>
  <text x="385" y="870" fill="#FFD700" font-family="sans-serif" font-size="12" text-decoration="underline">Privacy</text>
  
  <!-- Create Account Button -->
  <rect x="200" y="905" width="400" height="56" fill="#FFD700" stroke="#000" stroke-width="2" rx="8"/>
  <rect x="204" y="909" width="400" height="56" fill="none" stroke="#000" stroke-width="2" rx="8"/>
  <text x="400" y="940" fill="#0A0A0A" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">CREATE ACCOUNT</text>
  
  <!-- OR Divider -->
  <line x1="200" y1="985" x2="320" y2="985" stroke="#333" stroke-width="1"/>
  <text x="400" y="990" fill="#666" font-family="sans-serif" font-size="12" text-anchor="middle">OR</text>
  <line x1="480" y1="985" x2="600" y2="985" stroke="#333" stroke-width="1"/>
  
  <!-- Google Button -->
  <rect x="200" y="1010" width="400" height="44" fill="#FFFFFF" stroke="#333" stroke-width="2" rx="8"/>
  <text x="400" y="1038" fill="#333" font-family="sans-serif" font-size="14" text-anchor="middle">G  Continue with Google</text>
  
  <!-- Footer -->
  <text x="400" y="1070" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">Already have an account? </text>
  <text x="540" y="1070" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold">Login</text>
  
  <!-- Gradient Definition -->
  <defs>
    <linearGradient id="strengthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#EF4444"/>
      <stop offset="25%" style="stop-color:#F97316"/>
      <stop offset="50%" style="stop-color:#FFD700"/>
      <stop offset="75%" style="stop-color:#22C55E"/>
      <stop offset="100%" style="stop-color:#10B981"/>
    </linearGradient>
  </defs>
</svg>
```

---

## Implementation Notes

### Zod Validation Schema:
```typescript
const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
```

### Username Availability Check:
```typescript
const checkUsername = debounce(async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()
  
  return !data // returns true if available
}, 500)
```

### Supabase Signup:
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username,
    },
  },
})
```

---

*Last Updated: 2024*
*Theme: Tech Noir*
*Status: Ready for Implementation*
