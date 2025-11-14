-- Seed file for example developer prompts
-- Run this AFTER migrations to populate the database with high-quality examples
-- These prompts demonstrate the platform's capabilities to new users

-- IMPORTANT: This will use the FIRST user in auth.users table
-- Make sure you have at least one user registered before running this!

-- Get the first user_id and use it for all prompts
DO $$
DECLARE
  demo_user_id UUID;
BEGIN
  -- Get the first user from auth.users
  SELECT id INTO demo_user_id FROM auth.users LIMIT 1;
  
  -- Check if we found a user
  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found in auth.users table. Please register a user first!';
  END IF;

-- FRONTEND DEVELOPMENT PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  demo_user_id,
  'Build React Authentication System with Context API',
  'Create a complete authentication system in React using TypeScript and Context API. Implement: 1) Login/Signup forms with email and password validation using React Hook Form and Zod, 2) Protected routes with redirect logic, 3) JWT token storage in localStorage with auto-refresh, 4) Auth context provider with login(), logout(), and checkAuth() methods, 5) Custom useAuth() hook for consuming auth state, 6) Password strength indicator, 7) "Remember me" functionality, 8) Error handling with toast notifications, 9) Loading states and spinners, 10) Logout from all devices feature. Include TypeScript interfaces for User, AuthState, and AuthContext.',
  'Frontend Development',
  true,
  true,
  127,
  43
),
(
  auth.uid(),
  'Responsive Dashboard UI with Tailwind CSS',
  'Design and implement a modern, fully responsive admin dashboard using React and Tailwind CSS. Features: 1) Sidebar navigation with collapsible menu on mobile (hamburger), 2) Top navbar with search, notifications, and user profile dropdown, 3) Grid layout for stat cards showing KPIs (users, revenue, conversions, traffic), 4) Data tables with sorting, filtering, and pagination, 5) Chart.js integration for line graphs, bar charts, and pie charts, 6) Dark mode toggle with smooth transitions, 7) Responsive breakpoints (mobile-first approach), 8) Skeleton loaders for async data, 9) Animated transitions using Framer Motion, 10) Accessibility (ARIA labels, keyboard navigation). Use shadcn/ui components where applicable.',
  'Frontend Development',
  true,
  true,
  215,
  78
),
(
  auth.uid(),
  'Advanced Form Validation with React Hook Form & Zod',
  'Implement a complex multi-step form with advanced validation. Requirements: 1) Use React Hook Form for performance, 2) Zod schemas for type-safe validation, 3) Multi-step wizard (Personal Info → Address → Payment → Review), 4) Conditional fields based on previous selections, 5) Async validation (check if email exists via API), 6) File upload with drag-and-drop and preview, 7) Date picker with min/max constraints, 8) Auto-save drafts to localStorage, 9) Progress indicator, 10) Custom error messages with proper UX, 11) Submit with loading state and success/error toast, 12) Form reset functionality. Include TypeScript types for all form data.',
  'Frontend Development',
  true,
  true,
  98,
  31
);

-- BACKEND DEVELOPMENT PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'RESTful API with Node.js, Express & MongoDB',
  'Build a production-ready RESTful API using Node.js, Express, and MongoDB. Include: 1) Express app setup with TypeScript, 2) MongoDB connection with Mongoose ODM, 3) User authentication with JWT (access + refresh tokens), 4) CRUD operations for resources (Users, Posts, Comments), 5) Input validation using Joi or Zod, 6) Password hashing with bcrypt, 7) Rate limiting with express-rate-limit, 8) CORS configuration, 9) Error handling middleware, 10) Request logging with Morgan, 11) API documentation with Swagger/OpenAPI, 12) Environment variables with dotenv, 13) Database seeding scripts, 14) Pagination, sorting, and filtering helpers, 15) Unit tests with Jest and Supertest.',
  'Backend Development',
  true,
  true,
  342,
  156
),
(
  auth.uid(),
  'GraphQL API with Apollo Server & Prisma',
  'Design and implement a GraphQL API using Apollo Server, Prisma ORM, and PostgreSQL. Features: 1) Schema-first design with type definitions (typeDefs), 2) Queries: users, user(id), posts, post(id) with filters, 3) Mutations: createUser, updateUser, deleteUser, createPost, 4) Subscriptions for real-time updates (new posts, new comments), 5) DataLoader for N+1 query optimization, 6) Authentication context with JWT verification, 7) Field-level authorization (@auth directive), 8) Custom scalars (DateTime, Email, URL), 9) Pagination with cursor-based approach, 10) Error handling with custom error codes, 11) Apollo Studio integration for schema exploration, 12) Integration tests with Apollo testing utilities.',
  'Backend Development',
  true,
  true,
  189,
  67
),
(
  auth.uid(),
  'WebSocket Real-time Chat Server with Socket.io',
  'Create a real-time chat application backend using Socket.io and Redis. Implement: 1) Socket.io server setup with Express, 2) User authentication via JWT in socket handshake, 3) Room-based messaging (join, leave, send message), 4) Private one-to-one messaging, 5) Typing indicators ("User is typing..."), 6) Read receipts (message seen status), 7) Online/offline user presence, 8) Message persistence in MongoDB, 9) Redis adapter for horizontal scaling across multiple servers, 10) File/image sharing with upload to S3, 11) Message history retrieval with pagination, 12) Disconnect/reconnect handling with auto-reconnect logic, 13) Rate limiting to prevent spam, 14) Profanity filter for messages.',
  'Backend Development',
  true,
  true,
  276,
  112
);

