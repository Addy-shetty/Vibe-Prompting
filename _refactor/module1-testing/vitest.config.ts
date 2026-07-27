/**
 * Vitest Configuration for Vibe Prompting
 * 
 * WHY: Integrates with existing Vite 7.2 setup while adding test capabilities.
 * Uses jsdom for DOM testing and includes coverage reporting.
 * 
 * TARGET LOCATION: /vitest.config.ts (root)
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom for React component testing
    environment: 'jsdom',
    
    // Global test setup file
    setupFiles: ['./src/test/setup.ts'],
    
    // Include test files matching these patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    
    // Exclude node_modules and build output
    exclude: ['node_modules', 'dist', '_refactor'],
    
    // Enable global test functions (describe, it, expect)
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
    },
    
    // Timeout for async tests (important for API mocking)
    testTimeout: 10000,
  },
  
  // Resolve aliases to match main vite.config.ts
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
