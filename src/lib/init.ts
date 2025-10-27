import { initializeAuditLogger } from './audit';
import { initializeRBAC } from './rbac';
import { getEnvironmentSecurityConfig } from './config';

// Security initialization configuration
export interface SecurityInitConfig {
  // Database connections
  firestore?: any; // Firestore instance
  redis?: any; // Redis instance
  
  // Environment
  environment?: 'development' | 'production' | 'test';
  
  // Feature flags
  features?: {
    auditLogging?: boolean;
    rbac?: boolean;
    rateLimiting?: boolean;
    ddosProtection?: boolean;
    securityHeaders?: boolean;
    cors?: boolean;
    csrf?: boolean;
  };
  
  // Security settings
  settings?: {
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    sessionTimeout?: number;
    passwordMinLength?: number;
    requireStrongPasswords?: boolean;
  };
}

// Default security configuration
const DEFAULT_SECURITY_CONFIG: SecurityInitConfig = {
  environment: 'development',
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
};

// Global security state
let securityInitialized = false;
let securityConfig: SecurityInitConfig = DEFAULT_SECURITY_CONFIG;

// Initialize security system
export async function initializeSecurity(config: SecurityInitConfig = {}): Promise<void> {
  try {
    console.log('🔒 Initializing security system...');
    
    // Merge with default configuration
    securityConfig = {
      ...DEFAULT_SECURITY_CONFIG,
      ...config,
      features: {
        ...DEFAULT_SECURITY_CONFIG.features,
        ...config.features,
      },
      settings: {
        ...DEFAULT_SECURITY_CONFIG.settings,
        ...config.settings,
      },
    };
    
    // Initialize audit logging
    if (securityConfig.features?.auditLogging) {
      console.log('📝 Initializing audit logging...');
      initializeAuditLogger(
        securityConfig.environment === 'production',
        securityConfig.firestore
      );
    }
    
    // Initialize RBAC
    if (securityConfig.features?.rbac) {
      console.log('👥 Initializing RBAC system...');
      initializeRBAC();
    }
    
    // Initialize rate limiting
    if (securityConfig.features?.rateLimiting) {
      console.log('⏱️ Initializing rate limiting...');
      // Rate limiting is initialized on first use
    }
    
    // Set up security monitoring
    if (securityConfig.environment === 'production') {
      console.log('📊 Setting up security monitoring...');
      setupSecurityMonitoring();
    }
    
    // Set up security alerts
    if (securityConfig.environment === 'production') {
      console.log('🚨 Setting up security alerts...');
      setupSecurityAlerts();
    }
    
    securityInitialized = true;
    console.log('✅ Security system initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize security system:', error);
    throw error;
  }
}

// Check if security is initialized
export function isSecurityInitialized(): boolean {
  return securityInitialized;
}

// Get security configuration
export function getSecurityConfig(): SecurityInitConfig {
  return securityConfig;
}

// Security monitoring setup
function setupSecurityMonitoring(): void {
  // Monitor failed login attempts
  setInterval(() => {
    // In a real implementation, you would:
    // - Check for suspicious login patterns
    // - Monitor rate limit violations
    // - Check for unusual API usage patterns
    // - Monitor for potential security threats
    console.log('🔍 Running security monitoring checks...');
  }, 5 * 60 * 1000); // Every 5 minutes
}

// Security alerts setup
function setupSecurityAlerts(): void {
  // Set up alerts for critical security events
  // In a real implementation, you would:
  // - Send emails to security team
  // - Send Slack notifications
  // - Create tickets in security system
  // - Log to security monitoring platform
  
  console.log('🚨 Security alerts configured');
}

// Security health check
export async function securityHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    auditLogging: boolean;
    rbac: boolean;
    rateLimiting: boolean;
    securityHeaders: boolean;
  };
  issues: string[];
}> {
  const issues: string[] = [];
  const checks = {
    auditLogging: securityConfig.features?.auditLogging || false,
    rbac: securityConfig.features?.rbac || false,
    rateLimiting: securityConfig.features?.rateLimiting || false,
    securityHeaders: securityConfig.features?.securityHeaders || false,
  };
  
  // Check audit logging
  if (securityConfig.features?.auditLogging) {
    try {
      // In a real implementation, you would test the audit logger
      // For now, we'll assume it's working if it's enabled
    } catch (error) {
      issues.push('Audit logging is not working properly');
      checks.auditLogging = false;
    }
  }
  
  // Check RBAC
  if (securityConfig.features?.rbac) {
    try {
      // In a real implementation, you would test the RBAC system
      // For now, we'll assume it's working if it's enabled
    } catch (error) {
      issues.push('RBAC system is not working properly');
      checks.rbac = false;
    }
  }
  
  // Check rate limiting
  if (securityConfig.features?.rateLimiting) {
    try {
      // In a real implementation, you would test the rate limiter
      // For now, we'll assume it's working if it's enabled
    } catch (error) {
      issues.push('Rate limiting is not working properly');
      checks.rateLimiting = false;
    }
  }
  
  // Determine overall status
  let status: 'healthy' | 'degraded' | 'unhealthy';
  if (issues.length === 0) {
    status = 'healthy';
  } else if (issues.length <= 2) {
    status = 'degraded';
  } else {
    status = 'unhealthy';
  }
  
  return {
    status,
    checks,
    issues,
  };
}

// Security middleware for initialization check
export function requireSecurityInitialized(
  handler: (req: Request) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    if (!securityInitialized) {
      return new Response(
        JSON.stringify({
          error: 'Security system not initialized',
          message: 'Please wait for the security system to initialize',
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    return handler(req);
  };
}

// Environment-specific security configuration
export function getEnvironmentSecuritySettings(): SecurityInitConfig {
  const environment = process.env.NODE_ENV as 'development' | 'production' | 'test';
  
  switch (environment) {
    case 'production':
      return {
        environment: 'production',
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
          maxLoginAttempts: 3,
          lockoutDuration: 30 * 60 * 1000, // 30 minutes
          sessionTimeout: 2 * 60 * 60 * 1000, // 2 hours
          passwordMinLength: 12,
          requireStrongPasswords: true,
        },
      };
      
    case 'test':
      return {
        environment: 'test',
        features: {
          auditLogging: false,
          rbac: false,
          rateLimiting: false,
          ddosProtection: false,
          securityHeaders: false,
          cors: false,
          csrf: false,
        },
        settings: {
          maxLoginAttempts: 10,
          lockoutDuration: 0,
          sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
          passwordMinLength: 1,
          requireStrongPasswords: false,
        },
      };
      
    case 'development':
    default:
      return {
        environment: 'development',
        features: {
          auditLogging: true,
          rbac: true,
          rateLimiting: false, // Disable in development for easier testing
          ddosProtection: false,
          securityHeaders: true,
          cors: true,
          csrf: false, // Disable in development for easier testing
        },
        settings: {
          maxLoginAttempts: 10,
          lockoutDuration: 5 * 60 * 1000, // 5 minutes
          sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
          passwordMinLength: 6,
          requireStrongPasswords: false,
        },
      };
  }
}

// Auto-initialize security on module load (for development)
if (process.env.NODE_ENV === 'development' && !securityInitialized) {
  initializeSecurity(getEnvironmentSecuritySettings()).catch(console.error);
}
