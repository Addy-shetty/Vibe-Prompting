# Wireframe: Dashboard

## Overview
User's main hub after login. Displays credit balance, quick actions, recent activity, and statistics. Clean layout with clear hierarchy.

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]      Home  Features  Pricing  Docs              [💰 7] [👤 Menu]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │  SIDENAV     │    DASHBOARD                                              │
│  │              │                                                           │
│  │  [⚡] Overview│    ┌──────────────────────────────────────────────────┐  │
│  │  [📝] Generate│    │  WELCOME BACK, JOHN! 👋                          │  │
│  │  [💾] My      │    │                                                  │  │
│  │      Prompts  │    │  You have 7 credits remaining                    │  │
│  │  [🔍] Explore │    │  Last login: Today at 10:30 AM                   │  │
│  │  [📊] Stats   │    └──────────────────────────────────────────────────┘  │
│  │  [⚙️] Settings│                                                          │
│  │              │                                                           │
│  │  ─────────── │    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  [❓] Help   │    │              │  │              │  │              │  │
│  │  [🚪] Logout │    │  💰          │  │  📝          │  │  💾          │  │
│  │              │    │              │  │              │  │              │  │
│  └──────────────┘    │   CREDITS    │  │  GENERATE   │  │   SAVED      │  │
│                      │              │  │              │  │              │  │
│                      │     7/10     │  │   PROMPT    │  │  PROMPTS     │  │
│                      │              │  │              │  │              │  │
│                      │  [Buy More]  │  │   [Start]   │  │  [View 12]   │  │
│                      │              │  │              │  │              │  │
│                      └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                                            │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  QUICK ACTIONS                                                             │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  [🚀 Quick Generate]  [🔍 Browse Examples]  [📊 View Analytics]     │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  RECENT ACTIVITY                                            [VIEW ALL →]  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  [📝] React Dashboard Generator                      3 credits  2h ago│  │
│  │  [📝] API Authentication Setup                       2 credits  5h ago│  │
│  │  [📝] Database Schema Design                         3 credits  1d ago│  │
│  │  [📝] Testing Strategy Guide                         2 credits  2d ago│  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  USAGE STATISTICS                                                          │
│                                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │              │  │              │  │              │  │              │   │
│  │    12        │  │     3        │  │    85%       │  │    28        │   │
│  │              │  │              │  │              │  │              │   │
│  │  Generated   │  │   Tiers      │  │  Success     │  │   Saved      │   │
│  │  This Week   │  │   Used       │  │   Rate       │  │   Prompts    │   │
│  │              │  │              │  │              │  │              │   │
│  │   ↑ 40%     │  │  [View]      │  │   ↑ 5%      │  │   ↑ 12%     │   │
│  │              │  │              │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                            │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  RECOMMENDED PROMPTS                                        [EXPLORE →]   │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │                  │  │                  │  │                  │        │
│  │  ⚡              │  │  🎨              │  │  🔒              │        │
│  │                  │  │                  │  │                  │        │
│  │  Full Stack      │  │  UI Components   │  │  Security        │        │
│  │  App Builder     │  │  Library         │  │  Best Practices  │        │
│  │                  │  │                  │  │                  │        │
│  │  Expert • 2cr   │  │  Advanced • 3cr │  │  Basic • 5cr    │        │
│  │                  │  │                  │  │                  │        │
│  │  [Try Now]       │  │  [Try Now]       │  │  [Try Now]       │        │
│  │                  │  │                  │  │                  │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Header
**Elements:**
- Logo (left)
- Navigation links
- Credit display with icon (💰 7)
- User menu dropdown (👤)

**Credit Display:**
- Icon: Coin/Credit symbol
- Number: Current credits
- Yellow accent color
- Hover: Show tooltip "7 credits remaining"

### 2. Sidebar Navigation
**Position:** Fixed left
**Width:** 240px
**Background:** Darker than main content

**Menu Items:**
1. Overview (active state)
2. Generate Prompt
3. My Prompts
4. Explore
5. Statistics
6. Settings
7. Divider
8. Help
9. Logout

