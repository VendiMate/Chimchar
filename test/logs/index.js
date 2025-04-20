import logger from '../../src/utils/logger.js';

export const plugin = {
  name: 'test',
  version: '1.0.0',
  register: async (server) => {
    server.route({
      method: 'POST',
      path: '/test-log',
      handler: async (request, h) => {
        logger.info('Test info message', { testField: 'test value' });
        logger.error('Test error message', { errorField: 'error details' });
        return { message: 'Logs generated' };
      },
    });
  },
};
