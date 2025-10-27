import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHmac } from 'crypto';

export interface CSRFConfig {
  secret: string;
  tokenLength: number;
  cookieName: string;
  headerName: string;
  maxAge: number;
}

export class CSRFProtection {
  private static instance: CSRFProtection;
  private config: CSRFConfig;

  private constructor() {
    this.config = {
      secret: process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || 'default-csrf-secret',
      tokenLength: 32,
      cookieName: 'csrf-token',
      headerName: 'x-csrf-token',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    };
  }

  public static getInstance(): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection();
    }
    return CSRFProtection.instance;
  }

  /**
   * Generate a CSRF token
   */
  public generateToken(sessionId?: string): string {
    const randomToken = randomBytes(this.config.tokenLength).toString('hex');
    const timestamp = Date.now().toString();
    const data = `${randomToken}:${timestamp}:${sessionId || 'anonymous'}`;
    
    const signature = createHmac('sha256', this.config.secret)
      .update(data)
      .digest('hex');
    
    return `${data}:${signature}`;
  }

  /**
   * Verify a CSRF token
   */
  public verifyToken(token: string, sessionId?: string): boolean {
    try {
      const parts = token.split(':');
      if (parts.length !== 4) {
        return false;
      }

      const [randomToken, timestamp, tokenSessionId, signature] = parts;
      
      // Check if token is expired
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > this.config.maxAge) {
        return false;
      }

      // Verify signature
      const data = `${randomToken}:${timestamp}:${tokenSessionId}`;
      const expectedSignature = createHmac('sha256', this.config.secret)
        .update(data)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return false;
      }

      // Verify session ID if provided
      if (sessionId && tokenSessionId !== sessionId) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('CSRF token verification error:', error);
      return false;
    }
  }

  /**
   * Extract CSRF token from request
   */
  private extractToken(req: NextRequest): string | null {
    // Try header first
    const headerToken = req.headers.get(this.config.headerName);
    if (headerToken) {
      return headerToken;
    }

    // Try cookie
    const cookieToken = req.cookies.get(this.config.cookieName)?.value;
    if (cookieToken) {
      return cookieToken;
    }

    // Try form data
    try {
      const formData = req.formData();
      const formToken = formData.get('_csrf') as string;
      if (formToken) {
        return formToken;
      }
    } catch (error) {
      // Ignore form data parsing errors
    }

    return null;
  }

  /**
   * CSRF protection middleware
   */
  public withCSRFProtection(
    handler: (req: NextRequest, context?: any) => Promise<NextResponse>
  ) {
    return async (req: NextRequest, context?: any): Promise<NextResponse> => {
      // Skip CSRF for GET requests
      if (req.method === 'GET') {
        return handler(req, context);
      }

      // Skip CSRF for public endpoints
      const pathname = req.nextUrl.pathname;
      const publicPaths = ['/api/health', '/api/metrics', '/api/weather'];
      if (publicPaths.some(path => pathname.startsWith(path))) {
        return handler(req, context);
      }

      // Extract token
      const token = this.extractToken(req);
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'CSRF token missing' },
          { status: 403 }
        );
      }

      // Verify token
      const sessionId = context?.sessionId;
      if (!this.verifyToken(token, sessionId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }

      return handler(req, context);
    };
  }

  /**
   * Add CSRF token to response
   */
  public addCSRFToken(response: NextResponse, sessionId?: string): NextResponse {
    const token = this.generateToken(sessionId);
    
    // Set cookie
    response.cookies.set(this.config.cookieName, token, {
      httpOnly: false, // Allow JavaScript access for AJAX requests
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.config.maxAge / 1000, // Convert to seconds
    });

    // Add to headers
    response.headers.set(this.config.headerName, token);

    return response;
  }

  /**
   * Generate CSRF token endpoint
   */
  public async generateTokenEndpoint(req: NextRequest): Promise<NextResponse> {
    const sessionId = req.headers.get('x-session-id') || 'anonymous';
    const token = this.generateToken(sessionId);
    
    const response = NextResponse.json({
      success: true,
      token,
    });

    return this.addCSRFToken(response, sessionId);
  }
}

// Global CSRF protection instance
export const csrfProtection = CSRFProtection.getInstance();

// Convenience exports
export const withCSRFProtection = csrfProtection.withCSRFProtection.bind(csrfProtection);
export const addCSRFToken = csrfProtection.addCSRFToken.bind(csrfProtection);
export const generateCSRFToken = csrfProtection.generateToken.bind(csrfProtection);
export const verifyCSRFToken = csrfProtection.verifyToken.bind(csrfProtection);
