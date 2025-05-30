import knex from 'knex';
import knexfile from '../knexfile.js';
import config from '../src/config/index.js';
import dotenv from 'dotenv';
import logger from '../src/utils/logger.js';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const dbConfig = knexfile[environment];

// Override database connection with environment-specific config
if (environment !== 'local') {
  dbConfig.connection = {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    ssl: { rejectUnauthorized: false },
  };
}

logger.info('Environment:', environment);

const db = knex(dbConfig);

export default db;
