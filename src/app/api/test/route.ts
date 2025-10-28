import { NextRequest } from 'next/server';
import { createErrorHandler, handleError, withErrorHandling } from '@/lib/error-handling/production';

// Test error handler
const errorHandler = createErrorHandler();

// Test API route with error handling
export const GET = withErrorHandling(async (request: NextRequest) => {
  // Simulate different error scenarios for testing
  const { searchParams } = new URL(request.url);
  const testType = searchParams.get('test');

  switch (testType) {
    case 'validation':
      throw errorHandler.validation('Test validation error', { field: 'test' });
    
    case 'auth':
      throw errorHandler.authentication('Test authentication error');
    
    case 'not-found':
      throw errorHandler.notFound('Test not found error');
    
    case 'rate-limit':
      throw errorHandler.rateLimit('Test rate limit error');
    
    case 'server':
      throw errorHandler.internal('Test server error');
    
    default:
      return Response.json({
        message: 'Test endpoint working',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
  }
});

// Test POST route
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  
  if (!body.test) {
    throw errorHandler.validation('Test field is required');
  }
  
  return Response.json({
    message: 'POST test successful',
    received: body,
    timestamp: new Date().toISOString(),
  });
});
