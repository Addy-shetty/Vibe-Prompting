-- =============================================
-- SEED: Awesome ChatGPT Prompts for Developers
-- Source: https://github.com/f/awesome-chatgpt-prompts
-- =============================================

-- Note: Replace USER_ID with your actual user ID from the profiles table
-- You can find it by running: SELECT id FROM profiles WHERE email = 'your-email@example.com';

-- Frontend Development Prompts
INSERT INTO public.prompts (user_id, title, content, category, is_public, created_at) VALUES
(
  'YOUR_USER_ID_HERE',
  'Multiplayer 3D Plane Game',
  'Create an immersive multiplayer airplane combat game using Three.js, HTML5, CSS3, and JavaScript with WebSocket for real-time networking. Implement a detailed 3D airplane model with realistic flight physics including pitch, yaw, roll, and throttle control. Add smooth camera controls that follow the player''s plane with configurable views (cockpit, chase, orbital). Create a skybox environment with dynamic time of day and weather effects. Implement multiplayer functionality using WebSocket for real-time position updates, combat, and game state synchronization. Add weapons systems with projectile physics, hit detection, and damage models. Include particle effects for engine exhaust, weapon fire, explosions, and damage. Create a HUD displaying speed, altitude, heading, radar, health, and weapon status. Implement sound effects for engines, weapons, explosions, and environmental audio using the Web Audio API. Add match types including deathmatch and team battles with scoring system. Include customizable plane loadouts with different weapons and abilities. Create a lobby system for match creation and team assignment. Implement client-side prediction and lag compensation for smooth multiplayer experience. Add mini-map showing player positions and objectives. Include replay system for match playback and highlight creation. Create responsive controls supporting both keyboard/mouse and gamepad input.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Todo List Application',
  'Create a responsive todo app with HTML5, CSS3 and vanilla JavaScript. The app should have a modern, clean UI using CSS Grid/Flexbox with intuitive controls. Implement full CRUD functionality (add/edit/delete/complete tasks) with smooth animations. Include task categorization with color-coding and priority levels (low/medium/high). Add due dates with a date-picker component and reminder notifications. Use localStorage for data persistence between sessions. Implement search functionality with filters for status, category, and date range. Add drag and drop reordering of tasks using the HTML5 Drag and Drop API. Ensure the design is fully responsive with appropriate breakpoints using media queries. Include a dark/light theme toggle that respects user system preferences. Add subtle micro-interactions and transitions for better UX.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Weather Dashboard',
  'Build a comprehensive weather dashboard using HTML5, CSS3, JavaScript and the OpenWeatherMap API. Create a visually appealing interface showing current weather conditions with appropriate icons and background changes based on weather/time of day. Display a detailed 5-day forecast with expandable hourly breakdown for each day. Implement location search with autocomplete and history, supporting both city names and coordinates. Add geolocation support to automatically detect user''s location. Include toggles for temperature units (°C/°F) and time formats. Display severe weather alerts with priority highlighting. Show detailed meteorological data including wind speed/direction, humidity, pressure, UV index, and air quality when available. Include sunrise/sunset times with visual indicators. Create a fully responsive layout using CSS Grid that adapts to all device sizes with appropriate information density.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Scientific Calculator',
  'Create a comprehensive scientific calculator with HTML5, CSS3 and JavaScript that mimics professional calculators. Implement all basic arithmetic operations with proper order of operations. Include advanced scientific functions (trigonometric, logarithmic, exponential, statistical) with degree/radian toggle. Add memory operations (M+, M-, MR, MC) with visual indicators. Maintain a scrollable calculation history log that can be cleared or saved. Implement full keyboard support with appropriate key mappings and shortcuts. Add robust error handling for division by zero, invalid operations, and overflow conditions with helpful error messages. Create a responsive design that transforms between standard and scientific layouts based on screen size or orientation. Include multiple theme options (classic, modern, high contrast). Add optional sound feedback for button presses with volume control. Implement copy/paste functionality for results and expressions.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Markdown Notes App',
  'Build a feature-rich markdown notes application with HTML5, CSS3 and JavaScript. Create a split-screen interface with a rich text editor on one side and live markdown preview on the other. Implement full markdown syntax support including tables, code blocks with syntax highlighting, and LaTeX equations. Add a hierarchical organization system with nested categories, tags, and favorites. Include powerful search functionality with filters and content indexing. Use localStorage with optional export/import for data backup. Support exporting notes to PDF, HTML, and markdown formats. Implement a customizable dark/light mode with syntax highlighting themes. Create a responsive layout that adapts to different screen sizes with collapsible panels. Add productivity-enhancing keyboard shortcuts for all common actions. Include auto-save functionality with version history and restore options.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Pomodoro Timer',
  'Create a comprehensive pomodoro timer app using HTML5, CSS3 and JavaScript following the time management technique. Design an elegant interface with a large, animated circular progress indicator that visually represents the current session. Allow customization of work intervals (default 25min), short breaks (default 5min), and long breaks (default 15min). Include a task list integration where users can associate pomodoro sessions with specific tasks. Add configurable sound notifications for interval transitions with volume control. Implement detailed statistics tracking daily/weekly productivity with visual charts. Use localStorage to persist settings and history between sessions. Make the app installable as a PWA with offline support and notifications. Add keyboard shortcuts for quick timer control (start/pause/reset). Include multiple theme options with customizable colors and fonts. Add a focus mode that blocks distractions during work intervals.',
  'Frontend',
  true,
  NOW()
);