**Active State:**
- Yellow left border (4px)
- Yellow background tint
- Bold text

**Tech Noir Styling:**
```css
.sidebar-item {
  padding: 12px 20px;
  border-left: 4px solid transparent;
  transition: all 0.2s;
}

.sidebar-item.active {
  border-left-color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  font-weight: 600;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.05);
}
```

### 3. Welcome Banner
**Elements:**
- Greeting with username
- Credit summary
- Last login time
- Background: Gradient with glow

**Tech Noir Effect:**
- Yellow/purple gradient background
- Subtle glow effect
- Border with shadow

### 4. Quick Stats Cards (3-column)

#### Credits Card
**Elements:**
- Icon: 💰
- Label: "CREDITS"
- Value: "7/10" (current/total)
- CTA: "Buy More" button
- Progress bar

**Design:**
- Yellow accent
- Progress bar: Yellow fill
- Neubrutalist shadow

#### Generate Card
**Elements:**
- Icon: 📝
- Label: "GENERATE PROMPT"
- CTA: "Start" button (primary)
- Highlighted with yellow border

**Design:**
- Primary action card
- Larger, more prominent
- Glowing border

#### Saved Prompts Card
**Elements:**
- Icon: 💾
- Label: "SAVED PROMPTS"
- Value: "12" (count)
- CTA: "View 12" button

**Design:**
- Purple accent
- Shows count badge

### 5. Quick Actions Bar
**Elements:**
- Horizontal button group
- 3 primary actions

**Buttons:**
1. "🚀 Quick Generate" - Primary (yellow)
2. "🔍 Browse Examples" - Secondary
3. "📊 View Analytics" - Secondary

**Tech Noir Styling:**
- Neubrutalist buttons
- Shadow effects
- Hover lift

### 6. Recent Activity
**Elements:**
- Section header with "View All" link
- List of recent prompt generations

**Activity Item:**
```
[Icon] Title                                      Credits  Time
[📝] React Dashboard Generator                     3 cr    2h ago
```

**Features:**
- Hover: Highlight row
- Click: Navigate to prompt
- Time: Relative (2h ago, 1d ago)
- Icon: Based on prompt category

### 7. Usage Statistics (4-column)

#### Cards:
1. **Generated This Week:** 12 (↑ 40%)
2. **Tiers Used:** 3 ([View breakdown])
3. **Success Rate:** 85% (↑ 5%)
4. **Saved Prompts:** 28 (↑ 12%)

**Design:**
- Large number (32px)
- Label below
- Trend indicator (up/down arrow)
- Percentage or link

**Tech Noir Styling:**
- Yellow numbers
- Green for positive trends
- Subtle card borders

### 8. Recommended Prompts
**Elements:**
- Section header
- 3 prompt suggestion cards
- "Explore" link

**Card Content:**
- Category icon
- Title
- Tier + cost
- "Try Now" button

**Examples:**
- Full Stack App Builder (Expert • 2cr)
- UI Components Library (Advanced • 3cr)
- Security Best Practices (Basic • 5cr)

---

## User Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Navigate | Click sidebar item | Route to page |
| Quick Generate | Click "Start" or button | Navigate to generate page |
| Buy Credits | Click "Buy More" | Navigate to pricing |
| View Prompts | Click "View 12" | Navigate to My Prompts |
| View Activity | Click activity item | Navigate to prompt detail |
| View All Activity | Click "View All" | Full activity log page |
| Try Recommended | Click "Try Now" | Pre-fill generate form |
| Open User Menu | Click avatar | Dropdown with profile/logout |

---

## Mobile Responsive Notes