-- FULL STACK PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'Full Stack E-commerce Platform (MERN)',
  'Build a complete e-commerce platform using MERN stack (MongoDB, Express, React, Node.js). Backend: 1) Product catalog API with categories, search, filters, 2) Shopping cart with session management, 3) Order processing with Stripe payment integration, 4) User profiles with order history, 5) Admin dashboard for product/order management, 6) Inventory tracking, 7) Email notifications (order confirmation, shipping updates). Frontend: 1) Product listing with filters (price, category, ratings), 2) Product detail pages with image gallery, 3) Shopping cart UI with quantity updates, 4) Checkout flow with address validation, 5) Payment integration with Stripe Elements, 6) User account pages, 7) Responsive design with Tailwind CSS, 8) SEO optimization with meta tags.',
  'Full Stack',
  true,
  true,
  445,
  203
),
(
  auth.uid(),
  'Social Media App with Next.js & Supabase',
  'Create a Twitter-like social media application using Next.js 14 (App Router) and Supabase. Features: 1) User authentication with Supabase Auth (email, OAuth), 2) Post creation with text, images, and hashtags, 3) Like, comment, and retweet functionality, 4) User profiles with bio, avatar, follower/following count, 5) Real-time feed updates using Supabase Realtime, 6) Infinite scroll pagination, 7) Search users and posts, 8) Notifications system (new followers, likes, comments), 9) Direct messaging, 10) Image upload to Supabase Storage, 11) Dark mode, 12) Server components for SEO, 13) Optimistic UI updates, 14) RLS policies for data security, 15) PWA support for mobile.',
  'Full Stack',
  true,
  true,
  312,
  145
);

-- DEVOPS & INFRASTRUCTURE PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'Docker Containerization for Full Stack App',
  'Containerize a full stack application (React frontend, Node.js backend, PostgreSQL database) using Docker. Create: 1) Multi-stage Dockerfile for frontend (build → nginx production image), 2) Dockerfile for backend with Node.js Alpine base, 3) docker-compose.yml orchestrating all services, 4) PostgreSQL service with volume for data persistence, 5) Redis cache service, 6) Nginx reverse proxy configuration, 7) Environment variable management (.env files), 8) Health checks for each container, 9) Development vs Production compose files, 10) Build optimization (layer caching, .dockerignore), 11) Network configuration for inter-container communication, 12) Volume mounts for hot-reload in development, 13) Production-ready security (non-root user, minimal base images).',
  'DevOps & Infrastructure',
  true,
  true,
  198,
  89
),
(
  auth.uid(),
  'CI/CD Pipeline with GitHub Actions',
  'Set up a complete CI/CD pipeline using GitHub Actions. Workflow: 1) Trigger on push to main and pull requests, 2) Run linting (ESLint, Prettier), 3) Run unit tests (Jest) with coverage reporting, 4) Run integration tests, 5) Build Docker images, 6) Push images to Docker Hub or AWS ECR, 7) Deploy to staging environment automatically, 8) Manual approval step for production deployment, 9) Deploy to production (AWS ECS, Vercel, or DigitalOcean), 10) Rollback mechanism on failure, 11) Slack/Discord notifications for build status, 12) Cache dependencies for faster builds, 13) Security scanning with Trivy or Snyk, 14) Semantic versioning and automatic changelog generation.',
  'DevOps & Infrastructure',
  true,
  true,
  234,
  102
),
(
  auth.uid(),
  'Kubernetes Deployment for Microservices',
  'Deploy a microservices architecture to Kubernetes. Create: 1) Deployment manifests for each service (API Gateway, Auth Service, User Service, Order Service), 2) Service definitions (ClusterIP for internal, LoadBalancer for external), 3) ConfigMaps for non-sensitive configuration, 4) Secrets for sensitive data (API keys, DB passwords), 5) Ingress controller (nginx-ingress) for routing, 6) Horizontal Pod Autoscaler (HPA) for auto-scaling, 7) PersistentVolumeClaims for stateful services, 8) Helm charts for easy deployment, 9) Namespace organization (dev, staging, prod), 10) Resource limits (CPU, memory), 11) Liveness and readiness probes, 12) Service mesh with Istio (optional), 13) Monitoring with Prometheus and Grafana.',
  'DevOps & Infrastructure',
  true,
  true,
  167,
  73
);

