import Redis from 'ioredis';
import { db } from '../../../db/index.js';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => {
  console.error('Redis error:', {
    error: err.message,
    code: err.code,
  });
});

redis.on('connect', () => {
  console.log('Redis connected', {
    host: redis.options.host,
    port: redis.options.port,
  });
});

redis.on('ready', () => {
  console.log('Redis ready', {
    host: redis.options.host,
    port: redis.options.port,
  });
});

// Check if Redis is available
const isRedisAvailable = async () => {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.log('Redis not available, falling back to database');
    return false;
  }
};

// Get inventory from database as fallback
const getInventoryFromDatabase = async (vendingMachineId, inventoryId = null, rowNumber = null, columnNumber = null) => {
  try {
    let query = db('vending_machine_inventories')
      .where('vending_machine_id', vendingMachineId);
    
    if (inventoryId) {
      query = query.where('inventory_id', inventoryId);
    }
    
    if (rowNumber !== null && columnNumber !== null) {
      query = query.where('row_number', rowNumber)
                   .where('column_number', columnNumber);
    }
    
    const result = await query.sum('quantity as total_quantity').first();
    return result?.total_quantity || 0;
  } catch (error) {
    console.error('Database fallback error:', error);
    return 0;
  }
};

// Set inventory in database as fallback
const setInventoryInDatabase = async (vendingMachineId, quantity, inventoryId = null, rowNumber = null, columnNumber = null) => {
  try {
    let query = db('vending_machine_inventories')
      .where('vending_machine_id', vendingMachineId);
    
    if (inventoryId) {
      query = query.where('inventory_id', inventoryId);
    }
    
    if (rowNumber !== null && columnNumber !== null) {
      query = query.where('row_number', rowNumber)
                   .where('column_number', columnNumber);
    }
    
    await query.update({ quantity });
    return quantity;
  } catch (error) {
    console.error('Database fallback error:', error);
    throw error;
  }
};

