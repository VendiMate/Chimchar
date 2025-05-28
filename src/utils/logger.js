import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

/**
 * Create a standardized logger for the application
 * with console and Elasticsearch transports
 */
const createLogger = () => {
  // Configure Elasticsearch transport
  const esTransportConfig = createElasticsearchTransportConfig();
  const esTransport = new ElasticsearchTransport(esTransportConfig);

  // Handle transport errors
  esTransport.on('error', (error) => {
    console.error('Elasticsearch transport error:', error.message);
  });

  // Create the logger instance
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: createLogFormat(),
    defaultMeta: { service: 'vending-machine-service' },
    transports: [createConsoleTransport(), esTransport],
    // Exit on error: false prevents winston from exiting on uncaught transport errors
    exitOnError: false,
  });

  // Add request logger helper function
  logger.logRequest = createRequestLogger(logger);

  return logger;
};

/**
 * Creates the Elasticsearch transport configuration
 */
const createElasticsearchTransportConfig = () => {
  return {
    level: 'info',
    clientOpts: {
      node: process.env.ELASTICSEARCH_NODE || 'http://elasticsearch:9200',
      waitForActiveShards: 1,
      maxRetries: 3,
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
            level: { type: 'keyword' },
            service: { type: 'keyword' },
            method: { type: 'keyword' },
            path: { type: 'keyword' },
            status: { type: 'keyword' },
            duration: { type: 'long' },
            error: {
              properties: {
                message: { type: 'text' },
                stack: { type: 'text' },
                code: { type: 'keyword' },
              },
            },
            // Add other fields as needed
            metadata: { type: 'object', dynamic: true },
          },
        },
      },
    },
    // Circuit breaker pattern
    retryLimit: 3,
    retryInterval: 2000,
    bufferLimit: 100, // Store up to 100 logs if ES is down
  };
};

/**
 * Creates the log format with proper error handling
 */
const createLogFormat = () => {
  // Format for standardizing error objects
  const errorFormat = winston.format((info) => {
    if (info.error) {
      // Handle different error formats consistently
      if (typeof info.error === 'string') {
        info.error = { message: info.error };
      } else if (info.error instanceof Error) {
        info.error = {
          message: info.error.message,
          stack: info.error.stack,
          ...(info.error.code ? { code: info.error.code } : {}),
        };
      }
    }
    return info;
  });

  return winston.format.combine(
    winston.format.timestamp(),
    errorFormat(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  );
};

/**
 * Creates a console transport with appropriate formatting
 */
const createConsoleTransport = () => {
  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...rest }) => {
        // Format error objects for better console readability
        const errorStr = rest.error
          ? `\n  Error: ${
              typeof rest.error === 'object'
                ? rest.error.message || JSON.stringify(rest.error)
                : rest.error
            }`
          : '';

        // Clean up metadata for console display
        const { error, ...metadata } = rest;
        const metaStr = Object.keys(metadata).length
          ? ` ${JSON.stringify(metadata)}`
          : '';

        return `${timestamp} ${level}: ${message}${errorStr}${metaStr}`;
      }),
    ),
  });
};

/**
 * Request logger helper to standardize API request logging
 */
const createRequestLogger = (logger) => {
  return (opts) => {
    const {
      request,
      level = 'info',
      message,
      error = null,
      start = null,
      additionalData = {},
    } = opts;

    // Calculate request duration if start time was provided
    const startTime = start || request?.info?.received || Date.now();
    const duration = Date.now() - startTime;

    // Build standard log data structure for API requests
    const logData = {
      method: request?.method?.toUpperCase(),
      path: request?.path,
      duration,
      status: error ? 'error' : 'success',
      ...additionalData,
    };

    // Add error information if present
    if (error) {
      logData.error = error;
    }

    // Log with appropriate level
    logger.log(level, message, logData);

    return logData;
  };
};

// Create and export the logger instance
const logger = createLogger();
export default logger;
