import redis from 'redis';
import logger from '../../src/utils/logger.js';
import { createClient } from 'redis';
import db from '../../db/index.js';
// Assign client based on if running in docker or not
const isDocker = process.env.DOCKER === 'true';
const client = createClient({
  url: isDocker
    ? 'redis://:local@redis:6379/0'
    : 'redis://:local@localhost:6379/0',
});

client.on('error', (err) => {
  logger.error('Redis error: ', err, {
    service: 'inventory-service',
    operation: 'redis-connection',
    error: err.message,
  });
  process.exit(1);
});

client.on('connect', () => {
  logger.info('Redis connected', {
    service: 'inventory-service',
    operation: 'redis-connection',
  });
});

client.on('ready', async () => {
  logger.info('Redis ready', {
    service: 'inventory-service',
    operation: 'redis-connection',
  });
  await configureInventory();
});

/**
 * Configures the inventory for the vending machine.
 */
async function configureInventory() {
  try {
    logger.info('Configuring inventory...', {
      service: 'inventory-service',
      operation: 'configure-inventory',
      script: 'configure_inventory.js',
      status: 'success',
    });

    // Snack Inventory Counts
    const snackInventories = await db('vending_machine_inventories')
      .select('*')
      .whereNotNull('quantity')
      .where('quantity', '>', 0);

    snackInventories.forEach(async (snackInventory) => {
      const redisKey = `${snackInventory.vending_machine_id}:${snackInventory.inventory_id}:${snackInventory.row_number}:${snackInventory.column_number}`;
      const redisValue = snackInventory.quantity;
      await client.set(redisKey, redisValue);
    });

    // Drink Inventory Counts
    const drinkInventories = await db('vending_machine_inventories')
      .select('*')
      .whereNotNull('quantity')
      .where('quantity', '>', 0);

    drinkInventories.forEach(async (drinkInventory) => {
      const redisKey = `${drinkInventory.vending_machine_id}:${drinkInventory.inventory_id}:${drinkInventory.row_number}:${drinkInventory.column_number}`;
      const redisValue = drinkInventory.quantity;
      await client.set(redisKey, redisValue);
    });

    logger.info('Inventory configured', {
      service: 'inventory-service',
      operation: 'configure-inventory',
      script: 'configure_inventory.js',
      status: 'success',
    });

    await client.quit();
    process.exit(0);
  } catch (err) {
    logger.error('Error configuring inventory:', err, {
      service: 'inventory-service',
      operation: 'configure-inventory',
      error: err.message,
    });
    process.exit(1);
  }
}

// Start the connection process
client.connect().catch((err) => {
  logger.error('Failed to connect to Redis:', err, {
    service: 'inventory-service',
    operation: 'redis-connection',
    error: err.message,
  });
  process.exit(1);
});

// Docker command to run the script
// docker exec -it -e DOCKER=true chimchar-app-1 node scripts/inventory/configure_inventory.js

// Local command to run the script
// node scripts/inventory/configure_inventory.js
