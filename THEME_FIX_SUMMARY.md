# Theme Fix Summary

## Issues Found: 79 instances of incorrect colors

### Critical Problems:
1. **Using `neutral-800/900` instead of `noir-dark`**
2. **Using `neutral-400/500/600` instead of Tech Noir text colors**
3. **MyPromptsPage has theme switching (should always be dark)**
4. **Inconsistent background colors across pages**

### Color Mapping Fix:

| Wrong (Current) | Correct (Wireframe) |
|----------------|---------------------|
| `bg-neutral-900` | `bg-noir-dark` (#1A1A1A) |
| `bg-neutral-800` | `bg-noir-black` (#0A0A0A) |
| `border-neutral-800` | `border-noir-gray` (#333333) |
| `border-neutral-700` | `border-noir-gray/50` |
| `text-neutral-400` | `text-neutral-400` (OK - keep) |
| `text-neutral-500` | `text-neutral-500` (OK - keep) |
| `text-neutral-300` | `text-white` |
| `bg-neutral-900/80` | `bg-noir-dark` |
| `bg-neutral-800/50` | `bg-noir-dark/50` |

### Files to Fix:
1. ✅ GeneratePromptPageSecure.tsx - FIXED
2. ⚠️ LoginPage.tsx - NEEDS FIX
3. ⚠️ SignupPage.tsx - NEEDS FIX
4. ⚠️ DashboardPage.tsx - NEEDS FIX
5. ⚠️ MyPromptsPage.tsx - NEEDS FIX (remove theme switching)
6. ⚠️ SettingsPage.tsx - NEEDS FIX
7. ⚠️ ForgotPasswordPage.tsx - NEEDS FIX

### Hero.tsx Status:
- ✅ Uses correct `bg-[#0a0a0a]`
- ✅ Uses `border-neutral-800` (acceptable)
- ✅ Uses correct `text-noir-yellow`
- Mostly good, minor inconsistencies

## Recommended Action:

Run a global find-and-replace in your code editor:

1. Replace `bg-neutral-900` with `bg-noir-dark`
2. Replace `bg-neutral-800` with `bg-noir-black`
3. Replace `border-neutral-800` with `border-noir-gray`
4. Replace `border-neutral-700` with `border-noir-gray/50`
5. In MyPromptsPage.tsx: Remove all theme conditionals and use dark theme only

Or I can fix each file individually - let me know which approach you prefer!