-- Full Stack & API Integration Prompts
INSERT INTO public.prompts (user_id, title, content, category, is_public, created_at) VALUES
(
  'YOUR_USER_ID_HERE',
  'Interactive Quiz Application',
  'Develop a comprehensive interactive quiz application with HTML5, CSS3 and JavaScript. Create an engaging UI with smooth transitions between questions. Support multiple question types including multiple choice, true/false, matching, and short answer with automatic grading. Implement configurable timers per question with visual countdown. Add detailed score tracking with points based on difficulty and response time. Show a dynamic progress bar indicating completion percentage. Include a review mode to see correct/incorrect answers with explanations after quiz completion. Implement a persistent leaderboard using localStorage. Organize questions into categories with custom icons and descriptions. Support multiple difficulty levels affecting scoring and time limits. Generate a detailed results summary with performance analytics and improvement suggestions. Add social sharing functionality for results with customizable messages.',
  'Full Stack',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Currency Exchange Calculator',
  'Develop a comprehensive currency converter using HTML5, CSS3, JavaScript and a reliable Exchange Rate API. Create a clean, intuitive interface with prominent input fields and currency selectors. Implement real-time exchange rates with timestamp indicators showing data freshness. Support 170+ global currencies including crypto with appropriate symbols and formatting. Maintain a conversion history log with timestamps and rate information. Allow users to bookmark favorite currency pairs for quick access. Generate interactive historical rate charts with customizable date ranges. Implement offline functionality using cached exchange rates with clear staleness indicators. Add a built-in calculator for complex conversions and arithmetic operations. Create rate alerts for target exchange rates with optional notifications. Include side-by-side comparison of different provider rates when available. Support printing and exporting conversion results in multiple formats (PDF, CSV, JSON).',
  'API Integration',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Recipe Finder Application',
  'Create a recipe finder application using HTML5, CSS3, JavaScript and a food API. Build a visually appealing interface with food photography and intuitive navigation. Implement advanced search with filtering by ingredients, cuisine, diet restrictions, and preparation time. Add user ratings and reviews with star system. Include detailed nutritional information with visual indicators for calories, macros, and allergens. Support recipe saving and categorization into collections. Implement a meal planning calendar with drag-and-drop functionality. Add automatic serving size adjustment with quantity recalculation. Include cooking mode with step-by-step instructions and timers. Support offline access to saved recipes. Add social sharing functionality for favorite recipes.',
  'Full Stack',
  true,
  NOW()
);

