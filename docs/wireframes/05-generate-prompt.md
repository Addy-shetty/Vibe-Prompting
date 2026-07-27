# Wireframe: Generate Prompt Page

## Overview
Main interface for creating AI prompts. Features input field, tier selector, generation process visualization, and result display. Core functionality of the app.

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]      Home  Features  Pricing  Docs              [💰 7] [👤 Menu]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │  SIDENAV     │    GENERATE PROMPT                                        │
│  │              │                                                           │
│  │  [⚡] Overview│    ┌──────────────────────────────────────────────────┐  │
│  │  [📝] Generate│    │                                                  │  │
│  │      (active) │    │  STEP 1: ENTER YOUR IDEA                         │  │
│  │  [💾] My      │    │                                                  │  │
│  │      Prompts  │    │  Describe what you need help with...             │  │
│  │  [🔍] Explore │    │                                                  │  │
│  │  [📊] Stats   │    │  ┌────────────────────────────────────────────┐ │  │
│  │  [⚙️] Settings│    │  │                                            │ │  │
│  │              │    │  │  I want to build a React dashboard with    │ │  │
│  │  ─────────── │    │  │  charts, user authentication, and dark    │ │  │
│  │  [❓] Help   │    │  │  mode support...                          │ │  │
│  │  [🚪] Logout │    │  │                                            │ │  │
│  │              │    │  │  [🎤 Voice Input]  [📋 Paste]  [✨ Clear]  │ │  │
│  └──────────────┘    │  └────────────────────────────────────────────┘ │  │
│                      │                                                  │  │
│                      │  Character count: 87/500                        │  │
│                      │                                                  │  │
│                      └──────────────────────────────────────────────────┘  │
│                                                                            │
│                      ┌──────────────────────────────────────────────────┐  │
│                      │                                                  │  │
│                      │  STEP 2: CHOOSE PROMPT TIER                      │  │
│                      │                                                  │  │
│                      │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐│  │
│                      │  │              │  │              │  │          ││  │
│                      │  │    BASIC     │  │   ADVANCED   │  │  EXPERT  ││  │
│                      │  │              │  │              │  │          ││  │
│                      │  │     5        │  │      3       │  │    2     ││  │
│                      │  │   CREDITS    │  │   CREDITS    │  │ CREDITS  ││  │
│                      │  │              │  │              │  │          ││  │
│                      │  │  • Core      │  │  • Detailed  │  │ • Full   ││  │
│                      │  │    concept   │  │    specs     │  │   system ││  │
│                      │  │  • Tech      │  │  • Error     │  │   design ││  │
│                      │  │    stack     │  │    handling  │  │ • Tests  ││  │
│                      │  │  • Basic     │  │  • Best      │  │ • Deploy ││  │
│                      │  │    reqs      │  │    practices │  │   guide  ││  │
│                      │  │              │  │              │  │          ││  │
│                      │  │   [SELECT]   │  │   [SELECTED] │  │ [SELECT] ││  │
│                      │  │              │  │      ●       │  │          ││  │
│                      │  └──────────────┘  └──────────────┘  └──────────┘│  │
│                      │                                                  │  │
│                      └──────────────────────────────────────────────────┘  │
│                                                                            │
│                      ┌──────────────────────────────────────────────────┐  │
│                      │                                                  │  │
│                      │           [⚡ GENERATE PROMPT - 3 CR]           │  │
│                      │                                                  │  │
│                      │              Cost: 3 credits                     │  │
│                      │              Balance after: 4 credits            │  │
│                      │                                                  │  │
│                      └──────────────────────────────────────────────────┘  │
│                                                                            │
│  ════════════════════════════════════════════════════════════════════════ │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  📝 GENERATED PROMPT                                  [COPY] [SAVE] │  │
│  │                                                                      │  │
│  │  ┌────────────────────────────────────────────────────────────────┐ │  │
│  │  │  [TERMINAL HEADER: ● ● ●  generated-prompt.txt]               │ │  │
│  │  │                                                                 │ │  │
│  │  │  # React Dashboard Application                                   │ │  │
│  │  │                                                                 │ │  │
│  │  │  ## Objective                                                    │ │  │
│  │  │  Build a comprehensive React dashboard with interactive          │ │  │
│  │  │  charts, user authentication, and dark mode support.             │ │  │
│  │  │                                                                 │ │  │
│  │  │  ## Tech Stack                                                   │ │  │
│  │  │  - React 18 with TypeScript                                      │ │  │
│  │  │  - Recharts for data visualization                               │ │  │
│  │  │  - Tailwind CSS for styling                                      │ │  │
│  │  │  - React Router for navigation                                   │ │  │
│  │  │  - Context API for state management                              │ │  │
│  │  │                                                                 │ │  │
│  │  │  ## Detailed Requirements                                        │ │  │
│  │  │  1. **Dashboard Layout**                                         │ │  │
│  │  │     - Responsive sidebar navigation                              │ │  │
│  │  │     - Top header with user profile dropdown                      │ │  │
│  │  │     - Main content area for widgets                              │ │  │
│  │  │     - Collapsible mobile menu                                    │ │  │
│  │  │                                                                 │ │  │
│  │  │  2. **Chart Components**                                         │ │  │
│  │  │     - Line chart for trends over time                            │ │  │
│  │  │     - Bar chart for categorical data                             │ │  │
│  │  │     - Pie chart for distribution                                 │ │  │
│  │  │     - Real-time data updates                                     │ │  │
│  │  │                                                                 │ │  │
│  │  │  [Typewriter effect continuing...]                               │ │  │
│  │  │                                                                 │ │  │
│  │  └────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                      │  │
│  │  ✓ Generated in 2.3s | 3 credits used | 4 remaining                 │  │
│  │                                                                      │  │
│  │  [📝 Generate Another]  [🔧 Refine]  [📋 Copy]  [💾 Save]           │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Step 1: Input Section

