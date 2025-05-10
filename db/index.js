import knex from 'knex';
import knexConfig from '../knexfile.js';
import dotenv from 'dotenv';
import logger from '../src/utils/logger.js';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
let config = knexConfig[environment];

logger.info('Environment:', environment);
config = {
  ...config,
  client: 'pg',
};

const db = knex(config);

export { db };
