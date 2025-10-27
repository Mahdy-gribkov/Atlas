import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  config: RateLimitConfig = {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  }
) {
  return function rateLimitMiddleware(
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
  ) {
    return async function(request: NextRequest, ...args: any[]) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up old entries
    rateLimitMap.forEach((value, key) => {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    });

    const current = rateLimitMap.get(ip);
    
    if (!current) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + config.windowMs });
      return handler(request, ...args);
    }

    if (current.count >= config.maxRequests) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
          }
        }
      );
    }

    current.count++;
    return handler(request, ...args);
    };
  };
}
