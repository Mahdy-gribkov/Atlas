import { NextRequest, NextResponse } from 'next/server';

// Security headers configuration
export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
  'Cross-Origin-Embedder-Policy': string;
  'Cross-Origin-Opener-Policy': string;
  'Cross-Origin-Resource-Policy': string;
}

// CSP directives for different environments
const CSP_DIRECTIVES = {
  development: {
    'default-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'localhost:*', '127.0.0.1:*'],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'localhost:*', '127.0.0.1:*'],
    'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
    'font-src': ["'self'", 'fonts.gstatic.com', 'data:'],
    'img-src': ["'self'", 'data:', 'blob:', 'localhost:*', '127.0.0.1:*'],
    'connect-src': ["'self'", 'localhost:*', '127.0.0.1:*', 'ws:', 'wss:'],
    'media-src': ["'self'", 'data:', 'blob:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  },
  
  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://vercel.live',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components
      'https://fonts.googleapis.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://images.unsplash.com',
      'https://maps.googleapis.com',
      'https://maps.gstatic.com',
      'https://streetviewpixels-pa.googleapis.com',
    ],
    'connect-src': [
      "'self'",
      'https://api.openweathermap.org',
      'https://test.api.amadeus.com',
      'https://maps.googleapis.com',
      'https://restcountries.com',
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'wss://vercel.live',
    ],
    'media-src': [
      "'self'",
      'data:',
      'blob:',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  },
};

// Generate CSP header
function generateCSP(environment: 'development' | 'production'): string {
  const directives = CSP_DIRECTIVES[environment];
  
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

// Security headers for different environments
export function getSecurityHeaders(environment: 'development' | 'production' = 'production'): SecurityHeaders {
  const isDev = environment === 'development';
  
  return {
    'Content-Security-Policy': generateCSP(environment),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=(self)',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),
    'Strict-Transport-Security': isDev 
      ? '' 
      : 'max-age=31536000; includeSubDomains; preload',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
}

// Apply security headers to response
export function applySecurityHeaders(
  response: NextResponse,
  environment: 'development' | 'production' = 'production'
): NextResponse {
  const headers = getSecurityHeaders(environment);
  
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });
  
  return response;
}

// Security headers middleware
export function withSecurityHeaders(
  handler: (req: NextRequest) => Promise<NextResponse>,
  environment: 'development' | 'production' = 'production'
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const response = await handler(req);
    return applySecurityHeaders(response, environment);
  };
}

// CORS configuration
export interface CORSConfig {
  origin: string | string[] | boolean;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

export const CORS_CONFIG: CORSConfig = {
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : process.env.ALLOWED_ORIGINS?.split(',') || false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-User-ID',
    'X-API-Key',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// CORS middleware
export function withCORS(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: CORSConfig = CORS_CONFIG
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const origin = req.headers.get('origin');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      
      // Set CORS headers
      if (config.origin === true || (Array.isArray(config.origin) && config.origin.includes(origin || ''))) {
        response.headers.set('Access-Control-Allow-Origin', origin || '*');
      } else if (typeof config.origin === 'string') {
        response.headers.set('Access-Control-Allow-Origin', config.origin);
      }
      
      response.headers.set('Access-Control-Allow-Methods', config.methods.join(', '));
      response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
      response.headers.set('Access-Control-Max-Age', config.maxAge.toString());
      
      if (config.credentials) {
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      
      return response;
    }
    
    // Handle actual requests
    const response = await handler(req);
    
    // Set CORS headers
    if (config.origin === true || (Array.isArray(config.origin) && config.origin.includes(origin || ''))) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    } else if (typeof config.origin === 'string') {
      response.headers.set('Access-Control-Allow-Origin', config.origin);
    }
    
    if (config.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    return response;
  };
}

// CSRF protection
export function withCSRFProtection(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Skip CSRF for GET requests
    if (req.method === 'GET') {
      return handler(req);
    }
    
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const host = req.headers.get('host');
    
    // Validate origin/referer
    if (!origin && !referer) {
      return NextResponse.json(
        { error: 'Missing origin or referer header' },
        { status: 403 }
      );
    }
    
    const allowedOrigins = process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    const isValidOrigin = allowedOrigins.some(allowed => 
      origin?.startsWith(allowed) || referer?.startsWith(allowed)
    );
    
    if (!isValidOrigin) {
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      );
    }
    
    return handler(req);
  };
}

// Security middleware composition
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    environment?: 'development' | 'production';
    enableCORS?: boolean;
    enableCSRF?: boolean;
    corsConfig?: CORSConfig;
  } = {}
) {
  const {
    environment = 'production',
    enableCORS = true,
    enableCSRF = true,
    corsConfig = CORS_CONFIG,
  } = options;
  
  let middleware = handler;
  
  // Apply security headers
  middleware = withSecurityHeaders(middleware, environment);
  
  // Apply CORS if enabled
  if (enableCORS) {
    middleware = withCORS(middleware, corsConfig);
  }
  
  // Apply CSRF protection if enabled
  if (enableCSRF) {
    middleware = withCSRFProtection(middleware);
  }
  
  return middleware;
}
