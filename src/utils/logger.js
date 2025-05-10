import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const esTransportOpts = {
  level: 'info',
  // Configuration for the Elasticsearch client
  clientOpts: {
    node: process.env.ELASTICSEARCH_NODE || 'http://elasticsearch:9200',
    // Wait for at least one shard to be available
    waitForActiveShards: 1,
    // Additional client options
    maxRetries: 5,
    requestTimeout: 10000,
  },
  indexPrefix: 'logs-app',
  dataStream: true,
  ensureIndexTemplate: true,
  indexTemplate: {
    index_patterns: ['logs-app-*'],
    template: {
      settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
      },
      mappings: {
        properties: {
          '@timestamp': { type: 'date' },
          message: { type: 'text' },
          severity: { type: 'keyword' },
          fields: { type: 'object' },
          error: { type: 'object' },
          metadata: { type: 'object' },
          requestPath: { type: 'keyword' },
          errorMessage: { type: 'text' },
        },
      },
    },
  },
};

// Create Elasticsearch transport
const esTransport = new ElasticsearchTransport(esTransportOpts);

// Add error handling for the transport
esTransport.on('error', (error) => {
  console.error('Elasticsearch transport error:', error);
});

esTransport.on('writing', (info) => {
  console.log('Writing to Elasticsearch:', info);
});

// Custom format for error messages
const errorFormat = winston.format((info) => {
  if (info.level === 'error') {
    // If the message is an object, convert it to a string
    if (typeof info.message === 'object') {
      // Extract request path and error message if available
      const { requestPath, error: errorObj, ...rest } = info.message;

      // Create a structured error object
      info.message = JSON.stringify({
        ...rest,
        requestPath: requestPath || 'unknown',
        errorMessage: errorObj?.message || 'Unknown error',
      });
    }
    // If there's an error object, add it to the error field
    if (info.error) {
      info.error = {
        message: info.error.message,
        stack: info.error.stack,
        ...info.error,
      };
    }
  }
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    errorFormat(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'vending-machine-service' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // Elasticsearch transport
    esTransport,
  ],
});

// Error handling state
let errorCount = 0;
const MAX_ERROR_RETRIES = 3;
let isErrorLoggingDisabled = false;

// Override the error method
const originalError = logger.error;
logger.error = function (...args) {
  if (isErrorLoggingDisabled) {
    console.error('Error logging is disabled due to previous errors');
    return;
  }

  if (errorCount >= MAX_ERROR_RETRIES) {
    console.error('Maximum error retries reached, disabling error logging');
    isErrorLoggingDisabled = true;
    return;
  }

  errorCount++;

  // Format the error message
  const [message, ...meta] = args;
  let formattedMessage = message;

  if (typeof message === 'object') {
    formattedMessage = JSON.stringify(message);
  }

  return originalError.call(this, formattedMessage, ...meta);
};

// Reset error count periodically (every 5 minutes)
setInterval(
  () => {
    errorCount = 0;
    isErrorLoggingDisabled = false;
  },
  5 * 60 * 1000,
);

// // Test the logger
// logger.info('Logger initialized successfully', {
//   timestamp: new Date().toISOString(),
//   environment: process.env.NODE_ENV || 'development',
// });

export default logger;
