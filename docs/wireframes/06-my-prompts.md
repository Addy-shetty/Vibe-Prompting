# Wireframe: My Prompts Page

## Overview
User's personal library of saved prompts. Grid/list view with search, filter, and management features. Clean, organized interface for prompt organization.

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]      Home  Features  Pricing  Docs              [💰 7] [👤 Menu]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │  SIDENAV     │    MY PROMPTS                           [+ NEW PROMPT] │
│  │              │                                                           │
│  │  [⚡] Overview│    ┌──────────────────────────────────────────────────┐  │
│  │  [📝] Generate│    │                                                  │  │
│  │  [💾] My      │    │  🔍 Search your saved prompts...                │  │
│  │      Prompts  │    │                                                  │  │
│  │      (active) │    └──────────────────────────────────────────────────┘  │
│  │  [🔍] Explore │                                                          │
│  │  [📊] Stats   │    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │  [⚙️] Settings│    │[All ▼] │ │[Date ▼]│ │[Grid ▮]│ │[List ☰]│        │
│  │              │    │12 items│ │Newest  │ │active  │ │        │        │
│  └──────────────┘    └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                                            │
│                      ┌──────────────────────────────────────────────────┐  │
│                      │                                                  │  │
│                      │  📝 React Dashboard Generator                    │  │
│                      │                                                  │  │
│  NO SAVED PROMPTS   │  ┌────────────────────────────────────────────┐  │  │
│  (empty state)      │  │ # React Dashboard Application               │  │  │
│                     │  │                                             │  │  │
│  [Illustration]     │  │ ## Objective                                │  │  │
│                     │  │ Build a comprehensive React dashboard...    │  │  │
│  You haven't saved  │  │                                             │  │  │
│  any prompts yet.   │  │ ## Tech Stack                               │  │  │
│                     │  │ - React 18 with TypeScript                  │  │  │
│  Generate your      │  │ - Recharts for data visualization           │  │  │
│  first prompt to    │  │ - Tailwind CSS for styling                  │  │  │
│  see it here!       │  │                                             │  │  │
│                     │  └────────────────────────────────────────────┘  │  │
│     [⚡ GENERATE]   │                                                  │  │
│                     │  🏷️ Frontend  🏷️ React  🏷️ Dashboard            │  │
│                     │  📅 Dec 15, 2024  •  3 credits  •  ADVANCED     │  │
│                     │                                                  │  │
│                     │  [👁 VIEW]  [📋 COPY]  [✏️ EDIT]  [🗑️ DELETE]   │  │
│                     │                                                  │  │
│                     └──────────────────────────────────────────────────┘  │
│                                                                            │
│                      ┌──────────────────────────────────────────────────┐  │
│                      │                                                  │  │
│                      │  📝 API Authentication Setup                     │  │
│                      │                                                  │  │
│                      │  ┌────────────────────────────────────────────┐  │  │
│                      │  │ # Secure API Authentication System          │  │  │
│                      │  │                                             │  │  │
│                      │  │ ## Overview                                 │  │  │
│                      │  │ Implement JWT-based authentication...       │  │  │
│                      │  │                                             │  │  │
│                      │  └────────────────────────────────────────────┘  │  │
│                      │                                                  │  │
│                      │  🏷️ Backend  🏷️ Security  🏷️ API               │  │
│                      │  📅 Dec 14, 2024  •  2 credits  •  EXPERT       │  │
│                      │                                                  │  │
│                      │  [👁 VIEW]  [📋 COPY]  [✏️ EDIT]  [🗑️ DELETE]   │  │
│                      │                                                  │  │
│                      └──────────────────────────────────────────────────┘  │
│                                                                            │
│                      ┌──────────────────────────────────────────────────┐  │
│                      │                                                  │  │
│                      │  📝 Database Schema Design Guide                 │  │
│                      │                                                  │  │
│                      │  ┌────────────────────────────────────────────┐  │  │
│                      │  │ # PostgreSQL Database Schema                │  │  │
│                      │  │                                             │  │  │
│                      │  │ ## Schema Overview                          │  │  │
│                      │  │ Design a scalable database schema...        │  │  │
│                      │  │                                             │  │  │
│                      │  └────────────────────────────────────────────┘  │  │
│                      │                                                  │  │
│                      │  🏷️ Database  🏷️ PostgreSQL  🏷️ Schema         │  │
│                      │  📅 Dec 12, 2024  •  3 credits  •  ADVANCED     │  │
│                      │                                                  │  │
│                      │  [👁 VIEW]  [📋 COPY]  [✏️ EDIT]  [🗑️ DELETE]   │  │
│                      │                                                  │  │
│                      └──────────────────────────────────────────────────┘  │
│                                                                            │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  PAGINATION                                                                │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  [← Previous]    1  2  3  ...  12    [Next →]                       │  │
│  │                                                                      │  │
│  │  Showing 1-3 of 34 prompts                                          │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Header Section

