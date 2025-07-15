import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => {
  console.error('Redis error: ', err, {
    service: 'inventory-service',
    operation: 'redis-connection',
  });
});

redis.on('connect', () => {
  console.log('Redis connected', {
    service: 'inventory-service',
    operation: 'redis-connection',
  });
});

redis.on('ready', () => {
  console.log('Redis ready', {
    service: 'inventory-service',
    operation: 'redis-connection',
  });
});

const configureInventory = async () => {
  try {
    console.log('Configuring inventory...', {
      service: 'inventory-service',
      operation: 'configure-inventory',
    });

    // Configure inventory for vending machine ven_000001
    const vendingMachineId = 'ven_000001';
    const initialQuantity = 10;

    await redis.set(`inventory:${vendingMachineId}`, initialQuantity);

    // Verify the configuration
    const configuredQuantity = await redis.get(`inventory:${vendingMachineId}`);
    console.log('Inventory configured', {
      service: 'inventory-service',
      operation: 'configure-inventory',
      vendingMachineId,
      configuredQuantity: parseInt(configuredQuantity, 10),
    });

    await redis.quit();
  } catch (error) {
    console.error('Error configuring inventory:', error, {
      service: 'inventory-service',
      operation: 'configure-inventory',
      error: error.message,
    });
    process.exit(1);
  }
};

const main = async () => {
  try {
    await redis.ping();
    await configureInventory();
  } catch (error) {
    console.error('Failed to connect to Redis:', error, {
      service: 'inventory-service',
      operation: 'redis-connection',
      error: error.message,
    });
    process.exit(1);
  }
};

main();
