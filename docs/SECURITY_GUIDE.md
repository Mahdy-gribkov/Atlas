# Security Guide

This guide provides comprehensive security information for the AI Travel Agent application, including security measures, best practices, and incident response procedures.

## Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Input Validation & Sanitization](#input-validation--sanitization)
4. [Rate Limiting & DDoS Protection](#rate-limiting--ddos-protection)
5. [Security Headers](#security-headers)
6. [Data Protection](#data-protection)
7. [Audit Logging](#audit-logging)
8. [API Security](#api-security)
9. [Infrastructure Security](#infrastructure-security)
10. [Security Monitoring](#security-monitoring)
11. [Incident Response](#incident-response)
12. [Security Best Practices](#security-best-practices)

## Security Overview

The AI Travel Agent application implements a comprehensive security system designed to protect user data, prevent unauthorized access, and ensure system integrity.

### Security Principles

- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Users and systems have minimum necessary access
- **Zero Trust**: Verify everything, trust nothing
- **Security by Design**: Security built into every component
- **Continuous Monitoring**: Real-time security monitoring and alerting

### Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Network Security (Firewall, DDoS Protection)            │
├─────────────────────────────────────────────────────────────┤
│ 2. Application Security (WAF, Rate Limiting)               │
├─────────────────────────────────────────────────────────────┤
│ 3. Authentication & Authorization (NextAuth.js, RBAC)      │
├─────────────────────────────────────────────────────────────┤
│ 4. Input Validation & Sanitization (Zod, DOMPurify)       │
├─────────────────────────────────────────────────────────────┤
│ 5. Data Protection (Encryption, Secure Storage)            │
├─────────────────────────────────────────────────────────────┤
│ 6. Audit Logging & Monitoring (Security Events)            │
└─────────────────────────────────────────────────────────────┘
```

## Authentication & Authorization

### Authentication System

The application uses NextAuth.js for authentication with multiple providers:

#### Supported Providers

1. **Email/Password**: Traditional email and password authentication
2. **Google OAuth**: Google account integration
3. **Firebase Auth**: Firebase authentication integration

#### Authentication Flow

```typescript
// Authentication middleware
import { secure } from '@/lib/security';

// Public endpoint
export const GET = secure.public(async (req) => {
  return NextResponse.json({ data: 'public data' });
});

// User-only endpoint
export const POST = secure.user(async (req, context) => {
  return NextResponse.json({ 
    data: 'user data',
    userId: context.userId 
  });
});

// Admin-only endpoint
export const DELETE = secure.admin(async (req, context) => {
  return NextResponse.json({ 
    data: 'admin action',
    userId: context.userId 
  });
});
```

#### Session Management

- **JWT Tokens**: Secure session tokens with expiration
- **Session Storage**: Secure session storage in Firestore
- **Token Refresh**: Automatic token refresh before expiration
- **Session Invalidation**: Immediate session invalidation on logout

### Role-Based Access Control (RBAC)

#### User Roles

1. **Guest**: Unauthenticated users (limited access)
2. **User**: Authenticated users (full user features)
3. **Premium**: Premium users (additional features)
4. **Admin**: Administrative users (system management)
5. **Super Admin**: Full system access

#### Permission System

```typescript
// Permission definitions
export const PERMISSIONS = {
  // User permissions
  USER_READ_PROFILE: 'user:read:profile',
  USER_UPDATE_PROFILE: 'user:update:profile',
  USER_DELETE_ACCOUNT: 'user:delete:account',
  
  // Itinerary permissions
  ITINERARY_CREATE: 'itinerary:create',
  ITINERARY_READ: 'itinerary:read',
  ITINERARY_UPDATE: 'itinerary:update',
  ITINERARY_DELETE: 'itinerary:delete',
  
  // Admin permissions
  ADMIN_READ_USERS: 'admin:read:users',
  ADMIN_UPDATE_USERS: 'admin:update:users',
  ADMIN_DELETE_USERS: 'admin:delete:users',
  ADMIN_READ_METRICS: 'admin:read:metrics',
} as const;

// Role-based permissions
export const ROLE_PERMISSIONS = {
  user: [
    PERMISSIONS.USER_READ_PROFILE,
    PERMISSIONS.USER_UPDATE_PROFILE,
    PERMISSIONS.ITINERARY_CREATE,
    PERMISSIONS.ITINERARY_READ,
    PERMISSIONS.ITINERARY_UPDATE,
    PERMISSIONS.ITINERARY_DELETE,
  ],
  admin: [
    ...ROLE_PERMISSIONS.user,
    PERMISSIONS.ADMIN_READ_USERS,
    PERMISSIONS.ADMIN_UPDATE_USERS,
    PERMISSIONS.ADMIN_READ_METRICS,
  ],
  super_admin: Object.values(PERMISSIONS),
} as const;
```

#### Authorization Middleware

```typescript
// Check user permissions
export function hasPermission(userRole: string, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

// Authorization middleware
export function requirePermission(permission: string) {
  return (handler: Function) => {
    return async (req: NextRequest, context: any) => {
      if (!hasPermission(context.userRole, permission)) {
        throw new AuthorizationError('Insufficient permissions');
      }
      return handler(req, context);
    };
  };
}
```

## Input Validation & Sanitization

### Validation System

The application uses Zod for schema validation and DOMPurify for HTML sanitization:

#### Schema Validation

```typescript
import { z } from 'zod';

// User profile validation
export const userProfileSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase(),
  preferences: z.object({
    language: z.enum(['en', 'he']),
    currency: z.string().length(3),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
    }),
  }),
});

// Itinerary validation
export const itinerarySchema = z.object({
  title: z.string().min(1).max(200).trim(),
  destination: z.string().min(1).max(100).trim(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  travelers: z.number().int().min(1).max(20),
  budget: z.number().min(0).max(1000000),
  preferences: z.object({
    interests: z.array(z.string()).max(10),
    travelStyle: z.object({
      budget: z.enum(['budget', 'mid-range', 'luxury']),
    }),
    accessibility: z.object({
      mobility: z.boolean(),
      visual: z.boolean(),
      hearing: z.boolean(),
      cognitive: z.boolean(),
    }),
    dietary: z.object({
      restrictions: z.array(z.string()).max(5),
    }),
  }),
});
```

#### Input Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML input
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

// Sanitize user input
export function sanitizeUserInput(input: any): any {
  if (typeof input === 'string') {
    return sanitizeHtml(input.trim());
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeUserInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeUserInput(value);
    }
    return sanitized;
  }
  return input;
}
```

#### Validation Middleware

```typescript
// Validation middleware
export function validateInput(schema: z.ZodSchema) {
  return (handler: Function) => {
    return async (req: NextRequest, context: any) => {
      try {
        const body = await req.json();
        const sanitizedBody = sanitizeUserInput(body);
        const validatedData = schema.parse(sanitizedBody);
        
        // Add validated data to context
        context.validatedData = validatedData;
        
        return handler(req, context);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new ValidationError('Invalid input data', error.errors);
        }
        throw error;
      }
    };
  };
}
```

## Rate Limiting & DDoS Protection

### Rate Limiting System

The application implements comprehensive rate limiting to prevent abuse:

#### Rate Limit Configuration

```typescript
// Rate limit configuration
export const rateLimitConfig = {
  // Global rate limits
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    message: 'Too many requests from this IP',
  },
  
  // Endpoint-specific limits
  endpoints: {
    '/api/auth/signin': {
      windowMs: 15 * 60 * 1000,
      max: 5, // 5 login attempts per 15 minutes
      message: 'Too many login attempts',
    },
    '/api/chat': {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 10, // 10 chat messages per minute
      message: 'Too many chat messages',
    },
    '/api/itineraries': {
      windowMs: 15 * 60 * 1000,
      max: 50, // 50 itinerary operations per 15 minutes
      message: 'Too many itinerary operations',
    },
  },
  
  // User-based limits
  users: {
    authenticated: {
      windowMs: 15 * 60 * 1000,
      max: 2000, // 2000 requests per 15 minutes
    },
    premium: {
      windowMs: 15 * 60 * 1000,
      max: 5000, // 5000 requests per 15 minutes
    },
    admin: {
      windowMs: 15 * 60 * 1000,
      max: 10000, // 10000 requests per 15 minutes
    },
  },
};
```

#### Rate Limiting Implementation

```typescript
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Redis client for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting middleware
export async function rateLimit(
  req: NextRequest,
  identifier: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const windowKey = `${key}:${window}`;
  
  try {
    // Get current count
    const current = await redis.get<number>(windowKey) || 0;
    
    if (current >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: (window + 1) * windowMs,
      };
    }
    
    // Increment counter
    await redis.incr(windowKey);
    await redis.expire(windowKey, Math.ceil(windowMs / 1000));
    
    return {
      allowed: true,
      remaining: limit - current - 1,
      resetTime: (window + 1) * windowMs,
    };
  } catch (error) {
    // If Redis is unavailable, allow the request
    console.error('Rate limiting error:', error);
    return {
      allowed: true,
      remaining: limit,
      resetTime: now + windowMs,
    };
  }
}
```

#### DDoS Protection

```typescript
// DDoS protection middleware
export function withDDoSProtection(handler: Function) {
  return async (req: NextRequest, context: any) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(userAgent)
    );
    
    if (isSuspicious) {
      // Apply stricter rate limits for suspicious requests
      const result = await rateLimit(req, ip, 10, 60 * 1000); // 10 requests per minute
      
      if (!result.allowed) {
        throw new RateLimitExceededError('Suspicious activity detected');
      }
    }
    
    return handler(req, context);
  };
}
```

## Security Headers

### Content Security Policy (CSP)

```typescript
// CSP configuration
export const cspConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    'https://fonts.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'https://images.unsplash.com',
    'https://maps.googleapis.com',
  ],
  'connect-src': [
    "'self'",
    'https://api.openweathermap.org',
    'https://test.api.amadeus.com',
    'https://maps.googleapis.com',
    'https://restcountries.com',
  ],
  'frame-src': [
    "'self'",
    'https://www.google.com',
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

// Security headers middleware
export function withSecurityHeaders(handler: Function) {
  return async (req: NextRequest, context: any) => {
    const response = await handler(req, context);
    
    // Add security headers
    response.headers.set('Content-Security-Policy', Object.entries(cspConfig)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ')
    );
    
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // HSTS (only in production)
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    return response;
  };
}
```

## Data Protection

### Encryption

#### Data at Rest

- **Firebase Firestore**: Encrypted by default
- **User Passwords**: Hashed using bcrypt
- **Sensitive Data**: Encrypted using AES-256

#### Data in Transit

- **HTTPS**: All communications encrypted with TLS 1.3
- **API Requests**: All API requests use HTTPS
- **WebSocket**: Secure WebSocket (WSS) for real-time features

#### Encryption Implementation

```typescript
import crypto from 'crypto';

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ALGORITHM = 'aes-256-gcm';

// Encrypt sensitive data
export function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  cipher.setAAD(Buffer.from('travel-agent', 'utf8'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

// Decrypt sensitive data
export function decrypt(encryptedData: { encrypted: string; iv: string; tag: string }): string {
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  decipher.setAAD(Buffer.from('travel-agent', 'utf8'));
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Data Anonymization

```typescript
// Anonymize user data for analytics
export function anonymizeUserData(userData: any): any {
  return {
    ...userData,
    email: userData.email ? `***@${userData.email.split('@')[1]}` : undefined,
    name: userData.name ? userData.name.charAt(0) + '***' : undefined,
    ip: userData.ip ? userData.ip.split('.').slice(0, 2).join('.') + '.***' : undefined,
  };
}
```

## Audit Logging

### Security Event Logging

The application logs all security-relevant events:

#### Audit Event Types

```typescript
export enum AuditAction {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  
  // Authorization events
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ROLE_CHANGE = 'ROLE_CHANGE',
  
  // Data access events
  DATA_READ = 'DATA_READ',
  DATA_WRITE = 'DATA_WRITE',
  DATA_DELETE = 'DATA_DELETE',
  
  // Security events
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  CSRF_VIOLATION = 'CSRF_VIOLATION',
  
  // System events
  API_ERROR = 'API_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
}

export enum AuditLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}
```

#### Audit Logging Implementation

```typescript
import winston from 'winston';

// Audit logger configuration
const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/audit.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Audit logging function
export function logAuditEvent(
  action: AuditAction,
  request: NextRequest,
  details: {
    level: AuditLevel;
    userId?: string;
    resourceId?: string;
    metadata?: any;
  }
): void {
  const auditEvent = {
    timestamp: new Date().toISOString(),
    action,
    level: details.level,
    userId: details.userId,
    resourceId: details.resourceId,
    request: {
      method: request.method,
      url: request.url,
      ip: request.ip || request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    },
    metadata: details.metadata,
  };
  
  auditLogger.log(details.level.toLowerCase(), auditEvent);
  
  // Send critical events to monitoring system
  if (details.level === AuditLevel.CRITICAL) {
    sendSecurityAlert(auditEvent);
  }
}
```

## API Security

### API Authentication

```typescript
// API key authentication
export function authenticateApiKey(req: NextRequest): string | null {
  const apiKey = req.headers.get('x-api-key');
  
  if (!apiKey) {
    return null;
  }
  
  // Validate API key
  const isValid = validateApiKey(apiKey);
  return isValid ? apiKey : null;
}

// JWT token authentication
export function authenticateJWT(req: NextRequest): any | null {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    return null;
  }
}
```

### API Rate Limiting

```typescript
// API-specific rate limiting
export const apiRateLimits = {
  '/api/weather': { max: 100, windowMs: 15 * 60 * 1000 },
  '/api/flights': { max: 50, windowMs: 15 * 60 * 1000 },
  '/api/places': { max: 200, windowMs: 15 * 60 * 1000 },
  '/api/chat': { max: 10, windowMs: 1 * 60 * 1000 },
};
```

## Infrastructure Security

### Environment Security

#### Environment Variables

```env
# Production environment variables
NODE_ENV=production
NEXTAUTH_SECRET=your-very-secure-secret-key
NEXTAUTH_URL=https://your-domain.com

# Firebase security
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# External API keys
OPENWEATHER_API_KEY=your-api-key
AMADEUS_API_KEY=your-api-key
AMADEUS_API_SECRET=your-api-secret
GOOGLE_MAPS_API_KEY=your-api-key
GOOGLE_GEMINI_API_KEY=your-api-key

# Security keys
ENCRYPTION_KEY=your-encryption-key
JWT_SECRET=your-jwt-secret

# Monitoring
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

#### Secrets Management

- **Environment Variables**: Store sensitive data in environment variables
- **Secret Rotation**: Regularly rotate API keys and secrets
- **Access Control**: Limit access to production secrets
- **Audit Trail**: Log all secret access and changes

### Network Security

#### Firewall Configuration

```typescript
// Network security middleware
export function withNetworkSecurity(handler: Function) {
  return async (req: NextRequest, context: any) => {
    const ip = req.ip || req.headers.get('x-forwarded-for');
    
    // Block known malicious IPs
    if (isBlockedIP(ip)) {
      throw new Error('Access denied');
    }
    
    // Check for suspicious patterns
    if (isSuspiciousRequest(req)) {
      logAuditEvent(AuditAction.SUSPICIOUS_ACTIVITY, req, {
        level: AuditLevel.WARN,
        metadata: { ip, userAgent: req.headers.get('user-agent') },
      });
    }
    
    return handler(req, context);
  };
}
```

## Security Monitoring

### Real-time Monitoring

```typescript
// Security monitoring system
export class SecurityMonitor {
  private alerts: Map<string, number> = new Map();
  
  // Monitor for security events
  monitorSecurityEvent(event: AuditEvent): void {
    const key = `${event.action}:${event.userId || event.request.ip}`;
    const count = this.alerts.get(key) || 0;
    this.alerts.set(key, count + 1);
    
    // Alert on suspicious patterns
    if (count > 5) {
      this.sendSecurityAlert(event);
    }
  }
  
  // Send security alerts
  private sendSecurityAlert(event: AuditEvent): void {
    // Send to monitoring system
    console.error('SECURITY ALERT:', event);
    
    // Send to external monitoring service
    if (process.env.SECURITY_WEBHOOK_URL) {
      fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    }
  }
}
```

### Security Metrics

```typescript
// Security metrics collection
export const securityMetrics = {
  // Track failed login attempts
  trackFailedLogin: (ip: string) => {
    recordMetric('security.failed_logins', 1, { ip });
  },
  
  // Track rate limit violations
  trackRateLimitViolation: (endpoint: string, ip: string) => {
    recordMetric('security.rate_limit_violations', 1, { endpoint, ip });
  },
  
  // Track suspicious activity
  trackSuspiciousActivity: (type: string, ip: string) => {
    recordMetric('security.suspicious_activity', 1, { type, ip });
  },
};
```

## Incident Response

### Security Incident Response Plan

#### 1. Detection

- **Automated Monitoring**: Real-time security event monitoring
- **Alert System**: Immediate alerts for critical security events
- **Log Analysis**: Regular analysis of security logs

#### 2. Assessment

- **Severity Classification**: Classify incidents by severity
- **Impact Analysis**: Assess potential impact on users and system
- **Root Cause Analysis**: Identify the root cause of the incident

#### 3. Response

- **Immediate Actions**: Take immediate steps to contain the incident
- **Communication**: Notify relevant stakeholders
- **Documentation**: Document all actions taken

#### 4. Recovery

- **System Restoration**: Restore affected systems
- **Data Recovery**: Recover any lost or corrupted data
- **Service Restoration**: Restore normal service operations

#### 5. Post-Incident

- **Lessons Learned**: Conduct post-incident review
- **Process Improvement**: Update security processes
- **Prevention**: Implement measures to prevent similar incidents

### Incident Response Procedures

```typescript
// Incident response system
export class IncidentResponse {
  // Classify incident severity
  classifyIncident(event: AuditEvent): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (event.action === AuditAction.LOGIN_FAILURE) {
      return 'LOW';
    }
    if (event.action === AuditAction.RATE_LIMIT_EXCEEDED) {
      return 'MEDIUM';
    }
    if (event.action === AuditAction.SUSPICIOUS_ACTIVITY) {
      return 'HIGH';
    }
    if (event.action === AuditAction.CSRF_VIOLATION) {
      return 'CRITICAL';
    }
    return 'LOW';
  }
  
  // Take immediate response actions
  respondToIncident(event: AuditEvent): void {
    const severity = this.classifyIncident(event);
    
    switch (severity) {
      case 'CRITICAL':
        this.blockIP(event.request.ip);
        this.notifySecurityTeam(event);
        this.escalateToManagement(event);
        break;
      case 'HIGH':
        this.increaseMonitoring(event.request.ip);
        this.notifySecurityTeam(event);
        break;
      case 'MEDIUM':
        this.logIncident(event);
        break;
      case 'LOW':
        this.logIncident(event);
        break;
    }
  }
  
  // Block malicious IP
  private blockIP(ip: string): void {
    // Add IP to blocklist
    console.log(`Blocking IP: ${ip}`);
  }
  
  // Notify security team
  private notifySecurityTeam(event: AuditEvent): void {
    // Send notification to security team
    console.log(`Security team notified: ${event.action}`);
  }
}
```

## Security Best Practices

### Development Security

1. **Secure Coding**: Follow secure coding practices
2. **Code Review**: Conduct security-focused code reviews
3. **Dependency Management**: Keep dependencies updated
4. **Vulnerability Scanning**: Regular vulnerability scans

### Deployment Security

1. **Secure Deployment**: Use secure deployment practices
2. **Environment Isolation**: Isolate production environments
3. **Access Control**: Limit production access
4. **Monitoring**: Monitor deployment processes

### Operational Security

1. **Regular Updates**: Keep systems updated
2. **Backup Strategy**: Implement secure backup strategies
3. **Access Management**: Manage user access properly
4. **Incident Response**: Maintain incident response procedures

## Security Checklist

### Pre-Deployment

- [ ] All security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] Authentication and authorization working
- [ ] Audit logging enabled
- [ ] Security monitoring configured
- [ ] Incident response procedures in place

### Post-Deployment

- [ ] Security monitoring active
- [ ] Regular security audits scheduled
- [ ] Incident response team trained
- [ ] Security documentation updated
- [ ] Regular security testing planned

## Security Resources

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/controls/)
- [SANS Security Training](https://www.sans.org/)

### Internal Resources

- [Security Documentation](docs/)
- [Incident Response Plan](docs/INCIDENT_RESPONSE.md)
- [Security Training Materials](docs/SECURITY_TRAINING.md)
- [Security Contact Information](docs/SECURITY_CONTACTS.md)

## Conclusion

This security guide provides comprehensive coverage of security measures implemented in the AI Travel Agent application. Regular review and updates of this guide are essential to maintain security effectiveness.

For security questions or concerns, contact the security team at security@travelagent.com.