const connectWithRetry = async (maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await redis.ping();
      console.log('Redis connection successful');
      return true;
    } catch (err) {
      console.error('Redis error: ', err, {
        attempt: i + 1,
        maxRetries,
      });

      if (i === maxRetries - 1) {
        console.error('Failed to connect to Redis after max retries', {
          maxRetries,
          error: err.message,
        });
        return false; // Don't throw, just return false
      }

      console.log('Redis connection failed, retrying...', {
        attempt: i + 1,
        maxRetries,
        delay: 1000 * (i + 1),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const getInventory = async (vendingMachineId, inventoryId = null, rowNumber = null, columnNumber = null) => {
  try {
    // Try Redis first
    if (await isRedisAvailable()) {
      const key = `inventory:${vendingMachineId}${inventoryId ? `:${inventoryId}` : ''}${rowNumber !== null ? `:${rowNumber}:${columnNumber}` : ''}`;
      const inventory = await redis.get(key);

      if (!inventory) {
        return 0;
      }

      const quantity = parseInt(inventory, 10);

      if (quantity < 0) {
        console.log('Inventory is less than 0', {
          vendingMachineId,
          inventoryId,
          rowNumber,
          columnNumber,
          quantity,
        });
        return 0;
      }

      return quantity;
    } else {
      // Fallback to database
      console.log('Using database fallback for inventory lookup');
      return await getInventoryFromDatabase(vendingMachineId, inventoryId, rowNumber, columnNumber);
    }
  } catch (error) {
    console.error('Error getting inventory:', {
      vendingMachineId,
      inventoryId,
      rowNumber,
      columnNumber,
      error: error.message,
    });
    
    // Final fallback to database
    console.log('Redis failed, using database fallback');
    return await getInventoryFromDatabase(vendingMachineId, inventoryId, rowNumber, columnNumber);
  }
};

export const incrementInventory = async (vendingMachineId, inventoryId = null, rowNumber = null, columnNumber = null, amount = 1) => {
  try {
    // Try Redis first
    if (await isRedisAvailable()) {
      const key = `inventory:${vendingMachineId}${inventoryId ? `:${inventoryId}` : ''}${rowNumber !== null ? `:${rowNumber}:${columnNumber}` : ''}`;
      const newQuantity = await redis.incrby(key, amount);
      return newQuantity;
    } else {
      // Fallback to database
      console.log('Using database fallback for inventory increment');
      const currentQuantity = await getInventoryFromDatabase(vendingMachineId, inventoryId, rowNumber, columnNumber);
      const newQuantity = currentQuantity + amount;
      await setInventoryInDatabase(vendingMachineId, newQuantity, inventoryId, rowNumber, columnNumber);
      return newQuantity;
    }
  } catch (error) {
    console.error('Error incrementing inventory:', {
      vendingMachineId,
      inventoryId,
      rowNumber,
      columnNumber,
      amount,
      error: error.message,
    });
    
    // Final fallback to database
    console.log('Redis failed, using database fallback for increment');
    const currentQuantity = await getInventoryFromDatabase(vendingMachineId, inventoryId, rowNumber, columnNumber);
    const newQuantity = currentQuantity + amount;
    await setInventoryInDatabase(vendingMachineId, newQuantity, inventoryId, rowNumber, columnNumber);
    return newQuantity;
  }
};

export const decrementInventory = async (vendingMachineId, inventoryId = null, rowNumber = null, columnNumber = null, amount = 1) => {
  try {
    // Try Redis first
    if (await isRedisAvailable()) {
      const key = `inventory:${vendingMachineId}${inventoryId ? `:${inventoryId}` : ''}${rowNumber !== null ? `:${rowNumber}:${columnNumber}` : ''}`;
      const currentQuantity = await getInventory(vendingMachineId, inventoryId, rowNumber, columnNumber);

      if (currentQuantity < amount) {
        console.error('Insufficient inventory', {
          vendingMachineId,
          inventoryId,
          rowNumber,
          columnNumber,
          currentQuantity,
          requestedAmount: amount,
        });
        throw new Error('Insufficient inventory');
      }

      const newQuantity = await redis.decrby(key, amount);
      return newQuantity;
    } else {
      // Fallback to database
      console.log('Using database fallback for inventory decrement');
      const currentQuantity = await getInventoryFromDatabase(vendingMachineId, inventoryId, rowNumber, columnNumber);

      if (currentQuantity < amount) {
        console.error('Insufficient inventory', {
          vendingMachineId,
          inventoryId,
          rowNumber,
          columnNumber,
          currentQuantity,
          requestedAmount: amount,
        });
        throw new Error('Insufficient inventory');
      }

      const newQuantity = currentQuantity - amount;
      await setInventoryInDatabase(vendingMachineId, newQuantity, inventoryId, rowNumber, columnNumber);
      return newQuantity;
    }
  } catch (error) {
    console.error('Error decrementing inventory:', {
      vendingMachineId,
      inventoryId,
      rowNumber,
      columnNumber,
      amount,
      error: error.message,
    });
    
    // Final fallback to database
    console.log('Redis failed, using database fallback for decrement');
    const currentQuantity = await getInventoryFromDatabase(vendingMachineId, inventoryId, rowNumber, columnNumber);

    if (currentQuantity < amount) {
      throw new Error('Insufficient inventory');
    }

    const newQuantity = currentQuantity - amount;
    await setInventoryInDatabase(vendingMachineId, newQuantity, inventoryId, rowNumber, columnNumber);
    return newQuantity;
  }
};

export const setInventory = async (vendingMachineId, quantity, inventoryId = null, rowNumber = null, columnNumber = null) => {
  try {
    // Try Redis first
    if (await isRedisAvailable()) {
      const key = `inventory:${vendingMachineId}${inventoryId ? `:${inventoryId}` : ''}${rowNumber !== null ? `:${rowNumber}:${columnNumber}` : ''}`;
      await redis.set(key, quantity);
      return quantity;
    } else {
      // Fallback to database
      console.log('Using database fallback for inventory set');
      await setInventoryInDatabase(vendingMachineId, quantity, inventoryId, rowNumber, columnNumber);
      return quantity;
    }
  } catch (error) {
    console.error('Error setting inventory:', {
      vendingMachineId,
      inventoryId,
      rowNumber,
      columnNumber,
      quantity,
      error: error.message,
    });
    
    // Final fallback to database
    console.log('Redis failed, using database fallback for set');
    await setInventoryInDatabase(vendingMachineId, quantity, inventoryId, rowNumber, columnNumber);
    return quantity;
  }
};

export { connectWithRetry };
