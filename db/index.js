import knex from 'knex';
import knexConfig from '../knexfile.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
let config = knexConfig[environment];

console.log('Environment:', environment);

config = {
  ...config,
  client: 'pg',
};

const db = knex(config);

export { db };
