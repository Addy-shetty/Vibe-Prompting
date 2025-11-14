/**
 * Security Utilities
 * Provides input sanitization, validation, and security helpers
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Validate email format (additional layer beyond Zod)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email) && email.length <= 50 && email.length >= 1
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * Check password strength
 */
export interface PasswordStrength {
  isValid: boolean
  score: number // 0-4
  feedback: string[]
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters')
  } else if (password.length >= 12) {
    score++
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters')
  } else {
    score++
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters')
  } else {
    score++
  }

  // Number check
  if (!/\d/.test(password)) {
    feedback.push('Add numbers')
  } else {
    score++
  }

  // Special character check
  if (!/[@$!%*?&#^()_+=\-]/.test(password)) {
    feedback.push('Add special characters (@$!%*?&#^()_+=\-)')
  } else {
    score++
  }

  // Common patterns to avoid
  const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein']
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Avoid common words or patterns')
    score = Math.max(0, score - 2)
  }

  return {
    isValid: score >= 4 && feedback.length === 0,
    score: Math.min(4, score),
    feedback,
  }
}

/**
 * Rate limiting helper (client-side basic check)
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map()

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < windowMs)
    
    if (recentAttempts.length >= maxAttempts) {
      return false
    }
    
    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)
    return true
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Detect potential SQL injection attempts
 */
export function hasSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|;|\/\*|\*\/|xp_|sp_)/gi,
    /(\bOR\b|\bAND\b).*[=<>]/gi,
    /(UNION.*SELECT)/gi,
  ]
  
  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * Detect potential XSS attempts
 */
export function hasXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ]
  
  return xssPatterns.some(pattern => pattern.test(input))
}

/**
 * Secure string comparison (timing-safe)
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Generate a secure random token (for CSRF, etc.)
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate and sanitize user input comprehensively
 */
export function validateAndSanitize(input: string, maxLength: number = 1000): {
  isValid: boolean
  sanitized: string
  errors: string[]
} {
  const errors: string[] = []
  
  // Check length
  if (input.length > maxLength) {
    errors.push(`Input exceeds maximum length of ${maxLength} characters`)
  }
  
  // Check for SQL injection
  if (hasSQLInjection(input)) {
    errors.push('Input contains potentially malicious SQL patterns')
  }
  
  // Check for XSS
  if (hasXSS(input)) {
    errors.push('Input contains potentially malicious scripts')
  }
  
  // Sanitize
  const sanitized = sanitizeInput(input)
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  }
}
