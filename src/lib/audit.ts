import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Audit log schema
export const auditLogSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  action: z.string(),
  resource: z.string().optional(),
  resourceId: z.string().optional(),
  method: z.string(),
  endpoint: z.string(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  requestBody: z.record(z.any()).optional(),
  responseStatus: z.number().optional(),
  responseTime: z.number().optional(),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;

// Audit log levels
export enum AuditLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SECURITY = 'security',
}

// Audit actions
export enum AuditAction {
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
  PROFILE_UPDATED = 'profile_updated',
  
  // Itinerary management
  ITINERARY_CREATED = 'itinerary_created',
  ITINERARY_UPDATED = 'itinerary_updated',
  ITINERARY_DELETED = 'itinerary_deleted',
  ITINERARY_SHARED = 'itinerary_shared',
  
  // Chat
  CHAT_STARTED = 'chat_started',
  CHAT_MESSAGE_SENT = 'chat_message_sent',
  CHAT_ENDED = 'chat_ended',
  
  // API usage
  API_CALL = 'api_call',
  API_ERROR = 'api_error',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  
  // Security events
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  DATA_BREACH_ATTEMPT = 'data_breach_attempt',
  MALICIOUS_REQUEST = 'malicious_request',
  
  // System events
  SYSTEM_ERROR = 'system_error',
  CONFIGURATION_CHANGE = 'configuration_change',
  BACKUP_CREATED = 'backup_created',
  MAINTENANCE_MODE = 'maintenance_mode',
}

// Audit logger interface
export interface AuditLogger {
  log(log: AuditLog): Promise<void>;
  query(filters: AuditQueryFilters): Promise<AuditLog[]>;
  getById(id: string): Promise<AuditLog | null>;
}

// Audit query filters
export interface AuditQueryFilters {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  level?: AuditLevel;
  ip?: string;
  limit?: number;
  offset?: number;
}

// File-based audit logger (for development)
class FileAuditLogger implements AuditLogger {
  private logFile: string;
  
  constructor(logFile = 'audit.log') {
    this.logFile = logFile;
  }
  
  async log(log: AuditLog): Promise<void> {
    const logEntry = JSON.stringify({
      ...log,
      timestamp: new Date(log.timestamp).toISOString(),
    }) + '\n';
    
    // In a real implementation, you would write to a file
    // For now, we'll just console.log
    console.log(`[AUDIT] ${logEntry.trim()}`);
  }
  
  async query(filters: AuditQueryFilters): Promise<AuditLog[]> {
    // In a real implementation, you would read from the log file
    // and filter the results
    console.log(`[AUDIT QUERY] ${JSON.stringify(filters)}`);
    return [];
  }
  
  async getById(id: string): Promise<AuditLog | null> {
    // In a real implementation, you would search the log file
    console.log(`[AUDIT GET] ${id}`);
    return null;
  }
}

// Database audit logger (for production)
class DatabaseAuditLogger implements AuditLogger {
  private collection: any; // Firestore collection
  
  constructor(collection: any) {
    this.collection = collection;
  }
  