### Mobile Layout:
```
┌──────────────────────────┐
│  [LOGO]  [💰 7] [👤 ☰]  │
├──────────────────────────┤
│                          │
│  WELCOME BACK! 👋       │
│  7 credits remaining     │
│                          │
│  ┌──────────┬──────────┐ │
│  │  💰      │  📝      │ │
│  │ CREDITS  │ GENERATE │ │
│  │   7/10   │ [Start]  │ │
│  │[Buy More]│          │ │
│  └──────────┴──────────┘ │
│                          │
│  ┌──────────────────┐   │
│  │ 💾 SAVED PROMPTS │   │
│  │      12          │   │
│  │   [View All]     │   │
│  └──────────────────┘   │
│                          │
│  QUICK ACTIONS          │
│  [🚀] [🔍] [📊]         │
│                          │
│  RECENT ACTIVITY        │
│  [VIEW ALL →]           │
│                          │
│  ┌──────────────────┐   │
│  │ 📝 React Dash... │   │
│  │ 3cr • 2h ago     │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ 📝 API Auth...   │   │
│  │ 2cr • 5h ago     │   │
│  └──────────────────┘   │
│                          │
│  STATISTICS             │
│  ┌────┬────┬────┬────┐  │
│  │ 12 │ 3  │85% │ 28 │  │
│  └────┴────┴────┴────┘  │
│                          │
│  RECOMMENDED            │
│  [VIEW ALL →]           │
│                          │
│  ┌──────────────────┐   │
│  │ ⚡ Full Stack    │   │
│  │ Expert • 2cr     │   │
│  │    [Try]         │   │
│  └──────────────────┘   │
│                          │
└──────────────────────────┘
```

### Mobile Adjustments:
- Collapsible sidebar (hamburger menu)
- Cards stack vertically
- Stats in 2x2 grid
- Recent activity condensed
- Bottom navigation bar (optional)

---

## Tech Noir Theme References

### Color Usage:
```css
/* Dashboard specific colors */
--welcome-gradient: linear-gradient(135deg, #FFD700 0%, #A855F7 100%);
--credit-highlight: #FFD700;
--success-trend: #22C55E;
--card-bg: #1A1A1A;
--active-nav: rgba(255, 215, 0, 0.1);
```

### Glow Effects:
```css
/* Generate card glow */
.generate-card {
  border: 2px solid #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3),
              4px 4px 0px 0px #FFD700;
}

/* Welcome banner */
.welcome-banner {
  background: linear-gradient(135deg, 
    rgba(255, 215, 0, 0.1) 0%, 
    rgba(168, 85, 247, 0.1) 100%
  );
  border: 2px solid #FFD700;
}
```

### Typography Hierarchy:
```css
/* Welcome title */
.welcome-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
}

/* Stat numbers */
.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 700;
  color: #FFD700;
}

/* Card labels */
.card-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #A1A1AA;
}
```

---

## SVG Wireframe

