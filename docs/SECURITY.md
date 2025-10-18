# 🔒 Security Documentation

## Overview

This document provides comprehensive information about the security implementation in the AI Travel Agent application. The security system is designed to be production-ready, scalable, and easy to use.

## 🛡️ Security Features

### 1. **Input Validation & Sanitization**
- **XSS Prevention**: DOMPurify integration for HTML sanitization
- **SQL Injection Prevention**: Parameterized queries and input sanitization
- **Password Strength Validation**: Configurable password requirements
- **Email Validation**: RFC-compliant email format validation
- **File Upload Validation**: Type, size, and content validation

### 2. **Rate Limiting & DDoS Protection**
- **Per-IP Rate Limiting**: Configurable request limits per IP address
- **Per-User Rate Limiting**: User-specific rate limits
- **Per-Endpoint Rate Limiting**: Different limits for different API endpoints
- **DDoS Protection**: Automatic protection against distributed attacks
- **Brute Force Protection**: Enhanced protection for authentication endpoints

### 3. **Security Headers & CSP**
- **Content Security Policy**: Comprehensive CSP headers
- **CORS Configuration**: Configurable cross-origin resource sharing
- **CSRF Protection**: Cross-site request forgery prevention
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection

### 4. **Audit Logging**
- **Comprehensive Logging**: All security events are logged
- **Security Event Tracking**: Suspicious activity detection
- **Performance Monitoring**: Response time and error tracking
- **Compliance**: GDPR and security compliance logging
- **Alerting**: Critical security event notifications

### 5. **Role-Based Access Control (RBAC)**
- **User Roles**: Admin, Moderator, User, Guest
- **Fine-Grained Permissions**: Granular permission system
- **Resource Ownership**: User-specific resource access control
- **Permission Inheritance**: Role-based permission inheritance
- **Dynamic Authorization**: Runtime permission checks

## 🚀 Quick Start

### Basic Usage

```typescript
import { secure } from '@/lib/security';

// Public endpoint (minimal security)
export const publicEndpoint = secure.public(async (req) => {
  return NextResponse.json({ message: 'Public data' });
});

// User endpoint (standard security)
export const userEndpoint = secure.user(async (req, context) => {
  const userId = context?.userId;
  return NextResponse.json({ userId });
});

// Admin endpoint (maximum security)
export const adminEndpoint = secure.admin(async (req, context) => {
  return NextResponse.json({ message: 'Admin only' });
});
```

### Custom Configuration

```typescript
import { secure, SecurityConfig } from '@/lib/security';

const customConfig: SecurityConfig = {
  auth: {
    required: true,
    permissions: [Permission.READ_ITINERARY],
  },
  rateLimit: {
    enabled: true,
    config: 'custom',
    customConfig: {
      windowMs: 60000, // 1 minute
      maxRequests: 10, // 10 requests per minute
    },
  },
  validation: {
    enabled: true,
    schema: z.object({
      data: z.string().min(1),
    }),
  },
};

export const customEndpoint = secure.custom(customConfig, async (req, context) => {
  return NextResponse.json({ success: true });
});
```

## 📋 Security Presets

### Available Presets

| Preset | Authentication | Rate Limiting | Use Case |
|--------|---------------|---------------|----------|
| `public` | ❌ | Basic | Public APIs, health checks |
| `user` | ✅ | Standard | User-specific endpoints |
| `chat` | ✅ | Enhanced | Chat and messaging |
| `auth` | ❌ | Strict | Login, registration |
| `admin` | ✅ (Admin only) | Standard | Administrative functions |
| `search` | ✅ | Moderate | Search and discovery |
| `upload` | ✅ | Strict | File uploads |

### Preset Details

#### Public Preset
```typescript
{
  auth: { required: false },
  rateLimit: { enabled: true, config: 'public' },
  ddosProtection: { enabled: true, maxRequestsPerSecond: 10 },
  validation: { enabled: true },
  audit: { enabled: true, action: AuditAction.API_CALL },
  headers: { enabled: true },
  cors: { enabled: true },
  csrf: { enabled: false },
}
```

#### User Preset
```typescript
{
  auth: { required: true, roles: [UserRole.USER, UserRole.ADMIN] },
  rateLimit: { enabled: true, config: 'api' },
  ddosProtection: { enabled: true, maxRequestsPerSecond: 5 },
  validation: { enabled: true },
  audit: { enabled: true, action: AuditAction.API_CALL },
  headers: { enabled: true },
  cors: { enabled: true },
  csrf: { enabled: true },
}
```