#### Title + Action
**Elements:**
- Page title: "MY PROMPTS"
- "+ NEW PROMPT" button (primary CTA)

**Button Design:**
- Yellow background
- Black border
- Shadow offset
- Plus icon

### 2. Search Bar
**Design:**
- Full width
- Search icon (🔍)
- Placeholder: "Search your saved prompts..."
- Clear button (X) when text entered
- Real-time filtering

**Tech Noir Styling:**
```css
.search-bar {
  background: #0A0A0A;
  border: 2px solid #333;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-bar:focus-within {
  border-color: #FFD700;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1);
}

.search-icon {
  color: #666;
  font-size: 20px;
}

.search-input {
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 16px;
  flex: 1;
}
```

### 3. Filter Bar
**Elements (4 items):**

#### Category Filter
```
┌────────────────┐
│ [All ▼]        │
│ 12 items       │
└────────────────┘
```
- Dropdown with categories
- Shows item count

#### Sort Dropdown
```
┌────────────────┐
│ [Date ▼]       │
│ Newest first   │
└────────────────┘
```
- Options: Newest, Oldest, A-Z, Z-A

#### View Toggle
```
┌──────┬──────┐
│ ▮▮▮  │ ☰☰☰ │
│ Grid │ List │
└──────┴──────┘
```
- Grid view (default)
- List view

### 4. Prompt Cards (Grid View)

#### Card Structure:
```
┌─────────────────────────────────────────┐
│                                         │
│  📝 Title                               │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Preview (first 5 lines)           │ │
│  │ ...                               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  🏷️ Tag1  🏷️ Tag2  🏷️ Tag3              │
│  📅 Date  •  X credits  •  TIER        │
│                                         │
│  [VIEW] [COPY] [EDIT] [DELETE]         │
│                                         │
└─────────────────────────────────────────┘
```

#### Card Elements:

**Header:**
- Icon: 📝 (or category-specific)
- Title: Prompt title (truncated if long)