-- DATABASE & SQL PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'PostgreSQL Database Schema for SaaS Application',
  'Design a normalized PostgreSQL database schema for a multi-tenant SaaS application. Tables: 1) users (id, email, password_hash, role, tenant_id), 2) tenants (id, name, plan, billing_info), 3) workspaces (id, name, tenant_id, settings), 4) projects (id, workspace_id, name, status, created_by), 5) tasks (id, project_id, title, description, assignee_id, status, priority, due_date), 6) comments (id, task_id, user_id, content, created_at), 7) attachments (id, task_id, file_url, uploaded_by). Include: Foreign keys with ON DELETE CASCADE, Indexes on frequently queried columns, Timestamps (created_at, updated_at), ENUM types for status/priority, UUID primary keys, Row-level security for multi-tenancy, Triggers for updated_at timestamps.',
  'Database & SQL',
  true,
  true,
  156,
  61
),
(
  auth.uid(),
  'Complex SQL Queries for Analytics Dashboard',
  'Write advanced SQL queries for a business analytics dashboard. Queries needed: 1) Monthly revenue trend (GROUP BY month, SUM), 2) Top 10 customers by lifetime value (JOIN, ORDER BY, LIMIT), 3) Customer churn rate (COUNT with date filters), 4) Product performance comparison (CASE statements, aggregations), 5) Cohort analysis (users acquired in same month, retention over time), 6) Running total of sales (WINDOW functions), 7) Moving average for 30-day period (LAG/LEAD), 8) Conversion funnel metrics (CTEs for step-by-step filtering), 9) Users who haven''t purchased in 90 days (NOT EXISTS), 10) Year-over-year growth percentage (self-join on different years). Optimize with proper indexes and EXPLAIN ANALYZE.',
  'Database & SQL',
  true,
  true,
  203,
  87
);

-- API DEVELOPMENT PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'Secure Authentication API with Refresh Tokens',
  'Build a robust authentication API with access and refresh token flow. Endpoints: 1) POST /auth/register - Create user with email validation, 2) POST /auth/login - Return access token (15min expiry) + refresh token (7 days), 3) POST /auth/refresh - Exchange refresh token for new access token, 4) POST /auth/logout - Invalidate refresh token, 5) POST /auth/forgot-password - Send reset email, 6) POST /auth/reset-password - Reset with token verification. Security: Password hashing with bcrypt (10 rounds), JWT signing with RS256 algorithm, Refresh token rotation (invalidate old on use), HttpOnly cookies for refresh tokens, Rate limiting on login attempts, Email verification flow, Account lockout after failed attempts, Audit logging for auth events.',
  'API Development',
  true,
  true,
  289,
  134
),
(
  auth.uid(),
  'Stripe Payment Integration API',
  'Create a payment processing API using Stripe. Endpoints: 1) POST /checkout/create-session - Create Stripe Checkout session, 2) POST /webhooks/stripe - Handle Stripe webhooks (payment success, failure, refund), 3) GET /subscriptions/:userId - Fetch user subscriptions, 4) POST /subscriptions/create - Create subscription plan, 5) PUT /subscriptions/cancel - Cancel subscription, 6) POST /subscriptions/upgrade - Upgrade/downgrade plan. Features: Idempotency keys for duplicate prevention, Webhook signature verification, Customer creation in Stripe, Save payment methods, Handle trial periods, Proration for plan changes, Invoice generation, Email receipts, Refund processing, Subscription pause/resume, Metadata for order tracking.',
  'API Development',
  true,
  true,
  267,
  118
);

