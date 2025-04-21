import redis from 'redis';
import { createClient } from 'redis';

const redisOpts = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
  db: process.env.REDIS_DB || 0,
  tls: process.env.USE_TLS ? {} : undefined,
};

const client = createClient(redisOpts);

client.on('error', (err) => {
  logger.error('Redis error: ', err, {
    service: 'inventory-service-library',
    operation: 'redis-connection',
    error: err.message,
  });
});

/**
 * Gets the inventory for a given vending machine, inventory id, row number, and column number.
 * @param {*} vendingMachineId | string
 * @param {*} inventoryId | string
 * @param {*} rowNumber | number
 * @param {*} columnNumber | number
 * @returns | number
 */
async function getInventory(
  vendingMachineId,
  inventoryId,
  rowNumber,
  columnNumber,
) {
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
}

/**
 * Increments the inventory for a given vending machine, inventory id, row number, and column number by a given amount.
 * @param {*} vendingMachineId | string
 * @param {*} inventoryId | string
 * @param {*} rowNumber | number
 * @param {*} columnNumber | number
 * @param {*} amount | number
 */
async function incrementInventory(
  vendingMachineId,
  inventoryId,
  rowNumber,
  columnNumber,
  amount = 1,
) {
  const redisKey = `${vendingMachineId}:${inventoryId}:${rowNumber}:${columnNumber}`;
  await client.incrby(redisKey, amount);
}

/**
 * Decrements the inventory for a given vending machine, inventory id, row number, and column number by a given amount.
 * @param {*} vendingMachineId | string
 * @param {*} inventoryId | string
 * @param {*} rowNumber | number
 * @param {*} columnNumber | number
 * @param {*} amount | number
 */
async function decrementInventory(
  vendingMachineId,
  inventoryId,
  rowNumber,
  columnNumber,
  amount = 1,
) {
  const redisKey = `${vendingMachineId}:${inventoryId}:${rowNumber}:${columnNumber}`;
  await client.decrby(redisKey, amount);
}

/**
 * Sets the inventory for a given vending machine, inventory id, row number, and column number to a given amount.
 * @param {*} vendingMachineId | string
 * @param {*} inventoryId | string
 * @param {*} rowNumber | number
 * @param {*} columnNumber | number
 * @param {*} amount | number
 */
async function setInventory(
  vendingMachineId,
  inventoryId,
  rowNumber,
  columnNumber,
  amount,
) {
  const redisKey = `${vendingMachineId}:${inventoryId}:${rowNumber}:${columnNumber}`;
  await client.set(redisKey, amount);
}
