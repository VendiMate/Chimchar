import Hapi from '@hapi/hapi';
import { plugin as mapsPlugin } from './features/plugins/maps/index.js';
import { plugin as inventoryPlugin } from './features/plugins/inventory/index.js';
import { plugin as transactionPlugin } from './features/plugins/transaction/index.js';
import { plugin as healthPlugin } from './features/plugins/health/index.js';
import { errorHandler } from './error-handler.js';
import requestLogger from '../src/middleware/logger-handler.js';
import config from '../src/config/index.js';

const server = Hapi.server({
  port: process.env.PORT || 3003,
  host: '0.0.0.0',
  routes: {
    cors: {
      origin: config.api.cors,
      headers: ['Accept', 'Authorization', 'Content-Type'],
      additionalHeaders: ['X-Requested-With'],
    },
  },
  router: {
    stripTrailingSlash: true,
  },
});

const registerRoutes = async (server) => {
  await server.register([
    requestLogger,
    {
      plugin: mapsPlugin,
      routes: {
        prefix: '/v1',
      },
    },
    {
      plugin: inventoryPlugin,
      routes: {
        prefix: '/v1',
      },
    },
    {
      plugin: transactionPlugin,
      routes: {
        prefix: '/v1',
      },
    },
    {
      plugin: healthPlugin,
      routes: {
        prefix: '/v1',
      },
    },
    errorHandler,
  ]);
  console.log('Routes registered successfully');
};

const configureServer = async () => {
  await registerRoutes(server);
  return server;
};

export default configureServer;
