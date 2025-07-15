import knex from "knex";
import knexConfig from "../knexfile.js";
import dotenv from "dotenv";
dotenv.config();

const environment = process.env.NODE_ENV || "local";
console.log(`Environment: ${environment}`);

let config = knexConfig[environment];

// If running inside Docker, use the Docker database connection
if (process.env.DATABASE_URL) {
  config.connection = {
    host: 'db',
    port: 5432,
    database: 'chimchar-docker',
    user: 'admin',
    password: 'admin',
  };
}

config = {
  ...config,
  client: "pg",
};

const db = knex(config);

export { db };