-- TESTING & QA PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'Comprehensive Testing Suite with Jest & React Testing Library',
  'Set up complete testing infrastructure for React application. Unit Tests: 1) Component rendering tests (smoke tests), 2) Props testing (different prop combinations), 3) State management tests (useState, useReducer), 4) Event handler tests (click, submit, change), 5) Conditional rendering tests, 6) Custom hooks testing with renderHook. Integration Tests: 1) Multi-component interaction tests, 2) API call mocking with MSW (Mock Service Worker), 3) Form submission flows, 4) Auth flow testing, 5) Route navigation tests. Setup: Jest configuration with TypeScript, RTL custom render with providers, Mock implementations for modules, Coverage thresholds (80% minimum), Test utilities and helpers, Snapshot testing for UI consistency, Accessibility testing with jest-axe.',
  'Testing & QA',
  true,
  true,
  178,
  71
),
(
  auth.uid(),
  'E2E Testing with Playwright',
  'Implement end-to-end testing using Playwright. Test Scenarios: 1) User registration flow (fill form, submit, verify email), 2) Login flow (valid/invalid credentials, remember me), 3) Shopping cart (add items, update quantity, checkout), 4) Payment processing (Stripe test mode), 5) Admin dashboard operations (CRUD), 6) Search and filter functionality, 7) Responsive design testing (mobile, tablet, desktop), 8) Cross-browser testing (Chrome, Firefox, Safari). Features: Page Object Model (POM) pattern, Custom fixtures for auth state, Visual regression testing with screenshots, Network request interception, Parallel test execution, Retry logic for flaky tests, Test reports with Allure, CI integration with GitHub Actions.',
  'Testing & QA',
  true,
  true,
  145,
  58
);

-- MOBILE DEVELOPMENT PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'React Native Social Feed with Offline Support',
  'Build a social media feed app with React Native and Expo. Features: 1) Infinite scroll feed with FlatList optimization, 2) Pull-to-refresh functionality, 3) Image upload from camera/gallery with compression, 4) Like, comment, share actions with optimistic updates, 5) User profiles with follower system, 6) Push notifications (Expo Notifications), 7) Offline support with AsyncStorage and queue, 8) Image caching with react-native-fast-image, 9) Deep linking for post sharing, 10) Dark mode support, 11) Biometric authentication (Touch ID, Face ID), 12) Navigation with React Navigation (Stack + Tab), 13) State management with Zustand, 14) API integration with Axios and retry logic, 15) Performance monitoring with React Native Performance.',
  'Mobile Development',
  true,
  true,
  223,
  98
);

-- ARCHITECTURE & DESIGN PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'Microservices Architecture for E-commerce Platform',
  'Design a scalable microservices architecture for an e-commerce system. Services: 1) API Gateway (Kong/NGINX) - routing, rate limiting, auth, 2) User Service - authentication, profiles, preferences, 3) Product Catalog Service - product CRUD, search (Elasticsearch), 4) Inventory Service - stock management, reservations, 5) Order Service - order processing, order history, 6) Payment Service - Stripe integration, payment history, 7) Notification Service - email/SMS with queues (RabbitMQ), 8) Recommendation Service - ML-based product recommendations. Communication: REST for client-facing, gRPC for inter-service, Event-driven with Kafka for async operations. Infrastructure: Docker + Kubernetes, Service mesh (Istio), Distributed tracing (Jaeger), Centralized logging (ELK stack), Monitoring (Prometheus + Grafana).',
  'Architecture & Design',
  true,
  true,
  412,
  187
),
(
  auth.uid(),
  'Event-Driven Architecture with Message Queues',
  'Design an event-driven system using RabbitMQ/Kafka. Use Cases: 1) User registration triggers: Send welcome email, Create default settings, Log analytics event, Notify admin. 2) Order placement triggers: Reserve inventory, Process payment, Send confirmation email, Update analytics. Event Structure: Event name, Timestamp, Payload, Correlation ID, Source service. Patterns: Pub/Sub for broadcasts, Work queues for task distribution, Request/Reply for sync operations, Dead letter queues for failures. Implementation: Event schemas with JSON Schema, Event versioning strategy, Idempotent consumers, Retry logic with exponential backoff, Circuit breaker for downstream failures, Event sourcing for audit trail, CQRS pattern for read/write separation.',
  'Architecture & Design',
  true,
  true,
  298,
  142
);