**Preview:**
- Dark background (#0A0A0A)
- First 5 lines of prompt
- Monospace font
- Fade out at bottom

**Tags:**
- Max 3 displayed
- Format: 🏷️ tag-name
- Yellow hashtag symbol
- Clickable (filter by tag)

**Metadata:**
- Date: Relative (Dec 15, 2024)
- Credits used
- Tier badge (colored)

**Actions:**
- 👁 VIEW - Full view modal
- 📋 COPY - Copy to clipboard
- ✏️ EDIT - Edit title/tags
- 🗑️ DELETE - With confirmation

**Tier Badges:**
```css
.tier-badge.basic {
  background: rgba(59, 130, 246, 0.2);
  color: #60A5FA;
  border: 1px solid #3B82F6;
}

.tier-badge.advanced {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border: 1px solid #FFD700;
}

.tier-badge.expert {
  background: rgba(168, 85, 247, 0.2);
  color: #A855F7;
  border: 1px solid #A855F7;
}
```

### 5. List View (Alternative)

#### Row Structure:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📝 │ Title                    │ Tags         │ Date    │ Tier     │ Actions│
├─────────────────────────────────────────────────────────────────────────────┤
│ 📝 │ React Dashboard          │ Frontend,    │ Dec 15  │ ADVANCED │👁 📋 ✏️🗑️│
│    │ Generator                │ React        │         │          │        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📝 │ API Authentication       │ Backend,     │ Dec 14  │ EXPERT   │👁 📋 ✏️🗑️│
│    │ Setup                    │ Security     │         │          │        │
└─────────────────────────────────────────────────────────────────────────────┘
```

**List View Columns:**
1. Icon (40px)
2. Title + Preview (flex)
3. Tags (200px)
4. Date (100px)
5. Tier (100px)
6. Actions (160px)

### 6. Empty State

**When no prompts saved:**
```
┌─────────────────────────────────────────┐
│                                         │
│           [Illustration]                │
│                                         │
│      You haven't saved any              │
│         prompts yet.                    │
│                                         │
│    Generate your first prompt           │
│      to see it here!                    │
│                                         │
│      [⚡ GENERATE PROMPT]               │
│                                         │
└─────────────────────────────────────────┘
```

**Design:**
- Centered content
- Large illustration (optional)
- Friendly message
- Clear CTA button

### 7. Pagination

**Elements:**
- Previous/Next buttons
- Page numbers
- Ellipsis for many pages
- "Showing X-Y of Z prompts"

**Design:**
```
[← Previous]   1  2  3  ...  12   [Next →]

Showing 1-3 of 34 prompts
```

**Active State:**
- Current page: Yellow background
- Other pages: Gray
- Disabled: Opacity 0.3

---

## User Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Search | Type in search | Filter prompts in real-time |
| Filter Category | Select from dropdown | Show only selected category |
| Sort | Select sort option | Reorder prompts |
| Toggle View | Click grid/list | Switch layout |
| View Prompt | Click VIEW button | Open modal with full content |
| Copy Prompt | Click COPY button | Copy to clipboard + toast |
| Edit Prompt | Click EDIT button | Open edit modal |
| Delete Prompt | Click DELETE button | Show confirmation dialog |
| Create New | Click NEW PROMPT | Navigate to generate page |
| Click Tag | Click tag chip | Filter by that tag |
| Paginate | Click page number | Load more prompts |

---

## Mobile Responsive Notes

### Mobile Layout:
```
┌──────────────────────────┐
│  [LOGO]  [💰 7] [👤 ☰]  │
├──────────────────────────┤
│                          │
│  MY PROMPTS   [+ NEW]   │
│                          │
│  ┌──────────────────┐   │
│  │ 🔍 Search...     │   │
│  └──────────────────┘   │
│                          │
│  [All ▼]  [Date ▼] [▮]  │
│                          │
│  ┌──────────────────┐   │
│  │ 📝 React Dash... │   │
│  │                  │   │
│  │ ┌──────────────┐ │   │
│  │ │ Preview...   │ │   │
│  │ └──────────────┘ │   │
│  │                  │   │
│  │ 🏷️ Frontend     │   │
│  │ Dec 15 • 3cr    │   │
│  │ ADVANCED        │   │
│  │                  │   │
│  │ [👁] [📋] [✏️] [🗑️]│   │
│  └──────────────────┘   │
│                          │
│  ┌──────────────────┐   │
│  │ 📝 API Auth...   │   │
│  │ ...              │   │
│  └──────────────────┘   │
│                          │
│  ┌──────────────────┐   │
│  │ 📝 Database...   │   │
│  │ ...              │   │
│  └──────────────────┘   │
│                          │
│  ←  1  2  3  ...  →     │
│                          │
└──────────────────────────┘
```

### Mobile Adjustments:
- Single column cards
- Horizontal scroll for filters
- Stacked action buttons
- Full-width modals
- Swipe to delete (optional)

---

## Modals

### View Modal
```
┌─────────────────────────────────────────┐
│  📝 React Dashboard Generator      [✕]  │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Full prompt content here...       │ │
│  │                                   │ │
│  │ # React Dashboard Application     │ │
│  │ ...                               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Tags: 🏷️ Frontend 🏷️ React            │
│  Created: Dec 15, 2024 • 3 credits     │
│                                         │
│  [📋 COPY]  [✏️ EDIT]  [🗑️ DELETE]    │
│                                         │
└─────────────────────────────────────────┘
```

### Edit Modal
```
┌─────────────────────────────────────────┐
│  ✏️ Edit Prompt                    [✕]  │
├─────────────────────────────────────────┤
│                                         │
│  Title:                                 │
│  ┌───────────────────────────────────┐ │
│  │ React Dashboard Generator         │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Tags:                                  │
│  ┌───────────────────────────────────┐ │
│  │ frontend react dashboard [+ Add]  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [CANCEL]              [SAVE CHANGES]   │
│                                         │
└─────────────────────────────────────────┘
```

### Delete Confirmation
```
┌─────────────────────────────────────────┐
│  🗑️ Delete Prompt?                 [✕]  │
├─────────────────────────────────────────┤
│                                         │
│  Are you sure you want to delete:       │
│                                         │
│  "React Dashboard Generator"            │
│                                         │
│  This action cannot be undone.          │
│                                         │
│  [CANCEL]              [DELETE]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Tech Noir Theme References

### Card Styling:
```css
.prompt-card {
  background: #1A1A1A;
  border: 2px solid #333;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s;
}

.prompt-card:hover {
  transform: translateY(-4px);
  border-color: #FFD700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.prompt-preview {
  background: #0A0A0A;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #A1A1AA;
  max-height: 120px;
  overflow: hidden;
  position: relative;
}

.prompt-preview::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(transparent, #0A0A0A);
}
```

### Tag Styling:
```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  font-size: 12px;
  color: #FFD700;
}

.tag::before {
  content: '🏷️';
  font-size: 10px;
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
  
  <!-- Sidebar -->
  <rect x="0" y="60" width="240" height="840" fill="#141414" stroke="#333" stroke-width="1"/>
  <text x="20" y="128" fill="#A1A1AA" font-family="sans-serif" font-size="14">⚡ Overview</text>
  <text x="20" y="178" fill="#A1A1AA" font-family="sans-serif" font-size="14">📝 Generate</text>
  <rect x="0" y="190" width="4" height="40" fill="#FFD700"/>
  <text x="20" y="218" fill="#FFD700" font-family="sans-serif" font-size="14" font-weight="bold">💾 My Prompts</text>
  <text x="20" y="268" fill="#A1A1AA" font-family="sans-serif" font-size="14">🔍 Explore</text>
  
  <!-- Page Title -->
  <text x="280" y="110" fill="#FFFFFF" font-family="sans-serif" font-size="24" font-weight="bold">MY PROMPTS</text>
  <rect x="1180" y="85" width="180" height="40" fill="#FFD700" stroke="#000" stroke-width="2" rx="6"/>
  <text x="1270" y="110" fill="#0A0A0A" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">+ NEW PROMPT</text>
  
  <!-- Search Bar -->
  <rect x="280" y="140" width="1080" height="60" fill="#0A0A0A" stroke="#333" stroke-width="2" rx="8"/>
  <text x="310" y="178" fill="#666" font-family="sans-serif" font-size="18">🔍 Search your saved prompts...</text>
  
  <!-- Filters -->
  <rect x="280" y="220" width="100" height="50" fill="#1A1A1A" stroke="#333" stroke-width="1" rx="6"/>
  <text x="310" y="240" fill="#FFFFFF" font-family="sans-serif" font-size="12">[All ▼]</text>
  <text x="310" y="258" fill="#666" font-family="sans-serif" font-size="10">12 items</text>
  
  <rect x="390" y="220" width="100" height="50" fill="#1A1A1A" stroke="#333" stroke-width="1" rx="6"/>
  <text x="420" y="240" fill="#FFFFFF" font-family="sans-serif" font-size="12">[Date ▼]</text>
  <text x="420" y="258" fill="#666" font-family="sans-serif" font-size="10">Newest</text>
  
  <!-- Prompt Card 1 -->
  <rect x="280" y="290" width="520" height="380" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="12"/>
  <text x="310" y="330" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">📝 React Dashboard Generator</text>
  <rect x="310" y="350" width="460" height="160" fill="#0A0A0A" stroke="#333" stroke-width="1" rx="8"/>
  <text x="330" y="380" fill="#FFD700" font-family="monospace" font-size="12"># React Dashboard Application</text>
  <text x="330" y="410" fill="#A855F7" font-family="monospace" font-size="11">## Objective</text>
  <text x="330" y="435" fill="#A1A1AA" font-family="monospace" font-size="11">Build a comprehensive React dashboard...</text>
  <text x="330" y="460" fill="#A855F7" font-family="monospace" font-size="11">## Tech Stack</text>
  <text x="330" y="485" fill="#A1A1AA" font-family="monospace" font-size="11">- React 18 with TypeScript</text>
  
  <!-- Tags -->
  <rect x="310" y="530" width="90" height="28" fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.3)" stroke-width="1" rx="14"/>
  <text x="330" y="548" fill="#FFD700" font-family="sans-serif" font-size="11">🏷️ Frontend</text>
  <rect x="410" y="530" width="80" height="28" fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.3)" stroke-width="1" rx="14"/>
  <text x="425" y="548" fill="#FFD700" font-family="sans-serif" font-size="11">🏷️ React</text>
  <rect x="500" y="530" width="100" height="28" fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.3)" stroke-width="1" rx="14"/>
  <text x="515" y="548" fill="#FFD700" font-family="sans-serif" font-size="11">🏷️ Dashboard</text>
  
  <!-- Metadata -->
  <text x="310" y="580" fill="#666" font-family="sans-serif" font-size="12">📅 Dec 15, 2024  •  3 credits  •  </text>
  <text x="545" y="580" fill="#FFD700" font-family="sans-serif" font-size="12" font-weight="bold">ADVANCED</text>
  
  <!-- Actions -->
  <rect x="310" y="610" width="80" height="36" fill="transparent" stroke="#333" stroke-width="1" rx="6"/>
  <text x="350" y="632" fill="#FFFFFF" font-family="sans-serif" font-size="12" text-anchor="middle">👁 VIEW</text>
  <rect x="400" y="610" width="80" height="36" fill="transparent" stroke="#333" stroke-width="1" rx="6"/>
  <text x="440" y="632" fill="#FFFFFF" font-family="sans-serif" font-size="12" text-anchor="middle">📋 COPY</text>
  <rect x="490" y="610" width="80" height="36" fill="transparent" stroke="#333" stroke-width="1" rx="6"/>
  <text x="530" y="632" fill="#FFFFFF" font-family="sans-serif" font-size="12" text-anchor="middle">✏️ EDIT</text>
  <rect x="580" y="610" width="80" height="36" fill="transparent" stroke="#333" stroke-width="1" rx="6"/>
  <text x="620" y="632" fill="#FFFFFF" font-family="sans-serif" font-size="12" text-anchor="middle">🗑️ DELETE</text>
  
  <!-- Prompt Card 2 -->
  <rect x="820" y="290" width="520" height="380" fill="#1A1A1A" stroke="#333" stroke-width="2" rx="12"/>
  <text x="850" y="330" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">📝 API Authentication Setup</text>
  <rect x="850" y="350" width="460" height="160" fill="#0A0A0A" stroke="#333" stroke-width="1" rx="8"/>
  <text x="870" y="380" fill="#FFD700" font-family="monospace" font-size="12"># Secure API Authentication</text>
  <text x="870" y="410" fill="#A855F7" font-family="monospace" font-size="11">## Overview</text>
  <text x="870" y="435" fill="#A1A1AA" font-family="monospace" font-size="11">Implement JWT-based authentication...</text>
  
  <!-- Pagination -->
  <rect x="500" y="700" width="100" height="40" fill="transparent" stroke="#333" stroke-width="1" rx="6"/>
  <text x="550" y="725" fill="#666" font-family="sans-serif" font-size="14" text-anchor="middle">← Previous</text>
  <rect x="620" y="700" width="40" height="40" fill="#FFD700" stroke="#000" stroke-width="1" rx="6"/>
  <text x="640" y="725" fill="#0A0A0A" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">1</text>
  <rect x="670" y="700" width="40" height="40" fill="transparent" stroke="#333" stroke-width="1" rx="6"/>
  <text x="690" y="725" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">2</text>
  <rect x="720" y="700" width="40" height="40" fill="transparent" stroke="#333" stroke-width="1" rx="6"/>
  <text x="740" y="725" fill="#A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">3</text>
  <text x="780" y="725" fill="#666" font-family="sans-serif" font-size="14">...</text>
  <rect x="820" y="700" width="100" height="40" fill="transparent" stroke="#333" stroke-width="1" rx="6"/>
  <text x="870" y="725" fill="#666" font-family="sans-serif" font-size="14" text-anchor="middle">Next →</text>
</svg>
```

---

## Implementation Notes

### Data Structure:
```typescript
interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  tier: 'basic' | 'advanced' | 'expert';
  creditsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Supabase Queries:
```typescript
// Get user's prompts
const { data: prompts, error } = await supabase
  .from('prompts')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .range(from, to)

// Search prompts
const { data: results } = await supabase
  .from('prompts')
  .select('*')
  .eq('user_id', user.id)
  .or(`title.ilike.%${query}%,content.ilike.%${query}%`)

// Delete prompt
const { error } = await supabase
  .from('prompts')
  .delete()
  .eq('id', promptId)
  .eq('user_id', user.id)
```

### Filter Logic:
```typescript
const filterPrompts = (
  prompts: SavedPrompt[],
  filters: {
    search: string;
    category: string;
    sortBy: 'date' | 'name';
    sortOrder: 'asc' | 'desc';
  }
) => {
  return prompts
    .filter(p => 
      p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.content.toLowerCase().includes(filters.search.toLowerCase())
    )
    .filter(p => 
      filters.category === 'all' || p.category === filters.category
    )
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortOrder === 'desc' 
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return filters.sortOrder === 'desc'
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    });
};
```

---

*Last Updated: 2024*
*Theme: Tech Noir*
*Status: Ready for Implementation*
