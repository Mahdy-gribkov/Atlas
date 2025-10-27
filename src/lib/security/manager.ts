import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { ErrorHandler } from '@/lib/error-handling/error-handler';
import { RateLimiter, withRateLimit } from '@/lib/security/rate-limit';
import { withSecurityHeaders } from '@/lib/security/headers';
import { logAuditEvent, AuditAction } from '@/lib/security/audit';

export interface SecurityContext {
  userId: string;
  role: string;
  email: string;
  sessionId: string;
}

export interface SecurityOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  validateSchema?: z.ZodSchema;
  auditAction?: AuditAction;
}

export class SecurityManager {
  private static instance: SecurityManager;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = new RateLimiter(process.env.NODE_ENV === 'production' || !!process.env.REDIS_URL);
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * Main security middleware that combines all security measures
   */
  public async secure(
    handler: (req: NextRequest, context: SecurityContext) => Promise<NextResponse>,
    options: SecurityOptions = {}
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      try {
        // Apply security headers
        const response = await withSecurityHeaders(handler, 'production')(req);
        
        // Apply rate limiting
        if (options.rateLimit) {
          const rateLimitedHandler = withRateLimit({
            windowMs: options.rateLimit.windowMs,
            maxRequests: options.rateLimit.maxRequests,
          })(handler);
          return await rateLimitedHandler(req);
        }

        // Validate authentication
        if (options.requireAuth !== false) {
          const token = await this.validateAuthentication(req);
          
          // Check role permissions
          if (options.allowedRoles && !options.allowedRoles.includes(token.role)) {
            await logAuditEvent({
              action: AuditAction.UNAUTHORIZED_ACCESS,
              userId: token.userId,
              details: {
                attemptedRole: token.role,
                requiredRoles: options.allowedRoles,
                endpoint: req.nextUrl.pathname,
              },
            });
            
            return NextResponse.json(
              { success: false, error: 'Insufficient permissions' },
              { status: 403 }
            );
          }

          // Validate request schema
          if (options.validateSchema) {
            const body = await req.json();
            const validationResult = options.validateSchema.safeParse(body);
            
            if (!validationResult.success) {
              await logAuditEvent({
                action: AuditAction.VALIDATION_ERROR,
                userId: token.userId,
                details: {
                  errors: validationResult.error.errors,
                  endpoint: req.nextUrl.pathname,
                },
              });
              
              return NextResponse.json(
                { success: false, error: 'Invalid request data', details: validationResult.error.errors },
                { status: 400 }
              );
            }
          }

          // Log audit event
          if (options.auditAction) {
            await logAuditEvent({
              action: options.auditAction,
              userId: token.userId,
              details: {
                endpoint: req.nextUrl.pathname,
                method: req.method,
              },
            });
          }

          // Create security context
          const context: SecurityContext = {
            userId: token.userId,
            role: token.role,
            email: token.email,
            sessionId: token.sessionId,
          };

          return await handler(req, context);
        }

        return await handler(req, {} as SecurityContext);
      } catch (error) {
        return await this.errorHandler.handleError(error as Error, req);
      }
    };
  }

  /**
   * Validate authentication and return token
   */
  private async validateAuthentication(req: NextRequest): Promise<any> {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      throw new Error('Authentication required');
    }

    if (!token.uid || !token.role) {
      throw new Error('Invalid token structure');
    }

    return {
      userId: token.uid,
      role: token.role,
      email: token.email,
      sessionId: token.jti || 'unknown',
    };
  }

  /**
   * Public endpoint security (no auth required)
   */
  public public(
    handler: (req: NextRequest) => Promise<NextResponse>,
    options: Omit<SecurityOptions, 'requireAuth'> = {}
  ) {
    return this.secure(handler, { ...options, requireAuth: false });
  }

  /**
   * User-only endpoint security
   */
  public user(
    handler: (req: NextRequest, context: SecurityContext) => Promise<NextResponse>,
    options: Omit<SecurityOptions, 'requireAuth' | 'allowedRoles'> = {}
  ) {
    return this.secure(handler, { ...options, requireAuth: true, allowedRoles: ['user', 'agent', 'admin'] });
  }

  /**
   * Admin-only endpoint security
   */
  public admin(
    handler: (req: NextRequest, context: SecurityContext) => Promise<NextResponse>,
    options: Omit<SecurityOptions, 'requireAuth' | 'allowedRoles'> = {}
  ) {
    return this.secure(handler, { ...options, requireAuth: true, allowedRoles: ['admin'] });
  }

  /**
   * Chat endpoint security with specific rate limiting
   */
  public chat(
    handler: (req: NextRequest, context: SecurityContext) => Promise<NextResponse>,
    options: Omit<SecurityOptions, 'requireAuth' | 'rateLimit'> = {}
  ) {
    return this.secure(handler, {
      ...options,
      requireAuth: true,
      rateLimit: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10, // 10 requests per minute
      },
      auditAction: AuditAction.CHAT_MESSAGE,
    });
  }

  /**
   * API endpoint security with standard rate limiting
   */
  public api(
    handler: (req: NextRequest, context: SecurityContext) => Promise<NextResponse>,
    options: Omit<SecurityOptions, 'requireAuth' | 'rateLimit'> = {}
  ) {
    return this.secure(handler, {
      ...options,
      requireAuth: true,
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100, // 100 requests per 15 minutes
      },
    });
  }
}

// Global security manager instance
export const security = SecurityManager.getInstance();

// Convenience exports
export const secure = security;
export const publicEndpoint = security.public.bind(security);
export const userEndpoint = security.user.bind(security);
export const adminEndpoint = security.admin.bind(security);
export const chatEndpoint = security.chat.bind(security);
export const apiEndpoint = security.api.bind(security);