-- Tools & Utilities
INSERT INTO public.prompts (user_id, title, content, category, is_public, created_at) VALUES
(
  'YOUR_USER_ID_HERE',
  'Advanced Color Picker Tool',
  'Build a professional-grade color tool with HTML5, CSS3 and JavaScript for designers and developers. Create an intuitive interface with multiple selection methods including eyedropper, color wheel, sliders, and input fields. Implement real-time conversion between color formats (RGB, RGBA, HSL, HSLA, HEX, CMYK) with copy functionality. Add a color palette generator with options for complementary, analogous, triadic, tetradic, and monochromatic schemes. Include a favorites system with named collections and export options. Implement color harmony rules visualization with interactive adjustment. Create a gradient generator supporting linear, radial, and conic gradients with multiple color stops. Add an accessibility checker for WCAG compliance with contrast ratios and colorblindness simulation. Implement one-click copy for CSS, SCSS, and SVG code snippets. Include a color naming algorithm to suggest names for selected colors. Support exporting palettes to various formats (Adobe ASE, JSON, CSS variables, SCSS).',
  'Tools',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Secure Password Generator',
  'Create a comprehensive secure password generator using HTML5, CSS3 and JavaScript with cryptographically strong randomness. Build an intuitive interface with real-time password preview. Allow customization of password length with presets for different security levels. Include toggles for character types (uppercase, lowercase, numbers, symbols) with visual indicators. Implement an advanced strength meter showing entropy bits and estimated crack time. Add a one-click copy button with confirmation and automatic clipboard clearing. Create a password vault feature with encrypted localStorage storage. Generate multiple passwords simultaneously with batch options. Maintain a password history with generation timestamps. Calculate and display entropy using standard formulas. Offer memorable password generation options (phrase-based, pattern-based). Include export functionality with encryption options for password lists.',
  'Security',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'File Encryption Tool',
  'Create a client-side file encryption tool using HTML5, CSS3, and JavaScript with the Web Crypto API. Build a drag-and-drop interface for file selection with progress indicators. Implement AES-256-GCM encryption with secure key derivation from passwords (PBKDF2). Add support for encrypting multiple files simultaneously with batch processing. Include password strength enforcement with entropy calculation. Generate downloadable encrypted files with custom file extension. Create a decryption interface with password verification. Implement secure memory handling with automatic clearing of sensitive data. Add detailed logs of encryption operations without storing sensitive information. Include export/import of encryption keys with proper security warnings. Support for large files using streaming encryption and chunked processing.',
  'Security',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Code Snippet Manager',
  'Build a developer-focused code snippet manager using HTML5, CSS3, and JavaScript. Create a clean IDE-like interface with syntax highlighting for 30+ programming languages. Implement a tagging and categorization system for organizing snippets. Add a powerful search function with support for regex and filtering by language/tags. Include code editing with line numbers, indentation guides, and bracket matching. Support public/private visibility settings for each snippet. Implement export/import functionality in JSON and Gist formats. Add keyboard shortcuts for common operations. Create a responsive design that works well on all devices. Include automatic saving with version history. Add copy-to-clipboard functionality with syntax formatting preservation.',
  'Tools',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Text Analyzer Tool',
  'Build a comprehensive text analysis tool using HTML5, CSS3, and JavaScript. Create a clean interface with text input area and results dashboard. Implement word count, character count, and reading time estimation. Add readability scoring using multiple algorithms (Flesch-Kincaid, SMOG, Coleman-Liau). Include keyword density analysis with visualization. Implement sentiment analysis with emotional tone detection. Add grammar and spelling checking with suggestions. Include text comparison functionality for similarity detection. Support multiple languages with automatic detection. Add export functionality for analysis reports. Implement text formatting and cleaning tools.',
  'Tools',
  true,
  NOW()
);

