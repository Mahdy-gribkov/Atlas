import { NextRequest, NextResponse } from 'next/server';

// Error types for better error handling
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  requestId?: string;
}

// Error handler factory
export function createErrorHandler() {
  return {
    // Validation error
    validation: (message: string, details?: any): AppError => ({
      type: ErrorType.VALIDATION_ERROR,
      message,
      statusCode: 400,
      details,
      timestamp: new Date().toISOString(),
    }),

    // Authentication error
    authentication: (message: string = 'Authentication required'): AppError => ({
      type: ErrorType.AUTHENTICATION_ERROR,
      message,
      statusCode: 401,
      timestamp: new Date().toISOString(),
    }),

    // Authorization error
    authorization: (message: string = 'Insufficient permissions'): AppError => ({
      type: ErrorType.AUTHORIZATION_ERROR,
      message,
      statusCode: 403,
      timestamp: new Date().toISOString(),
    }),

    // Not found error
    notFound: (message: string = 'Resource not found'): AppError => ({
      type: ErrorType.NOT_FOUND_ERROR,
      message,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    }),

    // Rate limit error
    rateLimit: (message: string = 'Too many requests'): AppError => ({
      type: ErrorType.RATE_LIMIT_ERROR,
      message,
      statusCode: 429,
      timestamp: new Date().toISOString(),
    }),

    // External service error
    externalService: (message: string, details?: any): AppError => ({
      type: ErrorType.EXTERNAL_SERVICE_ERROR,
      message,
      statusCode: 502,
      details,
      timestamp: new Date().toISOString(),
    }),

    // Database error
    database: (message: string, details?: any): AppError => ({
      type: ErrorType.DATABASE_ERROR,
      message,
      statusCode: 500,
      details,
      timestamp: new Date().toISOString(),
    }),

    // Internal server error
    internal: (message: string = 'Internal server error', details?: any): AppError => ({
      type: ErrorType.INTERNAL_SERVER_ERROR,
      message,
      statusCode: 500,
      details,
      timestamp: new Date().toISOString(),
    }),
  };
}

// Error response handler
export function handleError(error: AppError, request?: NextRequest): NextResponse {
  const requestId = request?.headers.get('x-request-id') || 'unknown';
  
  // Log error (in production, use proper logging service)
  console.error(`[${error.type}] ${error.message}`, {
    requestId,
    timestamp: error.timestamp,
    details: error.details,
  });

  // Return appropriate response
  return NextResponse.json(
    {
      error: {
        type: error.type,
        message: error.message,
        requestId,
        timestamp: error.timestamp,
        ...(process.env.NODE_ENV === 'development' && { details: error.details }),
      },
    },
    { status: error.statusCode }
  );
}

// Async error wrapper for API routes
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('Unhandled error:', error);
      
      const appError = createErrorHandler().internal(
        'An unexpected error occurred',
        process.env.NODE_ENV === 'development' ? error : undefined
      );
      
      return handleError(appError);
    }
  };
}

// Request validation helper
export function validateRequest(request: NextRequest, requiredFields: string[] = []) {
  const errors: string[] = [];
  
  // Check required headers
  if (requiredFields.includes('authorization') && !request.headers.get('authorization')) {
    errors.push('Authorization header is required');
  }
  
  // Check content type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      errors.push('Content-Type must be application/json');
    }
  }
  
  if (errors.length > 0) {
    throw createErrorHandler().validation('Invalid request', { errors });
  }
  
  return true;
}

