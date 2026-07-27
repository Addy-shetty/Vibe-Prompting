/**
 * Test Utilities with Provider Wrappers
 * 
 * WHY: Components need ThemeContext and AuthContext to render properly.
 * This utility wraps components with all required providers, making tests
 * cleaner and more maintainable.
 * 
 * TARGET LOCATION: /src/test/test-utils.tsx
 */
import React, { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

/**
 * Mock user for testing authenticated states
 */
export const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: {
    username: 'testuser',
  },
}

/**
 * Mock session for testing
 */
export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: mockUser,
}

interface AllProvidersProps {
  children: ReactNode
}

/**
 * Wraps children with all application providers
 * Used for rendering components that depend on context
 */
function AllProviders({ children }: AllProvidersProps) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

/**
 * Custom render function that includes all providers
 * 
 * @example
 * const { getByText } = renderWithProviders(<MyComponent />)
 */
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { renderWithProviders }
