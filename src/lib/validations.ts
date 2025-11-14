import { z } from 'zod'

// Security: Regex patterns to prevent injection attacks
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const NO_SQL_INJECTION = /^[^<>'"`;\\{}[\]()=]+$/

// Password strength validation
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 25
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-])[A-Za-z\d@$!%*?&#^()_+=\-]/

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(50, 'Email is too long')
    .email('Invalid email address')
    .regex(EMAIL_REGEX, 'Invalid email format')
    .transform(val => val.toLowerCase().trim()),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .max(PASSWORD_MAX_LENGTH, 'Password is too long'),
})

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(USERNAME_REGEX, 'Username can only contain letters, numbers, hyphens, and underscores')
    .regex(NO_SQL_INJECTION, 'Username contains invalid characters')
    .transform(val => val.toLowerCase().trim()),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .max(50, 'Email is too long')
    .email('Invalid email address')
    .regex(EMAIL_REGEX, 'Invalid email format')
    .transform(val => val.toLowerCase().trim()),
  
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, 'Password is too long')
    .regex(PASSWORD_REGEX, 'Password must contain uppercase, lowercase, number, and special character'),
  
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Additional validation for prompt content
export const promptSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .regex(NO_SQL_INJECTION, 'Title contains invalid characters')
    .trim(),
  
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be less than 5000 characters')
    .trim(),
  
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category is too long'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type PromptFormData = z.infer<typeof promptSchema>
