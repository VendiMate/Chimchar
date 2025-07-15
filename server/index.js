import configureServer from './server.js';

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit, just log the error
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  // Don't exit, just log the error
});

const startServer = async () => {
  try {
    const server = await configureServer();
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.error('Error starting server: ', error);
    process.exit(1); // Only exit on server start failure
  }
};

startServer();