-- CODE REVIEW & REFACTORING PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_counts) VALUES
(
  auth.uid(),
  'Refactor Legacy Code to Clean Architecture',
  'Refactor a monolithic legacy codebase to follow Clean Architecture principles. Steps: 1) Identify and extract business logic from controllers, 2) Create domain entities (pure objects, no framework dependencies), 3) Define use cases (application business rules), 4) Implement repository interfaces for data access, 5) Separate infrastructure concerns (database, external APIs), 6) Apply Dependency Inversion (depend on abstractions), 7) Implement dependency injection container, 8) Write unit tests for business logic, 9) Integration tests for infrastructure, 10) Gradual migration strategy (strangler pattern). Benefits: Testability (mock dependencies), Maintainability (SOLID principles), Flexibility (swap implementations), Clear boundaries (layers), Framework independence.',
  'Code Review & Refactoring',
  true,
  true,
  187,
  79
);

-- DEBUGGING & PERFORMANCE PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'React Performance Optimization Techniques',
  'Optimize a slow React application. Diagnostics: 1) Use React DevTools Profiler to identify slow renders, 2) Chrome DevTools Performance tab for frame rate analysis, 3) Lighthouse audit for bundle size and loading time. Optimizations: 1) Memoization with React.memo, useMemo, useCallback, 2) Code splitting with React.lazy and Suspense, 3) Virtualization for long lists (react-window), 4) Image optimization (WebP format, lazy loading, responsive images), 5) Debouncing search inputs, 6) Avoid inline functions in render, 7) Use production build, 8) Tree shaking for unused code, 9) Reduce bundle size (analyze with webpack-bundle-analyzer), 10) Service Worker for caching, 11) CDN for static assets, 12) Optimize re-renders with proper state structure.',
  'Debugging & Performance',
  true,
  true,
  245,
  103
);

-- SECURITY & AUTH PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'OAuth 2.0 Implementation with Google & GitHub',
  'Implement OAuth 2.0 social login for Google and GitHub. Flow: 1) User clicks "Login with Google", 2) Redirect to Google auth page with client_id, redirect_uri, scope, 3) User approves, Google redirects back with authorization code, 4) Exchange code for access token (server-side), 5) Fetch user profile with access token, 6) Create or update user in database, 7) Generate JWT for your app, 8) Return JWT to frontend. Implementation: Express routes (/auth/google, /auth/google/callback), Passport.js strategies (GoogleStrategy, GitHubStrategy), Session management, CSRF protection with state parameter, Secure cookie settings (httpOnly, secure, sameSite), Handle existing email conflicts, Link multiple OAuth providers to one account, Refresh token storage, Revoke access functionality.',
  'Security & Auth',
  true,
  true,
  312,
  145
);

-- DOCUMENTATION PROMPTS
INSERT INTO public.prompts (user_id, title, content, category, is_public, is_approved, views_count, likes_count) VALUES
(
  auth.uid(),
  'Comprehensive API Documentation with Swagger/OpenAPI',
  'Create detailed API documentation using OpenAPI 3.0 specification. Documentation includes: 1) API info (title, version, description, contact), 2) Server URLs (dev, staging, prod), 3) Authentication schemes (JWT Bearer, API Key), 4) All endpoints with HTTP methods, paths, parameters, 5) Request body schemas with examples, 6) Response schemas for success (200, 201) and errors (400, 401, 404, 500), 7) Reusable components (schemas, responses, parameters), 8) Tags for endpoint grouping, 9) Code examples in multiple languages (cURL, JavaScript, Python), 10) Rate limiting information, 11) Pagination strategy, 12) Webhooks documentation. Tools: Swagger UI for interactive docs, Redoc for static docs, Postman collection generation, Auto-generate from code with swagger-jsdoc.',
  'Documentation',
  true,
  true,
  176,
  68
);

-- Success message
SELECT 'Successfully seeded ' || COUNT(*)::text || ' example prompts!' as message
FROM public.prompts
WHERE is_approved = true;
