/**
 * Error handling system exports
 */

export * from './error-types';
export * from './error-handler';

// Re-export commonly used error classes for convenience
export {
  BaseAppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ExternalServiceError,
  RateLimitError,
  DatabaseError,
  InternalServerError,
  SecurityError,
} from './error-types';

export {
  ErrorHandler,
  errorHandler,
  withErrorHandling,
  createStandardErrorResponse as createErrorResponse,
  asyncHandler,
} from './error-handler';
