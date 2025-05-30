import dotenv from 'dotenv';
dotenv.config();

const environments = {
  local: {
    api: {
      url: 'http://localhost:3003',
      cors: ['http://localhost:3000', 'http://localhost:3001'],
    },
    database: {
      host: 'localhost',
      port: 5430,
      name: 'chimchar-docker',
      user: 'admin',
      password: 'admin',
    },
    redis: {
      url: 'redis://:local@localhost:6379/0',
    },
    elasticsearch: {
      url: 'http://localhost:9200',
    },
  },
  staging: {
    api: {
      url: 'https://chimchar-api-staging.onrender.com',
      cors: [
        'https://staging.chimchar.app',
        'http://localhost:3000',
        'https://vendimate-staging.netlify.app',
      ],
    },
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    redis: {
      url: process.env.REDIS_URL,
    },
    elasticsearch: {
      url: process.env.ELASTICSEARCH_URL,
    },
  },
  production: {
    api: {
      url: 'https://chimchar-api.onrender.com',
      cors: ['https://chimchar.app', 'https://www.chimchar.app'],
    },
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    redis: {
      url: process.env.REDIS_URL,
    },
    elasticsearch: {
      url: process.env.ELASTICSEARCH_URL,
    },
  },
};

const environment = process.env.NODE_ENV || 'local';
const config = environments[environment];

if (!config) {
  throw new Error(`Invalid environment: ${environment}`);
}

export default config;
