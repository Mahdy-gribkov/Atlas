// Security system exports
export * from './validation';
export * from './rate-limit';
export * from './headers';
export * from './audit';
export * from './rbac';
export * from './config';
export * from './init';

// Security utilities
export const SecurityUtils = {
  // Generate secure random strings
  generateSecureId: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
  
  // Generate secure token
  generateSecureToken: (): string => {
    return SecurityUtils.generateSecureId(64);
  },
  
  // Hash password (placeholder - use proper bcrypt in production)
  hashPassword: async (password: string): Promise<string> => {
    // In production, use bcrypt or similar
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  
  // Verify password (placeholder - use proper bcrypt in production)
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    const passwordHash = await SecurityUtils.hashPassword(password);
    return passwordHash === hash;
  },
  
  // Check if string contains suspicious patterns
  containsSuspiciousPatterns: (input: string): boolean => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
      /vbscript:/i,
      /data:text\/html/i,
      /data:application\/javascript/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(input));
  },
  
  // Sanitize filename
  sanitizeFilename: (filename: string): string => {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  },
  
  // Check if IP is in private range
  isPrivateIP: (ip: string): boolean => {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ];
    
    return privateRanges.some(range => range.test(ip));
  },
  
  // Get client IP from request
  getClientIP: (request: Request): string => {
    const headers = request.headers;
    return (
      headers.get('x-forwarded-for') ||
      headers.get('x-real-ip') ||
      headers.get('cf-connecting-ip') ||
      headers.get('x-client-ip') ||
      'unknown'
    );
  },
  
  // Check if request is from a bot
  isBotRequest: (userAgent: string): boolean => {
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /php/i,
      /perl/i,
      /go-http-client/i,
      /okhttp/i,
      /apache-httpclient/i,
    ];
    
    return botPatterns.some(pattern => pattern.test(userAgent));
  },
  
  // Generate CSRF token
  generateCSRFToken: (): string => {
    return SecurityUtils.generateSecureToken();
  },
  
  // Validate CSRF token
  validateCSRFToken: (token: string, sessionToken: string): boolean => {
    return token === sessionToken && token.length > 0;
  },
};

// Security constants
export const SECURITY_CONSTANTS = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  
  // Rate limiting
  DEFAULT_RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  DEFAULT_RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Session
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  SESSION_REFRESH_THRESHOLD: 60 * 60 * 1000, // 1 hour
  
  // Security headers
  CSP_NONCE_LENGTH: 16,
  HSTS_MAX_AGE: 31536000, // 1 year
  
  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  
  // Audit logging
  AUDIT_LOG_RETENTION_DAYS: 90,
  SECURITY_LOG_RETENTION_DAYS: 365,
  
  // Brute force protection
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // API security
  API_KEY_LENGTH: 32,
  API_KEY_PREFIX: 'ta_', // Travel Agent prefix
};

// Security error codes
export const SECURITY_ERROR_CODES = {
  UNAUTHORIZED: 'SECURITY_UNAUTHORIZED',
  FORBIDDEN: 'SECURITY_FORBIDDEN',
  RATE_LIMIT_EXCEEDED: 'SECURITY_RATE_LIMIT_EXCEEDED',
  INVALID_INPUT: 'SECURITY_INVALID_INPUT',
  CSRF_TOKEN_MISSING: 'SECURITY_CSRF_TOKEN_MISSING',
  CSRF_TOKEN_INVALID: 'SECURITY_CSRF_TOKEN_INVALID',
  SESSION_EXPIRED: 'SECURITY_SESSION_EXPIRED',
  ACCOUNT_LOCKED: 'SECURITY_ACCOUNT_LOCKED',
  SUSPICIOUS_ACTIVITY: 'SECURITY_SUSPICIOUS_ACTIVITY',
  VALIDATION_FAILED: 'SECURITY_VALIDATION_FAILED',
  PERMISSION_DENIED: 'SECURITY_PERMISSION_DENIED',
  RESOURCE_NOT_FOUND: 'SECURITY_RESOURCE_NOT_FOUND',
  INVALID_CREDENTIALS: 'SECURITY_INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'SECURITY_TOKEN_EXPIRED',
  TOKEN_INVALID: 'SECURITY_TOKEN_INVALID',
} as const;

// Security error messages
export const SECURITY_ERROR_MESSAGES = {
  [SECURITY_ERROR_CODES.UNAUTHORIZED]: 'Authentication required',
  [SECURITY_ERROR_CODES.FORBIDDEN]: 'Access denied',
  [SECURITY_ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later.',
  [SECURITY_ERROR_CODES.INVALID_INPUT]: 'Invalid input provided',
  [SECURITY_ERROR_CODES.CSRF_TOKEN_MISSING]: 'CSRF token is missing',
  [SECURITY_ERROR_CODES.CSRF_TOKEN_INVALID]: 'CSRF token is invalid',
  [SECURITY_ERROR_CODES.SESSION_EXPIRED]: 'Session has expired',
  [SECURITY_ERROR_CODES.ACCOUNT_LOCKED]: 'Account is temporarily locked',
  [SECURITY_ERROR_CODES.SUSPICIOUS_ACTIVITY]: 'Suspicious activity detected',
  [SECURITY_ERROR_CODES.VALIDATION_FAILED]: 'Input validation failed',
  [SECURITY_ERROR_CODES.PERMISSION_DENIED]: 'Permission denied',
  [SECURITY_ERROR_CODES.RESOURCE_NOT_FOUND]: 'Resource not found',
  [SECURITY_ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid credentials',
  [SECURITY_ERROR_CODES.TOKEN_EXPIRED]: 'Token has expired',
  [SECURITY_ERROR_CODES.TOKEN_INVALID]: 'Token is invalid',
} as const;
