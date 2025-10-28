/**
 * Security audit utilities for Atlas
 */

export type AuditAction = 
  | 'login' 
  | 'logout' 
  | 'failed_login' 
  | 'password_reset'
  | 'access_granted' 
  | 'access_denied' 
  | 'permission_changed'
  | 'read' 
  | 'write' 
  | 'delete' 
  | 'export'
  | 'error_occurred';

export interface SecurityAuditEvent {
  id: string;
  timestamp: Date;
  type: 'authentication' | 'authorization' | 'data_access' | 'api_call' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  resource?: string;
  details?: Record<string, any>;
  success: boolean;
}

export interface SecurityAuditConfig {
  enabled: boolean;
  logLevel: 'low' | 'medium' | 'high' | 'critical';
  retentionDays: number;
  alertThresholds: {
    failedLogins: number;
    suspiciousActivity: number;
    dataBreach: number;
  };
}

export const defaultAuditConfig: SecurityAuditConfig = {
  enabled: process.env.NODE_ENV === 'production',
  logLevel: 'medium',
  retentionDays: 90,
  alertThresholds: {
    failedLogins: 5,
    suspiciousActivity: 3,
    dataBreach: 1,
  },
};

export class SecurityAuditor {
  private config: SecurityAuditConfig;
  private events: SecurityAuditEvent[] = [];

  constructor(config: SecurityAuditConfig = defaultAuditConfig) {
    this.config = config;
  }

  /**
   * Log a security event
   */
  logEvent(event: Omit<SecurityAuditEvent, 'id' | 'timestamp'>): void {
    if (!this.config.enabled) {
      return;
    }

    const auditEvent: SecurityAuditEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    this.events.push(auditEvent);
    
    // In production, this would send to a proper logging service
    console.log('Security Audit Event:', auditEvent);
  }

  /**
   * Log authentication event
   */
  logAuthentication(
    action: 'login' | 'logout' | 'failed_login' | 'password_reset',
    userId?: string,
    ipAddress?: string,
    success: boolean = true,
    details?: Record<string, any>
  ): void {
    this.logEvent({
      type: 'authentication',
      severity: success ? 'low' : 'medium',
      userId,
      ipAddress,
      action,
      success,
      details,
    });
  }

  /**
   * Log authorization event
   */
  logAuthorization(
    action: 'access_granted' | 'access_denied' | 'permission_changed',
    userId: string,
    resource: string,
    success: boolean = true,
    details?: Record<string, any>
  ): void {
    this.logEvent({
      type: 'authorization',
      severity: success ? 'low' : 'medium',
      userId,
      action,
      resource,
      success,
      details,
    });
  }

  /**
   * Log data access event
   */
  logDataAccess(
    action: 'read' | 'write' | 'delete' | 'export',
    userId: string,
    resource: string,
    success: boolean = true,
    details?: Record<string, any>
  ): void {
    this.logEvent({
      type: 'data_access',
      severity: 'low',
      userId,
      action,
      resource,
      success,
      details,
    });
  }

  /**
   * Log API call event
   */
  logAPICall(
    endpoint: string,
    method: string,
    userId?: string,
    ipAddress?: string,
    success: boolean = true,
    responseTime?: number,
    details?: Record<string, any>
  ): void {
    this.logEvent({
      type: 'api_call',
      severity: 'low',
      userId,
      ipAddress,
      action: `${method} ${endpoint}`,
      success,
      details: {
        ...details,
        responseTime,
      },
    });
  }

  /**
   * Log error event
   */
  logError(
    error: Error,
    userId?: string,
    ipAddress?: string,
    context?: Record<string, any>
  ): void {
    this.logEvent({
      type: 'error',
      severity: 'medium',
      userId,
      ipAddress,
      action: 'error_occurred',
      success: false,
      details: {
        error: error.message,
        stack: error.stack,
        ...context,
      },
    });
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityAuditEvent['type']): SecurityAuditEvent[] {
    return this.events.filter(event => event.type === type);
  }

  /**
   * Get events by severity
   */
  getEventsBySeverity(severity: SecurityAuditEvent['severity']): SecurityAuditEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  /**
   * Get events for a specific user
   */
  getUserEvents(userId: string): SecurityAuditEvent[] {
    return this.events.filter(event => event.userId === userId);
  }

  /**
   * Check for suspicious activity
   */
  checkSuspiciousActivity(userId: string, timeWindowMinutes: number = 60): boolean {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
    const recentEvents = this.events.filter(
      event => event.userId === userId && event.timestamp > cutoffTime
    );

    const failedLogins = recentEvents.filter(
      event => event.type === 'authentication' && !event.success
    ).length;

    const accessDenied = recentEvents.filter(
      event => event.type === 'authorization' && !event.success
    ).length;

    return failedLogins >= this.config.alertThresholds.failedLogins ||
           accessDenied >= this.config.alertThresholds.suspiciousActivity;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Clean up old events
   */
  cleanup(): void {
    const cutoffDate = new Date(Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoffDate);
  }
}

// Export singleton instance
export const securityAuditor = new SecurityAuditor();

// Convenience function for logging audit events
export function logAuditEvent(event: Omit<SecurityAuditEvent, 'id' | 'timestamp'>): void {
  securityAuditor.logEvent(event);
}