```svg
<svg viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1400" height="900" fill="#0A0A0A"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="1400" height="60" fill="#1A1A1A" stroke="#333" stroke-width="1"/>
  <text x="40" y="38" fill="#FFD700" font-family="monospace" font-size="20" font-weight="bold">⚡ VIBE</text>
  <text x="600" y="38" fill="#A1A1AA" font-family="sans-serif" font-size="14">Home  Features  Pricing  Docs</text>
  <text x="1150" y="38" fill="#FFD700" font-family="sans-serif" font-size="16" font-weight="bold">💰 7</text>
  <text x="1220" y="38" fill="#FFFFFF" font-family="sans-serif" font-size="14">👤 Menu</text>
  
  <!-- Sidebar -->
  <rect x="0" y="60" width="240" height="840" fill="#141414" stroke="#333" stroke-width="1"/>
  <rect x="0" y="100" width="4" height="40" fill="#FFD700"/>
  <text x="20" y="128" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold">⚡ Overview</text>
  <text x="20" y="178" fill="#A1A1AA" font-family="sans-serif" font-size="14">📝 Generate</text>
  <text x="20" y="228" fill="#A1A1AA" font-family="sans-serif" font-size="14">💾 My Prompts</text>
  <text x="20" y="278" fill="#A1A1AA" font-family="sans-serif" font-size="14">🔍 Explore</text>
  <text x="20" y="328" fill="#A1A1AA" font-family="sans-serif" font-size="14">📊 Stats</text>
  <text x="20" y="378" fill="#A1A1AA" font-family="sans-serif" font-size="14">⚙️ Settings</text>
  <line x1="20" y1="420" x2="220" y2="420" stroke="#333" stroke-width="1"/>
  <text x="20" y="458" fill="#A1A1AA" font-family="sans-serif" font-size="14">❓ Help</text>
  <text x="20" y="508" fill="#A1A1AA" font-family="sans-serif" font-size="14">🚪 Logout</text>
  
  <!-- Welcome Banner -->
  <rect x="280" y="100" width="1080" height="100" fill="url(#welcomeGradient)" stroke="#FFD700" stroke-width="2" rx="12"/>
  <text x="320" y="145" fill="#FFFFFF" font-family="monospace" font-size="24" font-weight="bold">WELCOME BACK, JOHN! 👋</text>
  <text x="320" y="175" fill="#FFD700" font-family="sans-serif" font-size="16">You have 7 credits remaining</text>
  
  <!-- Quick Stats Cards -->
  <!-- Credits Card -->
  <rect x="280" y="230" width="330" height="150" fill="#1A1A1A" stroke="#FFD700" stroke-width="2" rx="12"/>
  <text x="445" y="280" fill="#FFD700" font-family="sans-serif" font-size="48" text-anchor="middle">💰</text>
  <text x="445" y="320" fill="#A1A1AA" font-family="sans-serif" font-size="12" text-anchor="middle">CREDITS</text>
  <text x="445" y="355" fill="#FFD700" font-family="monospace" font-size="32" font-weight="bold" text-anchor="middle">7/10</text>
  <rect x="360" y="370" width="170" height="36" fill="transparent" stroke="#FFD700" stroke-width="2" rx="6"/>
  <text x="445" y="393" fill="#FFD700" font-family="sans-serif" font-size="14" text-anchor="middle">Buy More</text>
  
  <!-- Generate Card -->
  <rect x="640" y="230" width="330" height="150" fill="#1A1A1A" stroke="#FFD700" stroke-width="3" rx="12"/>
  <rect x="640" y="230" width="330" height="150" fill="none" stroke="#FFD700" stroke-width="2" rx="12" opacity="0.5"/>
  <text x="805" y="280" fill="#FFD700" font-family="sans-serif" font-size="48" text-anchor="middle">📝</text>
  <text x="805" y="320" fill="#FFD700" font-family="sans-serif" font-size="12" text-anchor="middle">GENERATE PROMPT</text>
  <rect x="730" y="340" width="150" height="40" fill="#FFD700" stroke="#000" stroke-width="2" rx="6"/>
  <text x="805" y="367" fill="#0A0A0A" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Start →</text>
  
  <!-- Saved Card -->
  <rect x="1000" y="230" width="330" height="150" fill="#1A1A1A" stroke="#A855F7" stroke-width="2" rx="12"/>
  <text x="1165" y="280" fill="#A855F7" font-family="sans-serif" font-size="48" text-anchor="middle">💾</text>
  <text x="1165" y="320" fill="#A1A1AA" font-family="sans-serif" font-size="12" text-anchor="middle">SAVED PROMPTS</text>
  <text x="1165" y="355" fill="#FFFFFF" font-family="monospace" font-size="32" font-weight="bold" text-anchor="middle">12</text>
  <rect x="1080" y="370" width="170" height="36" fill="transparent" stroke="#A855F7" stroke-width="2" rx="6"/>
  <text x="1165" y="393" fill="#A855F7" font-family="sans-serif" font-size="14" text-anchor="middle">View All</text>
  
  <!-- Quick Actions -->
  <text x="280" y="430" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">QUICK ACTIONS</text>
  <rect x="280" y="450" width="1080" height="70" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="8"/>
  <rect x="320" y="465" width="180" height="40" fill="#FFD700" stroke="#000" stroke-width="2" rx="6"/>
  <text x="410" y="490" fill="#0A0A0A" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">🚀 Quick Generate</text>
  <rect x="520" y="465" width="180" height="40" fill="transparent" stroke="#A1A1AA" stroke-width="2" rx="6"/>
  <text x="610" y="490" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">🔍 Browse Examples</text>
  <rect x="720" y="465" width="180" height="40" fill="transparent" stroke="#A1A1AA" stroke-width="2" rx="6"/>
  <text x="810" y="490" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">📊 View Analytics</text>
  
  <!-- Recent Activity -->
  <text x="280" y="560" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">RECENT ACTIVITY</text>
  <text x="1280" y="560" fill="#FFD700" font-family="sans-serif" font-size="14">VIEW ALL →</text>
  <rect x="280" y="580" width="1080" height="160" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="320" y="620" fill="#FFFFFF" font-family="sans-serif" font-size="14">📝 React Dashboard Generator</text>
  <text x="1050" y="620" fill="#FFD700" font-family="sans-serif" font-size="14">3 credits</text>
  <text x="1200" y="620" fill="#666" font-family="sans-serif" font-size="14">2h ago</text>
  <line x1="320" y1="635" x2="1240" y2="635" stroke="#333" stroke-width="1"/>
  <text x="320" y="665" fill="#FFFFFF" font-family="sans-serif" font-size="14">📝 API Authentication Setup</text>
  <text x="1050" y="665" fill="#FFD700" font-family="sans-serif" font-size="14">2 credits</text>
  <text x="1200" y="665" fill="#666" font-family="sans-serif" font-size="14">5h ago</text>
  <line x1="320" y1="680" x2="1240" y2="680" stroke="#333" stroke-width="1"/>
  <text x="320" y="710" fill="#FFFFFF" font-family="sans-serif" font-size="14">📝 Database Schema Design</text>
  <text x="1050" y="710" fill="#FFD700" font-family="sans-serif" font-size="14">3 credits</text>
  <text x="1200" y="710" fill="#666" font-family="sans-serif" font-size="14">1d ago</text>
  
  <!-- Statistics -->
  <text x="280" y="780" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">USAGE STATISTICS</text>
  <rect x="280" y="800" width="240" height="80" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="400" y="840" fill="#FFD700" font-family="monospace" font-size="28" font-weight="bold" text-anchor="middle">12</text>
  <text x="400" y="860" fill="#A1A1AA" font-family="sans-serif" font-size="12" text-anchor="middle">Generated This Week</text>
  <text x="400" y="875" fill="#22C55E" font-family="sans-serif" font-size="10" text-anchor="middle">↑ 40%</text>
  
  <!-- Gradient Definition -->
  <defs>
    <linearGradient id="welcomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,215,0,0.1)"/>
      <stop offset="100%" style="stop-color:rgba(168,85,247,0.1)"/>
    </linearGradient>
  </defs>
</svg>
```

