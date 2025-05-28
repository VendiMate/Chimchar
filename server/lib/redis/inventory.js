import { createClient } from 'redis';
import logger from '../../../src/utils/logger.js';

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        logger.error('Max retries reached', {
          retries,
        });
        return new Error('Max retries reached');
      }
      return Math.min(retries * 1000, 1000);
    },
  },
});

// Event handlers
client.on('error', (err) => {
  logger.error('Redis error: ', err, {
    service: 'inventory-service-library',
    operation: 'redis-connection',
    error: err.message,
  });
});

client.on('connect', () => {
  logger.info('Redis connected', {
    service: 'inventory-service',
    operation: 'redis-connection',
  });
});

client.on('ready', () => {
  logger.info('Redis ready', {
    service: 'inventory-service',
    operation: 'redis-connection',
  });
});

// Add connection management with retry logic
let connectionPromise = null;
let retryCount = 0;
const MAX_RETRIES = 5;

const getConnection = () => {
  if (!connectionPromise) {
    connectionPromise = new Promise((resolve, reject) => {
      const attemptConnection = async () => {
        try {
          await client.connect();
          resolve();
        } catch (err) {
          connectionPromise = null;
          retryCount++;

          if (retryCount >= MAX_RETRIES) {
            logger.error('Failed to connect to Redis after max retries', {
              error: err.message,
              retryCount,
            });
            reject(new Error('Failed to connect to Redis after max retries'));
            return;
          }

          logger.warn('Redis connection failed, retrying...', {
            error: err.message,
            retryCount,
            nextRetryIn: '1s',
          });

          // Wait 1 second before retrying
          setTimeout(() => {
            attemptConnection().catch(reject);
          }, 1000);
        }
      };

      attemptConnection().catch(reject);
    });
  }
  return connectionPromise;
};

/**
 * Gets the inventory for a given vending machine, inventory id, row number, and column number.
 * @param {*} vendingMachineId | string
 * @param {*} inventoryId | string
 * @param {*} rowNumber | number
 * @param {*} columnNumber | number
 * @returns | number
 */
export async function getInventory(
  vendingMachineId,
  inventoryId,
  rowNumber,
  columnNumber,
) {
  try {
    await getConnection();
    const redisKey = `${vendingMachineId}:${inventoryId}:${rowNumber}:${columnNumber}`;
    const inventory = await client.get(redisKey);
    if (inventory < 0) {
      logger.warn('Inventory is less than 0', {
        service: 'inventory-service-library',
        operation: 'get-inventory',
        inventoryKey: redisKey,
        inventory: inventory,
      });
      return 0;
    }
    return inventory;
  } catch (error) {
    logger.error('Error getting inventory:', {
      vendingMachineId,
      rowNumber,
      columnNumber,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Increments the inventory for a given vending machine, inventory id, row number, and column number by a given amount.
 * @param {*} vendingMachineId | string
 * @param {*} inventoryId | string
 * @param {*} rowNumber | number
 * @param {*} columnNumber | number
 * @param {*} amount | number
 */
export async function incrementInventory(
  vendingMachineId,
  inventoryId,
  rowNumber,
  columnNumber,
  amount = 1,
) {
  try {
    await getConnection();
    const redisKey = `${vendingMachineId}:${inventoryId}:${rowNumber}:${columnNumber}`;
    await client.incrBy(redisKey, amount);
  } catch (error) {
    logger.error('Error incrementing inventory:', {
      vendingMachineId,
      inventoryId,
      rowNumber,
      columnNumber,
      amount,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Decrements the inventory for a given vending machine, inventory id, row number, and column number by a given amount.
 * @param {*} vendingMachineId | string
 * @param {*} inventoryId | string
 * @param {*} rowNumber | number
 * @param {*} columnNumber | number
 * @param {*} amount | number
 */
export async function decrementInventory(
  vendingMachineId,
  inventoryId,
  rowNumber,
  columnNumber,
  amount = 1,
) {
  try {
    await getConnection();
    if (!amount) {
      amount = 1;
    }
    const redisKey = `${vendingMachineId}:${inventoryId}:${rowNumber}:${columnNumber}`;
    const currentInventory = await client.get(redisKey);
    if (currentInventory < amount) {
      logger.error('Insufficient inventory', {
        vendingMachineId,
        inventoryId,
        rowNumber,
        columnNumber,
        amount,
      });
      throw new Error('Insufficient inventory');
    }
    await client.decrBy(redisKey, amount);
  } catch (error) {
    logger.error('Error decrementing inventory:', {
      vendingMachineId,
      inventoryId,
      rowNumber,
      columnNumber,
      amount,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Sets the inventory for a given vending machine, inventory id, row number, and column number to a given amount.
 * @param {*} vendingMachineId | string
 * @param {*} inventoryId | string
 * @param {*} rowNumber | number
 * @param {*} columnNumber | number
 * @param {*} amount | number
 */
export async function setInventory(
  vendingMachineId,
  inventoryId,
  rowNumber,
  columnNumber,
  amount,
) {
  try {
    await getConnection();
    const redisKey = `${vendingMachineId}:${inventoryId}:${rowNumber}:${columnNumber}`;
    await client.set(redisKey, amount);
  } catch (error) {
    logger.error('Error setting inventory:', {
      vendingMachineId,
      inventoryId,
      rowNumber,
      columnNumber,
      amount,
      error: error.message,
    });
    throw error;
  }
}
