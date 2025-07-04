import dotenv from 'dotenv';
dotenv.config();

const baseConfig = {
  client: 'postgresql',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
  pool: {
    min: 2,
    max: 10,
  },
};

// Helper function to validate production config
const validateProductionConfig = () => {
  const requiredEnvVars = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'DB_PORT',
  ];
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
};

// Helper function to get SSL config for Render
const getRenderSSLConfig = () => ({
  ssl: {
    rejectUnauthorized: false, // This allows self-signed certificates
  },
});

const knexConfig = {
  development: {
    ...baseConfig,
    connection: {
      host: 'db',
      database: 'chimchar-docker',
      user: 'admin',
      password: 'admin',
      port: 5432,
    },
  },
  docker: {
    ...baseConfig,
    connection: {
      host: 'db',
      database: 'chimchar-docker',
      user: 'admin',
      password: 'admin',
      port: 5432,
    },
  },
  production: {
    ...baseConfig,
    connection: () => {
      validateProductionConfig();
      return {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ...getRenderSSLConfig(),
      };
    },
  },
  staging: {
    ...baseConfig,
    connection: () => {
      validateProductionConfig();
      return {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ...getRenderSSLConfig(),
      };
    },
  },
  local: {
    ...baseConfig,
    connection: {
      host: 'db',
      database: 'chimchar-docker',
      user: 'admin',
      password: 'admin',
      port: 5432,
    },
  },
};

// Validate production config immediately if in production environment
if (process.env.NODE_ENV === 'production') {
  validateProductionConfig();
}

export default knexConfig;

// For rollback
// docker-compose exec app npm run db:rollback
