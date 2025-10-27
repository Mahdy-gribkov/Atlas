import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'ioredis';

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  onLimitReached?: (req: NextRequest, key: string) => void; // Callback when limit is reached
}

// Default rate limit configurations
export const RATE_LIMITS = {
  // API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
  },
  
  // Chat endpoints
  chat: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 messages per minute
  },
  
  // Search endpoints
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 searches per minute
  },
  
  // File upload endpoints
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 uploads per hour
  },
  
  // Admin endpoints
  admin: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
  
  // Public endpoints
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
} as const;

// In-memory store for development (use Redis in production)
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>();
  
  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const item = this.store.get(key);
    if (!item) return null;
    
    // Check if window has expired
    if (Date.now() > item.resetTime) {
      this.store.delete(key);
      return null;
    }
    
    return item;
  }
  
  async set(key: string, count: number, windowMs: number): Promise<void> {
    this.store.set(key, {
      count,
      resetTime: Date.now() + windowMs,
    });
  }
  
  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const existing = await this.get(key);
    
    if (!existing) {
      await this.set(key, 1, windowMs);
      return { count: 1, resetTime: Date.now() + windowMs };
    }
    
    const newCount = existing.count + 1;
    await this.set(key, newCount, windowMs);
    return { count: newCount, resetTime: existing.resetTime };
  }
  
  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    for (const [key, value] of entries) {
      if (now > value.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Redis store for production
class RedisStore {
  private redis: Redis;
  
  constructor(redisUrl?: string) {
    this.redis = new Redis(redisUrl || process.env.REDIS_URL || 'redis://localhost:6379');
  }
  
  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    
    return JSON.parse(data);
  }
  
  async set(key: string, count: number, windowMs: number): Promise<void> {
    const data = JSON.stringify({
      count,
      resetTime: Date.now() + windowMs,
    });
    
    await this.redis.setex(key, Math.ceil(windowMs / 1000), data);
  }
  
  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const existing = await this.get(key);
    
    if (!existing) {
      await this.set(key, 1, windowMs);
      return { count: 1, resetTime: Date.now() + windowMs };
    }
    
    const newCount = existing.count + 1;
    await this.set(key, newCount, windowMs);
    return { count: newCount, resetTime: existing.resetTime };
  }
}

// Rate limiter class
export class RateLimiter {
  private store: MemoryStore | RedisStore;
  
  constructor(useRedis = false) {
    this.store = useRedis ? new RedisStore() : new MemoryStore();
    
    // Cleanup memory store every 5 minutes
    if (!useRedis) {
      setInterval(() => {
        (this.store as MemoryStore).cleanup();
      }, 5 * 60 * 1000);
    }
  }
  
  async checkLimit(
    key: string,
    config: RateLimitConfig
  ): Promise<{
    allowed: boolean;
    count: number;
    resetTime: number;
    remaining: number;
  }> {
    const { count, resetTime } = await this.store.increment(key, config.windowMs);
    const remaining = Math.max(0, config.maxRequests - count);
    const allowed = count <= config.maxRequests;
    
    return {
      allowed,
      count,
      resetTime,
      remaining,
    };
  }
}

// Global rate limiter instance - use Redis in production
const rateLimiter = new RateLimiter(process.env.NODE_ENV === 'production' || process.env.REDIS_URL);

// Key generators
export const keyGenerators = {
  // IP-based key
  ip: (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `rate_limit:ip:${ip}`;
  },
  
  // User-based key
  user: (req: NextRequest) => {
    const userId = req.headers.get('x-user-id') || 'anonymous';
    return `rate_limit:user:${userId}`;
  },
  
  // IP + User combination
  ipUser: (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userId = req.headers.get('x-user-id') || 'anonymous';
    return `rate_limit:ip_user:${ip}:${userId}`;
  },
  
  // Endpoint-specific key
  endpoint: (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const endpoint = req.nextUrl.pathname;
    return `rate_limit:endpoint:${endpoint}:${ip}`;
  },
};

// Rate limiting middleware
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Generate rate limit key
      const keyGenerator = config.keyGenerator || keyGenerators.ip;
      const key = keyGenerator(req);
      
      // Check rate limit
      const result = await rateLimiter.checkLimit(key, config);
      
      // Add rate limit headers
      const response = await handler(req);
      
      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      
      // If limit exceeded, return 429
      if (!result.allowed) {
        if (config.onLimitReached) {
          config.onLimitReached(req, key);
        }
        
        return NextResponse.json(
          {
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            },
          }
        );
      }
      
      return response;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // If rate limiting fails, allow the request but log the error
      return handler(req);
    }
  };
}

// DDoS protection
export function withDDoSProtection(
  maxRequestsPerSecond = 10,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withRateLimit(
    {
      windowMs: 1000, // 1 second
      maxRequests: maxRequestsPerSecond,
      keyGenerator: keyGenerators.ip,
    },
    handler
  );
}

// Brute force protection for authentication
export function withBruteForceProtection(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withRateLimit(
    {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 attempts per 15 minutes
      keyGenerator: keyGenerators.ip,
      onLimitReached: (req, key) => {
        console.warn(`Brute force attempt detected from IP: ${req.ip || 'unknown'}`);
        // In production, you might want to:
        // - Block the IP temporarily
        // - Send alerts to security team
        // - Log to security monitoring system
      },
    },
    handler
  );
}

// API rate limiting
export function withAPIRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withRateLimit(RATE_LIMITS.api, handler);
}

// Chat rate limiting
export function withChatRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withRateLimit(RATE_LIMITS.chat, handler);
}

// Search rate limiting
export function withSearchRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withRateLimit(RATE_LIMITS.search, handler);
}

// Admin rate limiting
export function withAdminRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withRateLimit(RATE_LIMITS.admin, handler);
}
