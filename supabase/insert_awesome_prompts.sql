-- =============================================
-- HELPER: Get Your User ID and Insert Prompts
-- Run this in Supabase SQL Editor
-- =============================================

-- Step 1: Find your user ID
SELECT 
    id as user_id, 
    username,
    created_at
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Copy your user_id from the results above, then run the commands below
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID

-- Step 2: Insert all awesome prompts
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user ID before running!

DO $$
DECLARE
    v_user_id UUID := 'YOUR_USER_ID_HERE'; -- ⚠️ REPLACE THIS!
BEGIN
    -- Frontend Development Prompts
    INSERT INTO public.prompts (user_id, title, content, category, is_public, created_at) VALUES
    (v_user_id, 'Multiplayer 3D Plane Game', 'Create an immersive multiplayer airplane combat game using Three.js, HTML5, CSS3, and JavaScript with WebSocket for real-time networking. Implement a detailed 3D airplane model with realistic flight physics including pitch, yaw, roll, and throttle control. Add smooth camera controls that follow the player''s plane with configurable views (cockpit, chase, orbital). Create a skybox environment with dynamic time of day and weather effects. Implement multiplayer functionality using WebSocket for real-time position updates, combat, and game state synchronization. Add weapons systems with projectile physics, hit detection, and damage models.', 'Frontend', true, NOW()),
    (v_user_id, 'Todo List Application', 'Create a responsive todo app with HTML5, CSS3 and vanilla JavaScript. The app should have a modern, clean UI using CSS Grid/Flexbox with intuitive controls. Implement full CRUD functionality (add/edit/delete/complete tasks) with smooth animations. Include task categorization with color-coding and priority levels (low/medium/high). Add due dates with a date-picker component and reminder notifications. Use localStorage for data persistence between sessions.', 'Frontend', true, NOW()),
    (v_user_id, 'Weather Dashboard', 'Build a comprehensive weather dashboard using HTML5, CSS3, JavaScript and the OpenWeatherMap API. Create a visually appealing interface showing current weather conditions with appropriate icons and background changes based on weather/time of day. Display a detailed 5-day forecast with expandable hourly breakdown for each day. Implement location search with autocomplete and history, supporting both city names and coordinates.', 'Frontend', true, NOW()),
    (v_user_id, 'Scientific Calculator', 'Create a comprehensive scientific calculator with HTML5, CSS3 and JavaScript that mimics professional calculators. Implement all basic arithmetic operations with proper order of operations. Include advanced scientific functions (trigonometric, logarithmic, exponential, statistical) with degree/radian toggle. Add memory operations (M+, M-, MR, MC) with visual indicators.', 'Frontend', true, NOW()),
    (v_user_id, 'Markdown Notes App', 'Build a feature-rich markdown notes application with HTML5, CSS3 and JavaScript. Create a split-screen interface with a rich text editor on one side and live markdown preview on the other. Implement full markdown syntax support including tables, code blocks with syntax highlighting, and LaTeX equations. Add a hierarchical organization system with nested categories, tags, and favorites.', 'Frontend', true, NOW()),
    (v_user_id, 'Pomodoro Timer', 'Create a comprehensive pomodoro timer app using HTML5, CSS3 and JavaScript following the time management technique. Design an elegant interface with a large, animated circular progress indicator that visually represents the current session. Allow customization of work intervals (default 25min), short breaks (default 5min), and long breaks (default 15min).', 'Frontend', true, NOW()),
    
    -- Full Stack & API
    (v_user_id, 'Interactive Quiz Application', 'Develop a comprehensive interactive quiz application with HTML5, CSS3 and JavaScript. Create an engaging UI with smooth transitions between questions. Support multiple question types including multiple choice, true/false, matching, and short answer with automatic grading. Implement configurable timers per question with visual countdown.', 'Full Stack', true, NOW()),
    (v_user_id, 'Currency Exchange Calculator', 'Develop a comprehensive currency converter using HTML5, CSS3, JavaScript and a reliable Exchange Rate API. Create a clean, intuitive interface with prominent input fields and currency selectors. Implement real-time exchange rates with timestamp indicators showing data freshness. Support 170+ global currencies including crypto.', 'API Integration', true, NOW()),
    (v_user_id, 'Recipe Finder Application', 'Create a recipe finder application using HTML5, CSS3, JavaScript and a food API. Build a visually appealing interface with food photography and intuitive navigation. Implement advanced search with filtering by ingredients, cuisine, diet restrictions, and preparation time. Add user ratings and reviews with star system.', 'Full Stack', true, NOW()),
    
    -- Tools & Utilities
    (v_user_id, 'Advanced Color Picker Tool', 'Build a professional-grade color tool with HTML5, CSS3 and JavaScript for designers and developers. Create an intuitive interface with multiple selection methods including eyedropper, color wheel, sliders, and input fields. Implement real-time conversion between color formats (RGB, RGBA, HSL, HSLA, HEX, CMYK) with copy functionality.', 'Tools', true, NOW()),
    (v_user_id, 'Secure Password Generator', 'Create a comprehensive secure password generator using HTML5, CSS3 and JavaScript with cryptographically strong randomness. Build an intuitive interface with real-time password preview. Allow customization of password length with presets for different security levels. Include toggles for character types with visual indicators.', 'Security', true, NOW()),
    (v_user_id, 'File Encryption Tool', 'Create a client-side file encryption tool using HTML5, CSS3, and JavaScript with the Web Crypto API. Build a drag-and-drop interface for file selection with progress indicators. Implement AES-256-GCM encryption with secure key derivation from passwords (PBKDF2). Add support for encrypting multiple files simultaneously.', 'Security', true, NOW()),
    (v_user_id, 'Code Snippet Manager', 'Build a developer-focused code snippet manager using HTML5, CSS3, and JavaScript. Create a clean IDE-like interface with syntax highlighting for 30+ programming languages. Implement a tagging and categorization system for organizing snippets. Add a powerful search function with support for regex.', 'Tools', true, NOW()),
    (v_user_id, 'Text Analyzer Tool', 'Build a comprehensive text analysis tool using HTML5, CSS3, and JavaScript. Create a clean interface with text input area and results dashboard. Implement word count, character count, and reading time estimation. Add readability scoring using multiple algorithms (Flesch-Kincaid, SMOG, Coleman-Liau).', 'Tools', true, NOW()),
    
    -- Gaming
    (v_user_id, '3D Racing Game', 'Create an exciting 3D racing game using Three.js and JavaScript. Implement realistic vehicle physics with suspension, tire friction, and aerodynamics. Create detailed car models with customizable paint and upgrades. Design multiple race tracks with varying terrain and obstacles.', 'Frontend', true, NOW()),
    (v_user_id, 'Chess Game', 'Develop a feature-rich chess game using HTML5, CSS3, and JavaScript. Create a realistic chessboard with proper piece rendering. Implement standard chess rules with move validation. Add move highlighting and piece movement animation. Include game clock with multiple time control options.', 'Frontend', true, NOW()),
    (v_user_id, 'Sudoku Game', 'Create an interactive Sudoku game using HTML5, CSS3, and JavaScript. Build a clean, accessible game board with intuitive controls. Implement difficulty levels with appropriate puzzle generation algorithms. Add hint system with multiple levels of assistance.', 'Frontend', true, NOW()),
    (v_user_id, 'Memory Card Game', 'Develop a memory matching card game using HTML5, CSS3, and JavaScript. Create visually appealing card designs with flip animations. Implement difficulty levels with varying grid sizes and card counts. Add timer and move counter for scoring.', 'Frontend', true, NOW()),
    
    -- Productivity
    (v_user_id, 'Budget Tracker', 'Develop a comprehensive budget tracking application using HTML5, CSS3, and JavaScript. Create an intuitive dashboard showing income, expenses, savings, and budget status. Implement transaction management with categories, tags, and recurring transactions.', 'Full Stack', true, NOW()),
    (v_user_id, 'Kanban Board', 'Build a Kanban project management board using HTML5, CSS3, and JavaScript. Create a flexible board layout with customizable columns (To Do, In Progress, Done, etc.). Implement drag-and-drop card movement between columns with smooth animations.', 'Full Stack', true, NOW()),
    (v_user_id, 'Habit Tracker', 'Create a habit tracking application using HTML5, CSS3, and JavaScript. Build a clean interface showing daily, weekly, and monthly views. Implement habit creation with frequency, reminders, and goals. Add streak tracking with visual indicators and milestone celebrations.', 'Full Stack', true, NOW()),
    (v_user_id, 'Flashcard Study System', 'Develop a comprehensive flashcard study system using HTML5, CSS3, and JavaScript. Create an intuitive interface for card creation and review. Implement spaced repetition algorithm for optimized learning. Add support for text, images, and audio on cards.', 'Full Stack', true, NOW()),
    (v_user_id, 'Meditation Timer', 'Build a mindfulness meditation timer using HTML5, CSS3, and JavaScript. Create a serene, distraction-free interface with nature-inspired design. Implement customizable meditation sessions with preparation, meditation, and rest intervals.', 'Frontend', true, NOW()),
    
    -- Media
    (v_user_id, 'Music Player', 'Develop a web-based music player using HTML5, CSS3, and JavaScript with the Web Audio API. Create a modern interface with album art display and visualizations. Implement playlist management with drag-and-drop reordering. Add audio controls including play/pause, skip, seek, volume.', 'Frontend', true, NOW()),
    (v_user_id, 'Drawing App', 'Create an interactive drawing application using HTML5 Canvas, CSS3, and JavaScript. Build a clean interface with intuitive tool selection. Implement multiple drawing tools including brush, pencil, shapes, text, and eraser. Add color selection with recent colors.', 'Frontend', true, NOW()),
    (v_user_id, 'Image Editor', 'Develop a web-based image editor using HTML5 Canvas, CSS3, and JavaScript. Create a professional interface with tool panels and preview area. Implement basic adjustments including brightness, contrast, saturation, and sharpness. Add filters with customizable parameters.', 'Frontend', true, NOW()),
    (v_user_id, 'PDF Viewer', 'Create a web-based PDF viewer using HTML5, CSS3, JavaScript and PDF.js. Build a clean interface with intuitive navigation controls. Implement page navigation with thumbnails and outline view. Add text search with result highlighting.', 'Frontend', true, NOW()),
    
    -- Testing
    (v_user_id, 'Typing Speed Test', 'Build an interactive typing speed test using HTML5, CSS3, and JavaScript. Create a clean interface with text display and input area. Implement WPM and accuracy calculation in real-time. Add difficulty levels with appropriate text selection.', 'Tools', true, NOW()),
    (v_user_id, 'URL Shortener', 'Build a URL shortening service frontend using HTML5, CSS3, JavaScript and a backend API. Create a clean interface with prominent input field. Implement URL validation and sanitization. Add QR code generation for shortened URLs.', 'Full Stack', true, NOW());

    RAISE NOTICE '✅ Successfully inserted 28 awesome prompts!';
END $$;

-- Step 3: Verify the prompts were inserted
SELECT 
    category,
    COUNT(*) as prompt_count
FROM public.prompts
GROUP BY category
ORDER BY prompt_count DESC;

-- Step 4: View all your prompts
SELECT 
    title,
    category,
    LEFT(content, 100) || '...' as preview
FROM public.prompts
WHERE is_public = true
ORDER BY created_at DESC
LIMIT 10;
