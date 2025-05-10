import logger from '../src/utils/logger.js';
import configureServer from './server.js';

const startServer = async () => {
  try {
    const server = await configureServer();
    await server.start();
    logger.info('Server running at: ', server.info.uri);
  } catch (error) {
    logger.error('Error starting server: ', error);
    process.exit(1);
  }
};

startServer();
