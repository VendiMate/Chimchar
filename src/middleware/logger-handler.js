const requestLogger = {
  name: 'request-logger',
  version: '1.0.0',
  register: async (server) => {
    // Store start time in request.app
    server.ext('onRequest', (request, h) => {
      request.app.startTime = Date.now();
      return h.continue;
    });

    // Log the request after response is ready
    server.ext('onPreResponse', (request, h) => {
      const duration = Date.now() - request.app.startTime;

      console.log('API Request', {
        method: request.method,
        path: request.path,
        statusCode: request.response?.statusCode || 500,
        duration: `${duration}ms`,
        userAgent: request.headers['user-agent'],
        ip: request.info.remoteAddress,
      });

      return h.continue;
    });
  },
};

export default requestLogger;
