import { AppError, errorTypes, errorMessages } from '../errors/app-error.js';

export const createError = (type, message, statusCode) => {
  return new AppError(message || errorMessages[type], statusCode);
};

export const createValidationError = (message) => {
  return createError(errorTypes.VALIDATION_ERROR, message, 400);
};

export const createNotFoundError = (message) => {
  return createError(errorTypes.NOT_FOUND, message, 404);
};

export const createUnauthorizedError = (message) => {
  return createError(errorTypes.UNAUTHORIZED, message, 401);
};

export const createForbiddenError = (message) => {
  return createError(errorTypes.FORBIDDEN, message, 403);
};

export const createConflictError = (message) => {
  return createError(errorTypes.CONFLICT, message, 409);
};

export const createInternalServerError = (message) => {
  return createError(errorTypes.INTERNAL_SERVER_ERROR, message, 500);
};
