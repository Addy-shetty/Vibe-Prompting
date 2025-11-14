# 🎯 Awesome ChatGPT Prompts for Vibe

## Quick Setup Guide

### Step 1: Get Your User ID
1. Open Supabase Dashboard → SQL Editor
2. Run this query:
```sql
SELECT id, username FROM public.profiles ORDER BY created_at DESC LIMIT 5;
```
3. Copy your `id` (UUID format like `780715f6-...`)

### Step 2: Insert Prompts
1. Open `insert_awesome_prompts.sql` in Supabase SQL Editor
2. Find this line near the top:
```sql
v_user_id UUID := 'YOUR_USER_ID_HERE'; -- ⚠️ REPLACE THIS!
```
3. Replace `'YOUR_USER_ID_HERE'` with your actual user ID
4. Run the entire script
5. You should see: `✅ Successfully inserted 28 awesome prompts!`

### Step 3: View Your Prompts
Go to your app at `http://localhost:5173/prompts` and you'll see all the new prompts!

---

## 📚 Prompts Included (28 Total)

### Frontend Development (12 prompts)
- ✈️ Multiplayer 3D Plane Game
- ✅ Todo List Application
- 🌤️ Weather Dashboard
- 🔢 Scientific Calculator
- 📝 Markdown Notes App
- ⏱️ Pomodoro Timer
- 🏎️ 3D Racing Game
- ♟️ Chess Game
- 🎮 Sudoku Game
- 🃏 Memory Card Game
- 🎵 Music Player
- 🎨 Drawing App
- 🖼️ Image Editor
- 📄 PDF Viewer

### Full Stack (7 prompts)
- 📊 Interactive Quiz Application
- 🍕 Recipe Finder Application
- 💰 Budget Tracker
- 📋 Kanban Board
- 📈 Habit Tracker
- 🎴 Flashcard Study System
- 🧘 Meditation Timer

### Tools & Utilities (5 prompts)
- 🎨 Advanced Color Picker Tool
- 🔐 Secure Password Generator
- 🔒 File Encryption Tool
- 📝 Code Snippet Manager
- 📊 Text Analyzer Tool
- ⌨️ Typing Speed Test

### API Integration (2 prompts)
- 💱 Currency Exchange Calculator
- 🔗 URL Shortener

### Security (2 prompts)
- 🔐 Secure Password Generator
- 🔒 File Encryption Tool

---

## 🎯 Features

All prompts are:
- ✅ **Public** - Visible to all users in the gallery
- ✅ **Developer-focused** - Perfect for vibe coders
- ✅ **Detailed** - Include specific technical requirements
- ✅ **Actionable** - Ready to use with AI coding assistants
- ✅ **Categorized** - Organized by development area

---

## 🚀 What's Next?

After inserting these prompts:

1. **Browse Gallery** - View all public prompts at `/prompts`
2. **Try One** - Click a prompt and generate with AI
3. **Create Your Own** - Add custom prompts at `/generate`
4. **Share** - All these prompts are public for the community

---

## 📝 Source

These prompts are curated from [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) and adapted for developer use cases.

---

## 🔧 Troubleshooting

**Problem**: "No prompts showing"
- **Solution**: Make sure you replaced `YOUR_USER_ID_HERE` with your actual UUID

**Problem**: "Error inserting prompts"
- **Solution**: Check that you ran `001_profiles.sql` and `002_prompts.sql` first

**Problem**: "Prompts showing but can't edit"
- **Solution**: You can only edit prompts you created. These are public examples.

---

**Enjoy building with these awesome prompts!** 🎉
