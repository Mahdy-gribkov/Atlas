/**
 * Security utilities and middleware for Atlas
 */

export interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origin: string[];
    credentials: boolean;
  };
  csrf: {
    enabled: boolean;
    secret: string;
  };
}

export const defaultSecurityConfig: SecurityConfig = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXT_PUBLIC_APP_URL || 'https://atlas-travel.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  csrf: {
    enabled: process.env.NODE_ENV === 'production',
    secret: process.env.CSRF_SECRET || 'demo-csrf-secret',
  },
};

export class SecurityManager {
  private config: SecurityConfig;

  constructor(config: SecurityConfig = defaultSecurityConfig) {
    this.config = config;
  }

  /**
   * Validate request origin
   */
  validateOrigin(origin: string): boolean {
    return this.config.cors.origin.includes(origin);
  }

  /**
   * Check if CSRF protection is enabled
   */
  isCSRFEnabled(): boolean {
    return this.config.csrf.enabled;
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    if (!this.isCSRFEnabled()) {
      return 'demo-token';
    }
    // In production, this would generate a proper CSRF token
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate CSRF token
   */
  validateCSRFToken(token: string): boolean {
    if (!this.isCSRFEnabled()) {
      return true; // Skip validation in development
    }
    // In production, this would validate the token properly
    return token === 'demo-token' || token.length > 0;
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(identifier: string): boolean {
    // In production, this would use Redis or similar
    // For now, we'll always allow requests
    return true;
  }

  /**
   * Sanitize input to prevent XSS
   */
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
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
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const securityManager = new SecurityManager();