#### Admin Preset
```typescript
{
  auth: { required: true, roles: [UserRole.ADMIN] },
  rateLimit: { enabled: true, config: 'admin' },
  ddosProtection: { enabled: true, maxRequestsPerSecond: 5 },
  validation: { enabled: true },
  audit: { enabled: true, action: AuditAction.MANAGE_SYSTEM },
  headers: { enabled: true },
  cors: { enabled: true },
  csrf: { enabled: true },
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Security Configuration
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com

# Rate Limiting
REDIS_URL=redis://localhost:6379
RATE_LIMIT_ENABLED=true

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Audit Logging
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION_DAYS=90

# Security Headers
CSP_ENABLED=true
HSTS_ENABLED=true
```

### Security Initialization

```typescript
import { initializeSecurity } from '@/lib/security';

// Initialize security system
await initializeSecurity({
  environment: 'production',
  firestore: firestoreInstance,
  redis: redisInstance,
  features: {
    auditLogging: true,
    rbac: true,
    rateLimiting: true,
    ddosProtection: true,
    securityHeaders: true,
    cors: true,
    csrf: true,
  },
  settings: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    passwordMinLength: 8,
    requireStrongPasswords: true,
  },
});
```

## 🔐 Authentication & Authorization

### User Roles

```typescript
enum UserRole {
  ADMIN = 'admin',        // Full system access
  MODERATOR = 'moderator', // Content management
  USER = 'user',          // Standard user access
  GUEST = 'guest',        // Limited read access
}
```

### Permissions

```typescript
enum Permission {
  // User management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  
  // Itinerary management
  CREATE_ITINERARY = 'create_itinerary',
  READ_ITINERARY = 'read_itinerary',
  UPDATE_ITINERARY = 'update_itinerary',
  DELETE_ITINERARY = 'delete_itinerary',
  SHARE_ITINERARY = 'share_itinerary',
  
  // Chat management
  CREATE_CHAT = 'create_chat',
  READ_CHAT = 'read_chat',
  UPDATE_CHAT = 'update_chat',
  DELETE_CHAT = 'delete_chat',
  
  // Admin functions
  MANAGE_SYSTEM = 'manage_system',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_USERS = 'manage_users',
  MANAGE_CONTENT = 'manage_content',
  
  // API access
  ACCESS_API = 'access_api',
  ACCESS_ADMIN_API = 'access_admin_api',
  
  // External services
  ACCESS_WEATHER_API = 'access_weather_api',
  ACCESS_FLIGHT_API = 'access_flight_api',
  ACCESS_MAPS_API = 'access_maps_api',
  ACCESS_COUNTRIES_API = 'access_countries_api',
}
```

### Role-Permission Matrix

| Permission | Admin | Moderator | User | Guest |
|------------|-------|-----------|------|-------|
| CREATE_USER | ✅ | ❌ | ❌ | ❌ |
| READ_USER | ✅ | ✅ | ✅ | ❌ |
| UPDATE_USER | ✅ | ✅ | ✅ | ❌ |
| DELETE_USER | ✅ | ❌ | ❌ | ❌ |
| CREATE_ITINERARY | ✅ | ✅ | ✅ | ❌ |
| READ_ITINERARY | ✅ | ✅ | ✅ | ✅ |
| UPDATE_ITINERARY | ✅ | ✅ | ✅ | ❌ |
| DELETE_ITINERARY | ✅ | ✅ | ✅ | ❌ |
| SHARE_ITINERARY | ✅ | ✅ | ✅ | ❌ |
| MANAGE_SYSTEM | ✅ | ❌ | ❌ | ❌ |
| VIEW_AUDIT_LOGS | ✅ | ✅ | ❌ | ❌ |
| ACCESS_API | ✅ | ✅ | ✅ | ✅ |
| ACCESS_ADMIN_API | ✅ | ❌ | ❌ | ❌ |

## 🚨 Rate Limiting

### Default Limits

| Endpoint Type | Window | Max Requests | Description |
|---------------|--------|--------------|-------------|
| Public | 1 minute | 60 | Public APIs |
| API | 15 minutes | 100 | Standard API calls |
| Auth | 15 minutes | 5 | Authentication attempts |
| Chat | 1 minute | 10 | Chat messages |
| Search | 1 minute | 20 | Search queries |
| Upload | 1 hour | 10 | File uploads |
| Admin | 1 minute | 30 | Admin functions |

### Custom Rate Limiting

```typescript
const customRateLimit = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,      // 5 requests per minute
  keyGenerator: (req) => `rate_limit:${req.ip}:${req.nextUrl.pathname}`,
  onLimitReached: (req, key) => {
    console.warn(`Rate limit exceeded for ${key}`);
  },
};
```

## 📊 Audit Logging

### Logged Events

```typescript
enum AuditAction {
  // Authentication
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_LOCKED = 'account_locked',
  
  // User management
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  
  // Itinerary management
  ITINERARY_CREATED = 'itinerary_created',
  ITINERARY_UPDATED = 'itinerary_updated',
  ITINERARY_DELETED = 'itinerary_deleted',
  
  // Security events
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  
  // System events
  SYSTEM_ERROR = 'system_error',
  CONFIGURATION_CHANGE = 'configuration_change',
}
```