-- Gaming
INSERT INTO public.prompts (user_id, title, content, category, is_public, created_at) VALUES
(
  'YOUR_USER_ID_HERE',
  '3D Racing Game',
  'Create an exciting 3D racing game using Three.js and JavaScript. Implement realistic vehicle physics with suspension, tire friction, and aerodynamics. Create detailed car models with customizable paint and upgrades. Design multiple race tracks with varying terrain and obstacles. Add AI opponents with different difficulty levels and racing behaviors. Implement a split-screen multiplayer mode for local racing. Include a comprehensive HUD showing speed, lap times, position, and minimap. Create particle effects for tire smoke, engine effects, and weather. Add dynamic day/night cycle with realistic lighting. Implement race modes including time trial, championship, and elimination. Include replay system with multiple camera angles.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Chess Game',
  'Develop a feature-rich chess game using HTML5, CSS3, and JavaScript. Create a realistic chessboard with proper piece rendering. Implement standard chess rules with move validation. Add move highlighting and piece movement animation. Include game clock with multiple time control options. Implement notation recording with PGN export. Add game analysis with move evaluation. Include AI opponent with adjustable difficulty levels. Support online play with WebRTC or WebSocket. Add opening book and common patterns recognition. Implement tournament mode with brackets and scoring.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Sudoku Game',
  'Create an interactive Sudoku game using HTML5, CSS3, and JavaScript. Build a clean, accessible game board with intuitive controls. Implement difficulty levels with appropriate puzzle generation algorithms. Add hint system with multiple levels of assistance. Include note-taking functionality for candidate numbers. Implement timer with pause and resume. Add error checking with optional immediate feedback. Include game saving and loading with multiple slots. Create statistics tracking for wins, times, and difficulty levels. Add printable puzzle generation. Implement keyboard controls and accessibility features.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Memory Card Game',
  'Develop a memory matching card game using HTML5, CSS3, and JavaScript. Create visually appealing card designs with flip animations. Implement difficulty levels with varying grid sizes and card counts. Add timer and move counter for scoring. Include sound effects for card flips and matches. Implement leaderboard with score persistence. Add theme selection with different card designs. Include multiplayer mode for competitive play. Create responsive layout that adapts to screen size. Add accessibility features for keyboard navigation. Implement progressive difficulty increase during gameplay.',
  'Frontend',
  true,
  NOW()
);

-- Productivity Apps
INSERT INTO public.prompts (user_id, title, content, category, is_public, created_at) VALUES
(
  'YOUR_USER_ID_HERE',
  'Budget Tracker',
  'Develop a comprehensive budget tracking application using HTML5, CSS3, and JavaScript. Create an intuitive dashboard showing income, expenses, savings, and budget status. Implement transaction management with categories, tags, and recurring transactions. Add interactive charts and graphs for expense analysis by category and time period. Include budget goal setting with progress tracking and alerts. Support multiple accounts and transfer between accounts. Implement receipt scanning and storage using the device camera. Add export functionality for reports in CSV and PDF formats. Create a responsive design with mobile-first approach. Include data backup and restore functionality. Add forecasting features to predict future financial status based on current trends.',
  'Full Stack',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Kanban Board',
  'Build a Kanban project management board using HTML5, CSS3, and JavaScript. Create a flexible board layout with customizable columns (To Do, In Progress, Done, etc.). Implement drag-and-drop card movement between columns with smooth animations. Add card creation with rich text formatting, labels, due dates, and priority levels. Include user assignment with avatars and filtering by assignee. Implement card comments and activity history. Add board customization with column reordering and color themes. Support multiple boards with quick switching. Implement data persistence using localStorage with export/import functionality. Create a responsive design that adapts to different screen sizes. Add keyboard shortcuts for common actions.',
  'Full Stack',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Habit Tracker',
  'Create a habit tracking application using HTML5, CSS3, and JavaScript. Build a clean interface showing daily, weekly, and monthly views. Implement habit creation with frequency, reminders, and goals. Add streak tracking with visual indicators and milestone celebrations. Include detailed statistics and progress graphs. Support habit categories and tags for organization. Implement calendar integration for scheduling. Add data visualization showing patterns and trends. Create a responsive design for all devices. Include data export and backup functionality. Add gamification elements with achievements and rewards.',
  'Full Stack',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Flashcard Study System',
  'Develop a comprehensive flashcard study system using HTML5, CSS3, and JavaScript. Create an intuitive interface for card creation and review. Implement spaced repetition algorithm for optimized learning. Add support for text, images, and audio on cards. Include card categorization with decks and tags. Implement study sessions with performance tracking. Add self-assessment with confidence levels. Create statistics dashboard showing learning progress. Support import/export of card decks in standard formats. Implement keyboard shortcuts for efficient review. Add dark mode and customizable themes.',
  'Full Stack',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Meditation Timer',
  'Build a mindfulness meditation timer using HTML5, CSS3, and JavaScript. Create a serene, distraction-free interface with nature-inspired design. Implement customizable meditation sessions with preparation, meditation, and rest intervals. Add ambient sound options including nature sounds, binaural beats, and white noise. Include guided meditation with customizable voice prompts. Implement interval bells with volume control and sound selection. Add session history and statistics tracking. Create visual breathing guides with animations. Support offline usage as a PWA. Include dark mode and multiple themes. Add session scheduling with reminders.',
  'Frontend',
  true,
  NOW()
);