#### Header
**Elements:**
- Step indicator: "STEP 1: ENTER YOUR IDEA"
- Helper text: "Describe what you need help with..."

#### Text Area
**Features:**
- Multi-line input
- Auto-expand (min 120px, max 300px)
- Character counter (87/500)
- Placeholder: "I want to build a React dashboard..."

**Action Buttons Row:**
- 🎤 Voice Input (optional feature)
- 📋 Paste from clipboard
- ✨ Clear all text

**Tech Noir Styling:**
```css
.textarea-container {
  background: #0A0A0A;
  border: 2px solid #333;
  border-radius: 12px;
  padding: 20px;
}

.textarea-container:focus-within {
  border-color: #FFD700;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1);
}

.textarea {
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  width: 100%;
  resize: vertical;
  min-height: 120px;
}
```

#### Character Counter
**Design:**
- Position: Bottom right of textarea
- Color: Gray (→ Yellow when approaching limit)
- Format: "87/500"

### 2. Step 2: Tier Selector

#### Header
**Text:** "STEP 2: CHOOSE PROMPT TIER"

#### Tier Cards (3-column)

**BASIC TIER:**
```
┌──────────────────┐
│                  │
│      BASIC       │
│                  │
│        5         │
│     CREDITS      │
│                  │
│  • Core concept  │
│  • Tech stack    │
│  • Basic reqs    │
│                  │
│    [SELECT]      │
│                  │
└──────────────────┘
```

**ADVANCED TIER:**
```
┌──────────────────┐
│                  │
│     ADVANCED     │
│    ● (selected)  │
│                  │
│        3         │
│     CREDITS      │
│                  │
│  • Detailed specs│
│  • Error handling│
│  • Best practices│
│                  │
│    [SELECTED]    │
│        ●         │
└──────────────────┘
```

**EXPERT TIER:**
```
┌──────────────────┐
│                  │
│      EXPERT      │
│                  │
│        2         │
│     CREDITS      │
│                  │
│  • Full system   │
│    design        │
│  • Tests & QA    │
│  • Deploy guide  │
│                  │
│    [SELECT]      │
│                  │
└──────────────────┘
```

**Selection States:**
- **Unselected:** Gray border, gray features text
- **Selected:** Yellow border (3px), yellow dot indicator, highlighted features
- **Hover:** Lift effect, subtle yellow glow

**Tech Noir Styling:**
```css
.tier-card {
  background: #1A1A1A;
  border: 2px solid #333;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.tier-card:hover {
  transform: translateY(-4px);
  border-color: #FFD700;
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.1);
}

.tier-card.selected {
  border: 3px solid #FFD700;
  background: rgba(255, 215, 0, 0.05);
}

.tier-credits {
  font-family: 'JetBrains Mono', monospace;
  font-size: 48px;
  font-weight: 700;
  color: #FFD700;
}
```

