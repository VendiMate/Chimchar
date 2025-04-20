import { AppError } from '../src/errors/app-error.js';

export const errorHandler = {
  name: 'errorHandler',
  version: '1.0.0',
  register: async (server) => {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response;

      // Handle Joi validation errors
      if (response.isJoi) {
        const error = new AppError(response.details[0].message, 400, true);
        return h
          .response({
            status: error.statusCode.toString(),
            message: error.message,
          })
          .code(error.statusCode);
      }

      // Handle Boom errors
      if (response.isBoom) {
        const error = new AppError(
          response.message,
          response.output.statusCode,
          true,
        );
        return h
          .response({
            status: error.statusCode.toString(),
            message: error.message,
          })
          .code(error.statusCode);
      }

      // Handle our custom AppError
      if (response instanceof AppError) {
        return h
          .response({
            status: response.statusCode.toString(),
            message: response.message,
          })
          .code(response.statusCode);
      }

      // Handle unknown event responses
      if (!response || response === '') {
        return h
          .response({
            status: '500',
            message: 'Internal server error',
          })
          .code(500);
      }

      // Handle other errors
      if (response instanceof Error) {
        console.error('Unhandled error:', response);
        return h
          .response({
            status: '500',
            message: 'Internal server error',
          })
          .code(500);
      }

      return h.continue;
    });
  },
};
