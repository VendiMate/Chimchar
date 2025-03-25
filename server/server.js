import Hapi from '@hapi/hapi';
import { plugin as mapsPlugin } from './features/plugins/maps/index.js';
const server = Hapi.server({
  port: process.env.PORT || 3003,
  host: 'localhost',
  router: {
    stripTrailingSlash: true,
  },
});

const registerRoutes = async (server) => {
  await server.register([
    {
      plugin: mapsPlugin,
      routes: {
        prefix: '/v1',
      },
    },
  ]);
  console.log('Routes registered successfully');
};

const configureServer = async () => {
  await registerRoutes(server);
  return server;
};

export default configureServer;
