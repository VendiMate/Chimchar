import Redis from 'ioredis';
import config from '../config/index.js';

// Only create Redis connection if REDIS_URL is provided
let redis = null;
if (process.env.REDIS_URL) {
  redis = new Redis(config.redis.url, {
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('connect', () => {
    console.log('Redis client connected');
  });

  redis.on('error', (err) => {
    console.error('Redis client error:', err);
  });
} else {
  console.log('No REDIS_URL provided, Redis service disabled');
}

export default redis;