### Audit Log Structure

```typescript
interface AuditLog {
  id: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  method: string;
  endpoint: string;
  ip?: string;
  userAgent?: string;
  requestBody?: any;
  responseStatus?: number;
  responseTime?: number;
  error?: string;
  metadata?: Record<string, any>;
}
```

## 🔍 Security Monitoring

### Health Checks

```typescript
import { securityHealthCheck } from '@/lib/security';

const health = await securityHealthCheck();
console.log(health);
// {
//   status: 'healthy' | 'degraded' | 'unhealthy',
//   checks: {
//     auditLogging: boolean,
//     rbac: boolean,
//     rateLimiting: boolean,
//     securityHeaders: boolean,
//   },
//   issues: string[]
// }
```

### Security Metrics

- **Failed Login Attempts**: Track and alert on suspicious patterns
- **Rate Limit Violations**: Monitor for potential attacks
- **Unauthorized Access**: Track permission violations
- **Suspicious Activity**: Detect unusual patterns
- **System Errors**: Monitor for security-related errors

## 🛠️ Development vs Production

### Development Mode
- Relaxed security settings
- No rate limiting
- Detailed error messages
- Console logging
- CORS enabled for localhost

### Production Mode
- Strict security settings
- Full rate limiting
- Sanitized error messages
- Structured logging
- Restricted CORS
- HSTS enabled
- CSP enforced

## 📝 Best Practices

### 1. **Always Use Security Presets**
```typescript
// ✅ Good
export const endpoint = secure.user(async (req, context) => {
  // Handler logic
});

// ❌ Bad
export async function endpoint(req: NextRequest) {
  // No security
}
```

### 2. **Validate All Inputs**
```typescript
// ✅ Good
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ❌ Bad
const { email, password } = req.body; // No validation
```

### 3. **Use Appropriate Permissions**
```typescript
// ✅ Good
secure.custom({
  auth: {
    required: true,
    permissions: [Permission.READ_ITINERARY],
  },
}, handler);

// ❌ Bad
secure.admin(handler); // Too restrictive
```

### 4. **Handle Errors Properly**
```typescript
// ✅ Good
try {
  const result = await operation();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Operation failed:', error);
  return NextResponse.json(
    { success: false, error: 'Operation failed' },
    { status: 500 }
  );
}
```

### 5. **Log Security Events**
```typescript
// ✅ Good
await logSecurityEvent(AuditAction.SUSPICIOUS_ACTIVITY, req, {
  severity: 'high',
  description: 'Multiple failed login attempts',
  metadata: { attempts: 5, ip: req.ip },
});
```

## 🚀 Deployment

### Environment Setup

1. **Set Environment Variables**
```bash
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key
REDIS_URL=redis://your-redis-instance
```

2. **Initialize Security System**
```typescript
import { initializeSecurity } from '@/lib/security';

await initializeSecurity({
  environment: 'production',
  firestore: firestoreInstance,
  redis: redisInstance,
});
```

3. **Configure Monitoring**
- Set up security alerts
- Configure log retention
- Set up health checks
- Configure backup procedures

### Security Checklist

- [ ] Environment variables configured
- [ ] Security system initialized
- [ ] Rate limiting enabled
- [ ] Audit logging configured
- [ ] Security headers enabled
- [ ] CORS configured
- [ ] CSRF protection enabled
- [ ] Monitoring set up
- [ ] Health checks configured
- [ ] Backup procedures in place

## 🔧 Troubleshooting

### Common Issues

#### 1. **Rate Limit Exceeded**
```
Error: Too Many Requests
```
**Solution**: Check rate limit configuration and increase limits if needed.

#### 2. **Authentication Failed**
```
Error: Unauthorized
```
**Solution**: Verify authentication token and user permissions.

#### 3. **CSRF Token Invalid**
```
Error: CSRF token is invalid
```
**Solution**: Ensure CSRF protection is properly configured.

#### 4. **Permission Denied**
```
Error: Permission denied
```
**Solution**: Check user role and permissions.

### Debug Mode

Enable debug mode for development:

```typescript
await initializeSecurity({
  environment: 'development',
  features: {
    auditLogging: true,
    rbac: true,
    rateLimiting: false, // Disable for debugging
    ddosProtection: false,
    securityHeaders: true,
    cors: true,
    csrf: false, // Disable for debugging
  },
});
```

## 📚 Additional Resources

- [Security Examples](./examples.ts)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

## 🤝 Contributing

When contributing to the security system:

1. **Follow Security Best Practices**
2. **Add Comprehensive Tests**
3. **Update Documentation**
4. **Review Security Implications**
5. **Test in Multiple Environments**

## 📄 License

This security system is part of the AI Travel Agent project and follows the same license terms.