---

## Implementation Notes

### Data Requirements:
```typescript
interface DashboardData {
  user: {
    name: string;
    credits: number;
    totalCredits: number;
    lastLogin: Date;
  };
  stats: {
    generatedThisWeek: number;
    generatedTrend: number;
    tiersUsed: number;
    successRate: number;
    successTrend: number;
    savedPrompts: number;
    savedTrend: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    credits: number;
    createdAt: Date;
    category: string;
  }>;
  recommendedPrompts: Array<{
    id: string;
    title: string;
    tier: 'basic' | 'advanced' | 'expert';
    category: string;
  }>;
}
```

### Supabase Queries:
```typescript
// Get user profile with credits
const { data: profile } = await supabase
  .from('profiles')
  .select('username, credits, tier')
  .eq('id', user.id)
  .single()

// Get recent activity
const { data: activity } = await supabase
  .from('prompts')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .limit(5)

// Get generation stats (use request_log table)
const { data: stats } = await supabase
  .from('request_log')
  .select('tier, created_at')
  .eq('user_id', user.id)
  .gte('created_at', oneWeekAgo)
```

### Real-time Updates:
```typescript
// Subscribe to credit changes
supabase
  .channel('credit_updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'profiles',
    filter: `id=eq.${user.id}`
  }, (payload) => {
    updateCredits(payload.new.credits)
  })
  .subscribe()
```

---

*Last Updated: 2024*
*Theme: Tech Noir*
*Status: Ready for Implementation*
