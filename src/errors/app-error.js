export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = statusCode
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
export const errorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

// Error messages
export const errorMessages = {
  [errorTypes.VALIDATION_ERROR]: 'Validation error occurred',
  [errorTypes.NOT_FOUND]: 'Resource not found',
  [errorTypes.UNAUTHORIZED]: 'Unauthorized access',
  [errorTypes.FORBIDDEN]: 'Forbidden access',
  [errorTypes.CONFLICT]: 'Resource conflict',
  [errorTypes.INTERNAL_SERVER_ERROR]: 'Internal server error',
}; 