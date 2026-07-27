# Refactor Modules

This folder contains new modules to be merged into the main project.

## Structure

```
_refactor/
├── module1-testing/           # Vitest setup + tests
│   ├── vitest.config.ts       → /vitest.config.ts
│   ├── setup.ts               → /src/test/setup.ts
│   ├── test-utils.tsx         → /src/test/test-utils.tsx
│   ├── security.test.ts       → /src/lib/security.test.ts
│   ├── CreditDisplay.test.tsx → /src/components/CreditDisplay.test.tsx
│   └── package-additions.json # Add these to package.json
│
├── module2-data-backup/       # Anonymous prompt backup/restore
│   ├── promptSchemas.ts       → /src/schemas/promptSchemas.ts
│   ├── useAnonymousPrompts.ts → /src/hooks/useAnonymousPrompts.ts
│   ├── usePromptBackup.ts     → /src/hooks/usePromptBackup.ts
│   └── DataManagementModal.tsx→ /src/components/DataManagementModal.tsx
│
└── module3-service-layer/     # Decoupled service architecture
    ├── types.ts               → /src/services/types.ts
    ├── SupabasePromptService.ts → /src/services/SupabasePromptService.ts
    ├── MockPromptService.ts   → /src/services/MockPromptService.ts
    ├── ServiceContext.tsx     → /src/services/ServiceContext.tsx
    ├── GeneratePromptPageRefactored.tsx → (reference for migration)
    └── index.ts               → /src/services/index.ts
```

## How to Merge

### Module 1: Testing
```bash
# 1. Install dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8

# 2. Copy files
cp _refactor/module1-testing/vitest.config.ts ./
mkdir -p src/test
cp _refactor/module1-testing/setup.ts src/test/
cp _refactor/module1-testing/test-utils.tsx src/test/

# 3. Add scripts to package.json
# "test": "vitest"
# "test:run": "vitest run"
# "test:coverage": "vitest run --coverage"

# 4. Run tests
npm test
```

### Module 2: Data Backup
```bash
# 1. Install Zod
npm install zod

# 2. Copy files
mkdir -p src/schemas
cp _refactor/module2-data-backup/promptSchemas.ts src/schemas/
cp _refactor/module2-data-backup/useAnonymousPrompts.ts src/hooks/
cp _refactor/module2-data-backup/usePromptBackup.ts src/hooks/
cp _refactor/module2-data-backup/DataManagementModal.tsx src/components/

# 3. Add to Navbar or Settings page
```

### Module 3: Service Layer
```bash
# 1. Copy files
mkdir -p src/services
cp _refactor/module3-service-layer/*.ts src/services/
cp _refactor/module3-service-layer/*.tsx src/services/

# 2. Wrap App with ServiceProvider in main.tsx
# <ServiceProvider>
#   <App />
# </ServiceProvider>

# 3. Migrate components to use usePromptService() hook
```

## Module Status

- [x] Module 1: Testing Infrastructure (Vitest + tests)
- [x] Module 2: Data Backup/Restore (Zod + localStorage)
- [x] Module 3: Service Layer (Interface + Mock/Real implementations)

## After Merging

Delete this folder:
```bash
rm -rf _refactor
```