### 3. Generate Button Section

#### Primary CTA
**Design:**
- Full width (within container)
- Height: 64px
- Background: Yellow gradient
- Icon: Lightning bolt
- Text: "GENERATE PROMPT - 3 CR"
- Border: 2px solid black
- Shadow: 6px 6px offset

#### Cost Info
- "Cost: 3 credits"
- "Balance after: 4 credits"
- Small text below button

**Disabled State:**
- No input text
- Insufficient credits
- Loading state

**Loading State:**
- Spinner animation
- Text: "GENERATING..."
- Progress indicator (optional)

**Tech Noir Effect:**
```css
.generate-button {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: 2px solid #000;
  box-shadow: 6px 6px 0px 0px #000;
  transition: all 0.2s;
}

.generate-button:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px 0px #000;
}

.generate-button:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px 0px #000;
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 4. Results Section

#### Terminal-Style Output
**Header:**
- Three dots (red, yellow, green)
- Filename: "generated-prompt.txt"
- Window controls aesthetic

**Content Area:**
- Monospace font (JetBrains Mono)
- Syntax highlighting (optional)
- Markdown rendering
- Typewriter/streaming effect
- Scrollable (max height: 600px)

**Tech Noir Styling:**
```css
.terminal {
  background: #0A0A0A;
  border: 2px solid #333;
  border-radius: 12px;
  overflow: hidden;
}

.terminal-header {
  background: #1A1A1A;
  border-bottom: 2px solid #333;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #000;
}

.terminal-dot.red { background: #FF5F56; }
.terminal-dot.yellow { background: #FFBD2E; }
.terminal-dot.green { background: #27C93F; }

.terminal-content {
  padding: 24px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.8;
  color: #E0E0E0;
  max-height: 600px;
  overflow-y: auto;
}

/* Markdown styling within terminal */
.terminal-content h1 {
  color: #FFD700;
  font-size: 18px;
  font-weight: 700;
  margin: 24px 0 16px;
}

.terminal-content h2 {
  color: #A855F7;
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 12px;
}

.terminal-content code {
  background: #1A1A1A;
  padding: 2px 6px;
  border-radius: 4px;
  color: #22C55E;
}
```

#### Action Bar
**Elements:**
- Generation metadata (time, credits used)
- Action buttons row

**Buttons:**
1. 📝 Generate Another (reset form)
2. 🔧 Refine (edit and regenerate)
3. 📋 Copy (to clipboard)
4. 💾 Save (to My Prompts)

**Success Toast:**
- "✓ Copied to clipboard!"
- "✓ Saved to My Prompts"

---

## User Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Type Input | Type in textarea | Character count updates |
| Clear Input | Click "Clear" button | Empty textarea |
| Paste | Click "Paste" button | Insert clipboard content |
| Select Tier | Click tier card | Highlight selected tier |
| Generate | Click generate button | API call, show loading |
| Copy Result | Click "Copy" button | Copy to clipboard |
| Save Result | Click "Save" button | Save to database |
| Generate Another | Click button | Reset form, keep tier |
| Refine | Click "Refine" button | Focus input with result |

---

## Generation States

### 1. Idle State
```
┌──────────────────────────────────────┐
│  Input: Ready                        │
│  Tier: Advanced selected             │
│  Button: Active (yellow)             │
│  Result: Hidden                      │
└──────────────────────────────────────┘
```

### 2. Validating State
```
┌──────────────────────────────────────┐
│  Checking credits...                 │
│  Validating input...                 │
│  Button: Disabled                    │
└──────────────────────────────────────┘
```

### 3. Loading State
```
┌──────────────────────────────────────┐
│  Input: Disabled                     │
│  Tier: Disabled                      │
│  Button: [⚡ GENERATING...]          │
│  Progress: [████████░░] 80%         │
│  Status: "Crafting your prompt..."   │
└──────────────────────────────────────┘
```

### 4. Streaming State
```
┌──────────────────────────────────────┐
│  Terminal: Visible                   │
│  Content: Typewriter effect          │
│  Cursor: Blinking █                  │
│  Button: Still loading               │
└──────────────────────────────────────┘
```

### 5. Complete State
```
┌──────────────────────────────────────┐
│  Terminal: Full content displayed    │
│  Meta: ✓ 2.3s | 3cr used | 4 remain  │
│  Actions: All enabled                │
│  Button: [GENERATE ANOTHER]          │
└──────────────────────────────────────┘
```

### 6. Error State
```
┌──────────────────────────────────────┐
│  ❌ Error Alert:                     │
│  "Insufficient credits"              │
│  or "Network error. Please retry."   │
│  Button: [RETRY] or [BUY CREDITS]    │
└──────────────────────────────────────┘
```

---

## Mobile Responsive Notes

### Mobile Layout:
```
┌──────────────────────────┐
│  [LOGO]  [💰 7] [👤 ☰]  │
├──────────────────────────┤
│                          │
│  GENERATE PROMPT        │
│                          │
│  STEP 1: YOUR IDEA      │
│  ┌──────────────────┐   │
│  │ I want to build  │   │
│  │ a React...       │   │
│  │                  │   │
│  │ [🎤] [📋] [✨]   │   │
│  └──────────────────┘   │
│  87/500                 │
│                          │
│  STEP 2: CHOOSE TIER    │
│  ┌──────────┐           │
│  │  BASIC   │           │
│  │   5 cr   │           │
│  │ [SELECT] │           │
│  └──────────┘           │
│  ┌──────────┐           │
│  │ ADVANCED │           │
│  │   3 cr   │◄──selected│
│  │  ●       │           │
│  └──────────┘           │
│  ┌──────────┐           │
│  │  EXPERT  │           │
│  │   2 cr   │           │
│  │ [SELECT] │           │
│  └──────────┘           │
│                          │
│  [⚡ GENERATE - 3 CR]   │
│  Cost: 3 | Balance: 4   │
│                          │
│  ═══════════════════════ │
│                          │
│  📝 GENERATED           │
│  [COPY] [SAVE]          │
│  ┌──────────────────┐   │
│  │ ● ● ● prompt.txt│   │
│  │                  │   │
│  │ # React App...   │   │
│  │ ...              │   │
│  │                  │   │
│  └──────────────────┘   │
│                          │
│  ✓ 2.3s | 3cr | 4 left  │
│                          │
│  [📝 New] [🔧 Refine]   │
│                          │
└──────────────────────────┘
```

### Mobile Adjustments:
- Sidebar becomes top dropdown
- Tier cards stack vertically
- Full-width generate button
- Terminal full width
- Floating action buttons for Copy/Save

---

## Tech Noir Theme References

### Generation Animation:
```css
/* Typewriter cursor */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 18px;
  background: #FFD700;
  animation: blink 1s infinite;
  vertical-align: middle;
}

/* Generating pulse */
@keyframes generatePulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  50% { 
    box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0.2);
  }
}

