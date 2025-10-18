/**
 * Security System Usage Examples
 * 
 * This file demonstrates how to use the universal security system
 * across different types of API routes and endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { secure, SecurityConfig } from './config';
import { Permission, UserRole } from './rbac';
import { z } from 'zod';

// ============================================================================
// EXAMPLE 1: Public API Endpoint (Minimal Security)
// ============================================================================

// Public endpoint - no authentication required, basic rate limiting
export const publicEndpoint = secure.public(async (req) => {
  return NextResponse.json({
    message: 'This is a public endpoint',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// EXAMPLE 2: User API Endpoint (Standard Security)
// ============================================================================

// User endpoint - requires authentication, standard rate limiting
export const userEndpoint = secure.user(async (req, context) => {
  const userId = context?.userId || req.headers.get('x-user-id');
  
  return NextResponse.json({
    message: 'This is a user endpoint',
    userId,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// EXAMPLE 3: Chat Endpoint (Enhanced Security)
// ============================================================================

const chatMessageSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

export const chatEndpoint = secure.chat(async (req, context) => {
  const body = await req.json();
  const { message, sessionId, attachments } = body;
  
  // Process chat message...
  
  return NextResponse.json({
    success: true,
    message: 'Chat message processed',
    sessionId,
  });
});

// ============================================================================
// EXAMPLE 4: Admin Endpoint (Maximum Security)
// ============================================================================

export const adminEndpoint = secure.admin(async (req, context) => {
  const userId = context?.userId || req.headers.get('x-user-id');
  
  return NextResponse.json({
    message: 'This is an admin endpoint',
    userId,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// EXAMPLE 5: Search Endpoint (Moderate Security)
// ============================================================================

const searchQuerySchema = z.object({
  query: z.string().min(1).max(500),
  location: z.string().optional(),
  type: z.enum(['itinerary', 'guide', 'review', 'attraction', 'restaurant']).optional(),
});

export const searchEndpoint = secure.search(async (req, context) => {
  const body = await req.json();
  const { query, location, type } = body;
  
  // Process search query...
  
  return NextResponse.json({
    success: true,
    results: [],
    query,
    location,
    type,
  });
});

// ============================================================================
// EXAMPLE 6: File Upload Endpoint (Strict Security)
// ============================================================================

const fileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  size: z.number().max(10 * 1024 * 1024), // 10MB max
  type: z.enum(['image/jpeg', 'image/png', 'image/gif', 'application/pdf']),
});

export const uploadEndpoint = secure.upload(async (req, context) => {
  const body = await req.json();
  const { filename, size, type } = body;
  
  // Process file upload...
  
  return NextResponse.json({
    success: true,
    message: 'File uploaded successfully',
    filename,
    size,
    type,
  });
});

// ============================================================================
// EXAMPLE 7: Authentication Endpoint (Brute Force Protection)
// ============================================================================

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginEndpoint = secure.auth(async (req) => {
  const body = await req.json();
  const { email, password } = body;
  
  // Process login...
  
  return NextResponse.json({
    success: true,
    message: 'Login successful',
    token: 'jwt-token-here',
  });
});

// ============================================================================
// EXAMPLE 8: Custom Security Configuration
// ============================================================================

const customSecurityConfig: SecurityConfig = {
  auth: {
    required: true,
    permissions: [Permission.READ_ITINERARY],
  },
  rateLimit: {
    enabled: true,
    config: 'custom',
    customConfig: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5, // 5 requests per minute
    },
  },
  validation: {
    enabled: true,
    schema: z.object({
      itineraryId: z.string().min(1),
      action: z.enum(['read', 'update', 'delete']),
    }),
  },
  audit: {
    enabled: true,
    action: 'itinerary_access' as any,
  },
  resourceOwnership: {
    enabled: true,
    resourceExtractor: (req) => {
      const url = new URL(req.url);
      const itineraryId = url.searchParams.get('itineraryId');
      const userId = req.headers.get('x-user-id');
      
      if (!itineraryId || !userId) return null;
      
      return {
        userId,
        resourceId: itineraryId,
        resourceType: 'itinerary',
      };
    },
  },
};

export const customEndpoint = secure.custom(customSecurityConfig, async (req, context) => {
  const body = await req.json();
  const { itineraryId, action } = body;
  
  // Process itinerary action...
  
  return NextResponse.json({
    success: true,
    message: `Itinerary ${action} successful`,
    itineraryId,
  });
});

// ============================================================================
// EXAMPLE 9: Resource-Specific Endpoint
// ============================================================================

export const itineraryEndpoint = secure.custom({
  auth: {
    required: true,
    roles: [UserRole.USER, UserRole.ADMIN],
  },
  rateLimit: {
    enabled: true,
    config: 'api',
  },
  validation: {
    enabled: true,
    schema: z.object({
      title: z.string().min(1).max(200),
      destination: z.string().min(1).max(100),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
  },
  audit: {
    enabled: true,
    action: 'itinerary_created' as any,
  },
  resourceOwnership: {
    enabled: true,
    resourceExtractor: (req) => {
      const userId = req.headers.get('x-user-id');
      const itineraryId = req.headers.get('x-itinerary-id');
      
      if (!userId || !itineraryId) return null;
      
      return {
        userId,
        resourceId: itineraryId,
        resourceType: 'itinerary',
      };
    },
  },
}, async (req, context) => {
  const body = await req.json();
  const { title, destination, startDate, endDate } = body;
  
  // Create itinerary...
  
  return NextResponse.json({
    success: true,
    message: 'Itinerary created successfully',
    itinerary: {
      id: 'new-itinerary-id',
      title,
      destination,
      startDate,
      endDate,
      userId: context?.userId || 'unknown',
    },
  });
});

// ============================================================================
// EXAMPLE 10: Multi-Method Endpoint
// ============================================================================

// GET endpoint - read access
export const getItinerary = secure.user(async (req, context) => {
  const url = new URL(req.url);
  const itineraryId = url.searchParams.get('id');
  
  // Get itinerary...
  
  return NextResponse.json({
    success: true,
    itinerary: {
      id: itineraryId,
      title: 'Sample Itinerary',
      destination: 'Tokyo',
    },
  });
});

// POST endpoint - create access
export const createItinerary = secure.user(async (req, context) => {
  const body = await req.json();
  const { title, destination, startDate, endDate } = body;
  
  // Create itinerary...
  
  return NextResponse.json({
    success: true,
    message: 'Itinerary created',
    itinerary: {
      id: 'new-id',
      title,
      destination,
      startDate,
      endDate,
    },
  });
});

// PUT endpoint - update access
export const updateItinerary = secure.user(async (req, context) => {
  const body = await req.json();
  const { id, updates } = body;
  
  // Update itinerary...
  
  return NextResponse.json({
    success: true,
    message: 'Itinerary updated',
    itinerary: {
      id,
      ...updates,
    },
  });
});

// DELETE endpoint - delete access
export const deleteItinerary = secure.user(async (req, context) => {
  const url = new URL(req.url);
  const itineraryId = url.searchParams.get('id');
  
  // Delete itinerary...
  
  return NextResponse.json({
    success: true,
    message: 'Itinerary deleted',
    itineraryId,
  });
});

// ============================================================================
// EXAMPLE 11: Error Handling
// ============================================================================

export const errorHandlingEndpoint = secure.user(async (req, context) => {
  try {
    // Simulate some operation that might fail
    const result = await someOperation();
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in endpoint:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
});

async function someOperation(): Promise<any> {
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: 'success' }), 100);
  });
}

// ============================================================================
// EXAMPLE 12: Environment-Specific Configuration
// ============================================================================

// Development endpoint - relaxed security
export const devEndpoint = secure.custom({
  auth: {
    required: false, // No auth required in development
  },
  rateLimit: {
    enabled: false, // No rate limiting in development
    config: 'api' as const,
  },
  validation: {
    enabled: true,
    schema: z.object({
      message: z.string().min(1),
    }),
  },
  audit: {
    enabled: false, // No audit logging in development
    action: 'api_call' as any,
  },
}, async (req, context) => {
  const body = await req.json();
  const { message } = body;
  
  return NextResponse.json({
    success: true,
    message: `Development endpoint: ${message}`,
    environment: 'development',
  });
});

// Production endpoint - strict security
export const prodEndpoint = secure.custom({
  auth: {
    required: true,
    roles: [UserRole.USER, UserRole.ADMIN],
  },
  rateLimit: {
    enabled: true,
    config: 'api',
  },
  ddosProtection: {
    enabled: true,
    maxRequestsPerSecond: 5,
  },
  validation: {
    enabled: true,
    schema: z.object({
      message: z.string().min(1).max(1000),
    }),
  },
  audit: {
    enabled: true,
    action: 'api_call' as any,
  },
  headers: {
    enabled: true,
    environment: 'production',
  },
  cors: {
    enabled: true,
    allowedOrigins: ['https://yourdomain.com'],
  },
  csrf: {
    enabled: true,
  },
}, async (req, context) => {
  const body = await req.json();
  const { message } = body;
  
  return NextResponse.json({
    success: true,
    message: `Production endpoint: ${message}`,
    environment: 'production',
  });
});

// ============================================================================
// USAGE NOTES
// ============================================================================

/*
1. SECURITY PRESETS:
   - secure.public() - Minimal security for public endpoints
   - secure.user() - Standard security for user endpoints
   - secure.chat() - Enhanced security for chat endpoints
   - secure.auth() - Brute force protection for auth endpoints
   - secure.admin() - Maximum security for admin endpoints
   - secure.search() - Moderate security for search endpoints
   - secure.upload() - Strict security for file uploads

2. CUSTOM CONFIGURATION:
   - Use secure.custom(config, handler) for specific requirements
   - Configure auth, rate limiting, validation, audit, etc.
   - Set resource ownership checks for user-specific resources

3. VALIDATION:
   - Always use Zod schemas for input validation
   - The security system automatically validates inputs
   - Sanitizes inputs to prevent XSS and injection attacks

4. AUDIT LOGGING:
   - All security events are automatically logged
   - Includes user actions, API calls, and security violations
   - Configurable retention and alerting

5. RATE LIMITING:
   - Automatic rate limiting based on endpoint type
   - Configurable per-IP, per-user, and per-endpoint limits
   - DDoS protection for high-traffic endpoints

6. ERROR HANDLING:
   - Consistent error responses across all endpoints
   - Proper HTTP status codes
   - Security-aware error messages

7. ENVIRONMENT AWARENESS:
   - Different security levels for development/production
   - Configurable based on NODE_ENV
   - Easy to override for testing

8. RESOURCE OWNERSHIP:
   - Automatic checks for user-owned resources
   - Prevents unauthorized access to other users' data
   - Configurable resource extraction logic

9. PERFORMANCE:
   - Minimal overhead in development
   - Optimized for production use
   - Caching and efficient middleware composition

10. MONITORING:
    - Built-in health checks
    - Security metrics and alerts
    - Comprehensive audit trails
*/
