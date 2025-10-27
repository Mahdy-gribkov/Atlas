import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Security validation schemas
export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters and normalize
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Input validation schemas
export const userInputSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeInput),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .transform(sanitizeInput),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
});

export const chatMessageSchema = z.object({
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message must be less than 4000 characters')
    .transform(sanitizeInput),
  attachments: z.array(z.object({
    type: z.enum(['image', 'pdf', 'link', 'location']),
    url: z.string().url('Invalid URL format'),
    metadata: z.record(z.any()).optional(),
  })).optional(),
});

export const itinerarySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeInput),
  destination: z.string()
    .min(1, 'Destination is required')
    .max(100, 'Destination must be less than 100 characters')
    .transform(sanitizeInput),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  budget: z.number().min(0, 'Budget must be positive').max(1000000, 'Budget too large'),
  travelers: z.number().min(1, 'Must have at least 1 traveler').max(20, 'Too many travelers'),
});

export const searchQuerySchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(500, 'Search query too long')
    .transform(sanitizeInput),
  location: z.string()
    .max(100, 'Location name too long')
    .transform(sanitizeInput)
    .optional(),
  type: z.enum(['itinerary', 'guide', 'review', 'attraction', 'restaurant', 'other']).optional(),
});

// API parameter validation
export const apiParamsSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).refine(n => n > 0, 'Page must be positive'),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).refine(n => n > 0 && n <= 100, 'Limit must be between 1 and 100'),
});

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string()
    .min(1, 'Filename is required')
    .max(255, 'Filename too long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid filename characters'),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/gif', 'application/pdf']),
});

// SQL injection prevention
export const sanitizeForDatabase = (input: string): string => {
  return input
    .replace(/['"\\]/g, '') // Remove quotes and backslashes
    .replace(/[;-]/g, '') // Remove SQL comment markers
    .replace(/union|select|insert|update|delete|drop|create|alter/gi, '') // Remove SQL keywords
    .trim();
};

// XSS prevention
export const escapeHtml = (input: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'/]/g, (s) => map[s] || s);
};

// Rate limiting validation
export const rateLimitSchema = z.object({
  ip: z.string().ip('Invalid IP address'),
  endpoint: z.string().max(100, 'Endpoint name too long'),
  timestamp: z.number().positive('Invalid timestamp'),
});

// Audit log validation (moved to audit.ts to avoid conflicts)

// Validation helper functions
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};

// Security headers validation (moved to headers.ts to avoid conflicts)