-- Media & Entertainment
INSERT INTO public.prompts (user_id, title, content, category, is_public, created_at) VALUES
(
  'YOUR_USER_ID_HERE',
  'Music Player',
  'Develop a web-based music player using HTML5, CSS3, and JavaScript with the Web Audio API. Create a modern interface with album art display and visualizations. Implement playlist management with drag-and-drop reordering. Add audio controls including play/pause, skip, seek, volume, and playback speed. Include shuffle and repeat modes with visual indicators. Support multiple audio formats with fallbacks. Implement a 10-band equalizer with presets. Add metadata extraction and display from audio files. Create a responsive design that works on all devices. Include keyboard shortcuts for playback control. Support background playback with media session API integration.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Drawing App',
  'Create an interactive drawing application using HTML5 Canvas, CSS3, and JavaScript. Build a clean interface with intuitive tool selection. Implement multiple drawing tools including brush, pencil, shapes, text, and eraser. Add color selection with recent colors, color picker, and palettes. Include layer support with opacity and blend mode options. Implement undo/redo functionality with history states. Add image import and export in multiple formats (PNG, JPG, SVG). Support canvas resizing and rotation. Implement zoom and pan navigation. Add selection tools with move, resize, and transform capabilities. Include keyboard shortcuts for common actions.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'Image Editor',
  'Develop a web-based image editor using HTML5 Canvas, CSS3, and JavaScript. Create a professional interface with tool panels and preview area. Implement basic adjustments including brightness, contrast, saturation, and sharpness. Add filters with customizable parameters and previews. Include cropping and resizing with aspect ratio controls. Implement text overlay with font selection and styling. Add shape drawing tools with fill and stroke options. Include layer management with blending modes. Support image export in multiple formats and qualities. Create a responsive design that adapts to screen size. Add undo/redo functionality with history states.',
  'Frontend',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'PDF Viewer',
  'Create a web-based PDF viewer using HTML5, CSS3, JavaScript and PDF.js. Build a clean interface with intuitive navigation controls. Implement page navigation with thumbnails and outline view. Add text search with result highlighting. Include zoom and fit-to-width/height controls. Implement text selection and copying. Add annotation tools including highlights, notes, and drawing. Support document rotation and presentation mode. Include print functionality with options. Create a responsive design that works on all devices. Add document properties and metadata display.',
  'Frontend',
  true,
  NOW()
);

-- Performance & Testing Tools
INSERT INTO public.prompts (user_id, title, content, category, is_public, created_at) VALUES
(
  'YOUR_USER_ID_HERE',
  'Typing Speed Test',
  'Build an interactive typing speed test using HTML5, CSS3, and JavaScript. Create a clean interface with text display and input area. Implement WPM and accuracy calculation in real-time. Add difficulty levels with appropriate text selection. Include error highlighting and correction tracking. Implement test history with performance graphs. Add custom test creation with text import. Include virtual keyboard display showing keypresses. Support multiple languages and keyboard layouts. Create a responsive design for all devices. Add competition mode with leaderboards.',
  'Tools',
  true,
  NOW()
),
(
  'YOUR_USER_ID_HERE',
  'URL Shortener',
  'Build a URL shortening service frontend using HTML5, CSS3, JavaScript and a backend API. Create a clean interface with prominent input field. Implement URL validation and sanitization. Add QR code generation for shortened URLs. Include click tracking and analytics dashboard. Support custom alias creation for URLs. Implement expiration date setting for links. Add password protection option for sensitive URLs. Include copy-to-clipboard functionality with confirmation. Create a responsive design for all devices. Add history of shortened URLs with search and filtering.',
  'Full Stack',
  true,
  NOW()
);

-- Note: After inserting, replace 'YOUR_USER_ID_HERE' with actual user ID
-- Example: UPDATE public.prompts SET user_id = 'actual-uuid-here' WHERE user_id = 'YOUR_USER_ID_HERE';