  async log(log: AuditLog): Promise<void> {
    try {
      if (this.collection) {
        await this.collection.doc(log.id).set(log);
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }
  
  async query(filters: AuditQueryFilters): Promise<AuditLog[]> {
    try {
      if (!this.collection) return [];
      
      let query = this.collection.orderBy('timestamp', 'desc');
      
      if (filters.userId) {
        query = query.where('userId', '==', filters.userId);
      }
      
      if (filters.action) {
        query = query.where('action', '==', filters.action);
      }
      
      if (filters.resource) {
        query = query.where('resource', '==', filters.resource);
      }
      
      if (filters.startDate) {
        query = query.where('timestamp', '>=', filters.startDate.getTime());
      }
      
      if (filters.endDate) {
        query = query.where('timestamp', '<=', filters.endDate.getTime());
      }
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.offset(filters.offset);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => doc.data() as AuditLog);
    } catch (error) {
      console.error('Failed to query audit logs:', error);
      return [];
    }
  }
  
  async getById(id: string): Promise<AuditLog | null> {
    try {
      if (!this.collection) return null;
      
      const doc = await this.collection.doc(id).get();
      return doc.exists ? doc.data() as AuditLog : null;
    } catch (error) {
      console.error('Failed to get audit log:', error);
      return null;
    }
  }
}

// Global audit logger instance
let auditLogger: AuditLogger;

export function initializeAuditLogger(useDatabase = false, collection?: any): void {
  if (useDatabase && collection) {
    auditLogger = new DatabaseAuditLogger(collection);
  } else {
    auditLogger = new FileAuditLogger();
  }
}

// Audit logging functions
export async function logAuditEvent(
  action: AuditAction,
  request: NextRequest,
  options: {
    userId?: string;
    sessionId?: string;
    resource?: string;
    resourceId?: string;
    requestBody?: any;
    responseStatus?: number;
    responseTime?: number;
    error?: string;
    metadata?: Record<string, any>;
  } = {}
): Promise<void> {
  if (!auditLogger) {
    console.warn('Audit logger not initialized');
    return;
  }
  
  const log: AuditLog = {
    id: generateAuditId(),
    timestamp: Date.now(),
    userId: options.userId,
    sessionId: options.sessionId,
    action,
    resource: options.resource,
    resourceId: options.resourceId,
    method: request.method,
    endpoint: request.nextUrl.pathname,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || undefined,
    requestBody: options.requestBody,
    responseStatus: options.responseStatus,
    responseTime: options.responseTime,
    error: options.error,
    metadata: options.metadata,
  };
  
  await auditLogger.log(log);
}

// Security event logging
export async function logSecurityEvent(
  action: AuditAction,
  request: NextRequest,
  details: {
    userId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  await logAuditEvent(action, request, {
    ...(details.userId && { userId: details.userId }),
    metadata: {
      ...details.metadata,
      severity: details.severity,
      description: details.description,
      securityEvent: true,
    },
  });
  
  // For critical security events, you might want to:
  // - Send alerts to security team
  // - Block the IP temporarily
  // - Notify administrators
  if (details.severity === 'critical') {
    console.error(`[CRITICAL SECURITY EVENT] ${details.description}`, {
      action,
      ip: getClientIP(request),
      userId: details.userId,
    });
  }
}

// Helper functions
function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getClientIP(request: NextRequest): string {
  return (
    request.ip ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

// Audit middleware
export function withAuditLogging(
  action: AuditAction,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    let response: NextResponse | undefined;
    let error: string | undefined;
    
    try {
      response = await handler(req);
      return response;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      const responseTime = Date.now() - startTime;
      
      // Log the audit event
      await logAuditEvent(action, req, {
        ...(response?.status && { responseStatus: response.status }),
        responseTime,
        ...(error && { error }),
      });
    }
  };
}

// Security audit middleware
export function withSecurityAudit(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    let response: NextResponse;
    
    try {
      response = await handler(req);
      
      // Check for suspicious patterns
      const userAgent = req.headers.get('user-agent') || '';
      const ip = getClientIP(req);
      
      // Log suspicious user agents
      if (isSuspiciousUserAgent(userAgent)) {
        await logSecurityEvent(AuditAction.SUSPICIOUS_ACTIVITY, req, {
          severity: 'medium',
          description: 'Suspicious user agent detected',
          metadata: { userAgent },
        });
      }
      
      // Log high response times (potential DoS)
      const responseTime = Date.now() - startTime;
      if (responseTime > 10000) { // 10 seconds
        await logSecurityEvent(AuditAction.SUSPICIOUS_ACTIVITY, req, {
          severity: 'low',
          description: 'Slow response time detected',
          metadata: { responseTime },
        });
      }
      
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      await logSecurityEvent(AuditAction.SYSTEM_ERROR, req, {
        severity: 'high',
        description: 'System error occurred',
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime,
        },
      });
      
      throw error;
    }
  };
}

// Suspicious user agent detection
function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
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
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

// Export audit logger instance
export { auditLogger };