.generating {
  animation: generatePulse 2s infinite;
}
```

### Color Coding for Output:
```css
/* Headers */
h1 { color: #FFD700; }  /* Yellow */
h2 { color: #A855F7; }  /* Purple */
h3 { color: #22C55E; }  /* Green */

/* Code */
code { color: #22C55E; background: #1A1A1A; }

/* Lists */
li::marker { color: #FFD700; }

/* Emphasis */
strong { color: #FFFFFF; }
em { color: #A855F7; }
```

---

## SVG Wireframe

```svg
<svg viewBox="0 0 1400 1200" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1400" height="1200" fill="#0A0A0A"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="1400" height="60" fill="#1A1A1A" stroke="#333" stroke-width="1"/>
  <text x="40" y="38" fill="#FFD700" font-family="monospace" font-size="20" font-weight="bold">⚡ VIBE</text>
  <text x="600" y="38" fill="#A1A1AA" font-family="sans-serif" font-size="14">Home  Features  Pricing  Docs</text>
  <text x="1150" y="38" fill="#FFD700" font-family="sans-serif" font-size="16" font-weight="bold">💰 7</text>
  
  <!-- Sidebar -->
  <rect x="0" y="60" width="240" height="1140" fill="#141414" stroke="#333" stroke-width="1"/>
  <text x="20" y="128" fill="#A1A1AA" font-family="sans-serif" font-size="14">⚡ Overview</text>
  <rect x="0" y="150" width="4" height="40" fill="#FFD700"/>
  <text x="20" y="178" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold">📝 Generate</text>
  <text x="20" y="228" fill="#A1A1AA" font-family="sans-serif" font-size="14">💾 My Prompts</text>
  
  <!-- Step 1: Input -->
  <text x="280" y="100" fill="#FFFFFF" font-family="sans-serif" font-size="20" font-weight="bold">GENERATE PROMPT</text>
  <rect x="280" y="120" width="1080" height="200" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="12"/>
  <text x="320" y="155" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold">STEP 1: ENTER YOUR IDEA</text>
  <text x="320" y="180" fill="#A1A1AA" font-family="sans-serif" font-size="12">Describe what you need help with...</text>
  <rect x="320" y="200" width="1000" height="80" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="340" y="235" fill="#FFFFFF" font-family="sans-serif" font-size="16">I want to build a React dashboard with charts, user authentication,</text>
  <text x="340" y="258" fill="#FFFFFF" font-family="sans-serif" font-size="16">and dark mode support...</text>
  <text x="340" y="295" fill="#666" font-family="sans-serif" font-size="12">🎤 Voice   📋 Paste   ✨ Clear</text>
  <text x="1260" y="295" fill="#666" font-family="sans-serif" font-size="12">87/500</text>
  
  <!-- Step 2: Tier Selection -->
  <rect x="280" y="340" width="1080" height="280" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="12"/>
  <text x="320" y="375" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold">STEP 2: CHOOSE PROMPT TIER</text>
  
  <!-- Basic Tier -->
  <rect x="320" y="400" width="300" height="200" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="470" y="440" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">BASIC</text>
  <text x="470" y="490" fill="#FFD700" font-family="monospace" font-size="48" font-weight="bold" text-anchor="middle">5</text>
  <text x="470" y="520" fill="#A1A1AA" font-family="sans-serif" font-size="12" text-anchor="middle">CREDITS</text>
  <text x="340" y="555" fill="#666" font-family="sans-serif" font-size="11">• Core concept</text>
  <text x="340" y="575" fill="#666" font-family="sans-serif" font-size="11">• Tech stack</text>
  <text x="340" y="595" fill="#666" font-family="sans-serif" font-size="11">• Basic reqs</text>
  <rect x="380" y="470" width="180" height="36" fill="transparent" stroke="#333" stroke-width="2" rx="6"/>
  <text x="470" y="493" fill="#666" font-family="sans-serif" font-size="14" text-anchor="middle">SELECT</text>
  
  <!-- Advanced Tier (Selected) -->
  <rect x="660" y="400" width="300" height="200" fill="rgba(255,215,0,0.05)" stroke="#FFD700" stroke-width="3" rx="8"/>
  <text x="810" y="440" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">ADVANCED</text>
  <text x="810" y="490" fill="#FFD700" font-family="monospace" font-size="48" font-weight="bold" text-anchor="middle">3</text>
  <text x="810" y="520" fill="#FFD700" font-family="sans-serif" font-size="12" text-anchor="middle">CREDITS</text>
  <text x="680" y="555" fill="#FFFFFF" font-family="sans-serif" font-size="11">• Detailed specs</text>
  <text x="680" y="575" fill="#FFFFFF" font-family="sans-serif" font-size="11">• Error handling</text>
  <text x="680" y="595" fill="#FFFFFF" font-family="sans-serif" font-size="11">• Best practices</text>
  <text x="810" y="628" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">SELECTED</text>
  <circle cx="810" cy="580" r="4" fill="#FFD700"/>
  
  <!-- Expert Tier -->
  <rect x="1000" y="400" width="300" height="200" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="1150" y="440" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">EXPERT</text>
  <text x="1150" y="490" fill="#FFD700" font-family="monospace" font-size="48" font-weight="bold" text-anchor="middle">2</text>
  <text x="1150" y="520" fill="#A1A1AA" font-family="sans-serif" font-size="12" text-anchor="middle">CREDITS</text>
  <text x="1020" y="555" fill="#666" font-family="sans-serif" font-size="11">• Full system</text>
  <text x="1020" y="570" fill="#666" font-family="sans-serif" font-size="11">design</text>
  <text x="1020" y="595" fill="#666" font-family="sans-serif" font-size="11">• Tests & QA</text>
  <text x="1020" y="615" fill="#666" font-family="sans-serif" font-size="11">• Deploy guide</text>
  
  <!-- Generate Button -->
  <rect x="480" y="640" width="680" height="64" fill="#FFD700" stroke="#000" stroke-width="2" rx="8"/>
  <rect x="484" y="644" width="680" height="64" fill="none" stroke="#000" stroke-width="2" rx="8"/>
  <text x="820" y="682" fill="#0A0A0A" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">⚡ GENERATE PROMPT - 3 CR</text>
  <text x="820" y="715" fill="#666" font-family="sans-serif" font-size="12" text-anchor="middle">Cost: 3 credits | Balance after: 4 credits</text>
  
  <!-- Results Section -->
  <text x="280" y="765" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold">📝 GENERATED PROMPT</text>
  <text x="1200" y="765" fill="#FFD700" font-family="sans-serif" font-size="14">[COPY]</text>
  <text x="1260" y="765" fill="#FFD700" font-family="sans-serif" font-size="14">[SAVE]</text>
  
  <!-- Terminal -->
  <rect x="280" y="785" width="1080" height="350" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="12"/>
  <rect x="280" y="785" width="1080" height="40" fill="#1A1A1A" stroke="#333" stroke-width="1"/>
  <circle cx="310" cy="805" r="6" fill="#FF5F56" stroke="#000" stroke-width="1"/>
  <circle cx="330" cy="805" r="6" fill="#FFBD2E" stroke="#000" stroke-width="1"/>
  <circle cx="350" cy="805" r="6" fill="#27C93F" stroke="#000" stroke-width="1"/>
  <text x="380" y="810" fill="#666" font-family="monospace" font-size="12">generated-prompt.txt</text>
  <text x="320" y="860" fill="#FFD700" font-family="monospace" font-size="16" font-weight="bold"># React Dashboard Application</text>
  <text x="320" y="900" fill="#A855F7" font-family="monospace" font-size="14" font-weight="bold">## Objective</text>
  <text x="320" y="925" fill="#E0E0E0" font-family="monospace" font-size="12">Build a comprehensive React dashboard with interactive charts,</text>
  <text x="320" y="945" fill="#E0E0E0" font-family="monospace" font-size="12">user authentication, and dark mode support.</text>
  <text x="320" y="985" fill="#A855F7" font-family="monospace" font-size="14" font-weight="bold">## Tech Stack</text>
  <text x="320" y="1010" fill="#E0E0E0" font-family="monospace" font-size="12">- React 18 with TypeScript</text>
  <text x="320" y="1030" fill="#E0E0E0" font-family="monospace" font-size="12">- Recharts for data visualization</text>
  <text x="320" y="1050" fill="#E0E0E0" font-family="monospace" font-size="12">- Tailwind CSS for styling</text>
  <rect x="320" y="1080" width="10" height="18" fill="#FFD700"/>
  
  <!-- Result Meta -->
  <text x="320" y="1160" fill="#22C55E" font-family="sans-serif" font-size="12">✓ Generated in 2.3s | 3 credits used | 4 remaining</text>
  <rect x="320" y="1175" width="140" height="36" fill="transparent" stroke="#FFD700" stroke-width="2" rx="6"/>
  <text x="390" y="1198" fill="#FFD700" font-family="sans-serif" font-size="12" text-anchor="middle">📝 New</text>
  <rect x="480" y="1175" width="140" height="36" fill="transparent" stroke="#A855F7" stroke-width="2" rx="6"/>
  <text x="550" y="1198" fill="#A855F7" font-family="sans-serif" font-size="12" text-anchor="middle">🔧 Refine</text>
</svg>
```

---

## Implementation Notes

### State Management:
```typescript
interface GenerateState {
  input: string;
  selectedTier: 'basic' | 'advanced' | 'expert';
  isGenerating: boolean;
  result: string | null;
  error: string | null;
  creditsUsed: number;
  generationTime: number;
}
```

### API Integration:
```typescript
const generatePrompt = async (
  input: string,
  tier: string
): Promise<GenerateResponse> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, tier }),
  });
  
  // Handle streaming response
  const reader = response.body?.getReader();
  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    // Update UI with streamed content
  }
};
```

### Cost Display:
```typescript
const creditCosts = {
  basic: 5,
  advanced: 3,
  expert: 2,
};

const remainingCredits = currentCredits - creditCosts[selectedTier];
```

---

*Last Updated: 2024*
*Theme: Tech Noir*
*Status: Ready for Implementation*
