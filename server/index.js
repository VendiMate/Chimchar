import logger from '../src/utils/logger.js';
import configureServer from './server.js';

// Add global error handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Don't exit, just log the error
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  // Don't exit, just log the error
});

const startServer = async () => {
  try {
    const server = await configureServer();
    await server.start();
    logger.info(`Server running at: ${server.info.uri}`);
  } catch (error) {
    logger.error('Error starting server: ', error);
    process.exit(1); // Only exit on server start failure
  }
};

startServer();
