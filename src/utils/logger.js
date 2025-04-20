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

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
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

// Test the logger
logger.info('Logger initialized successfully', {
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
});

export default logger;
