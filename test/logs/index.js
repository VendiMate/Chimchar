export const plugin = {
  name: 'test',
  version: '1.0.0',
  register: async (server) => {
    server.route({
      method: 'POST',
      path: '/test-log',
      handler: async (request, h) => {
        console.info('Test info message', { testField: 'test value' });
        console.error('Test error message', { errorField: 'error details' });
        return { message: 'Logs generated' };
      },
    });
  },
};
