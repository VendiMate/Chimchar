import logger from '../../../../src/utils/logger.js';
import {
  getInventory,
  decrementInventory,
} from '../../../lib/redis/inventory.js';
import { validateDispenseParams, getInventoryId } from './helper.js';

export async function dispenseTransaction(request, h) {
  const { vendingMachineId, rowNumber, columnNumber } = request.payload;

  const logData = {
    vendingMachineId: vendingMachineId,
    rowNumber: rowNumber,
    columnNumber: columnNumber,
    requestPath: request.path,
    timestamp: new Date().toISOString(),
  };
  const amount = request.payload.amount || undefined;
  try {
    const inventoryId = await getInventoryId(
      vendingMachineId,
      rowNumber,
      columnNumber,
    );
    if (amount) {
      const inventory = await getInventory(
        vendingMachineId,
        inventoryId,
        rowNumber,
        columnNumber,
      );
      if (inventory < amount) {
        logData.error = {
          message: 'Insufficient inventory',
          code: 'INSUFFICIENT_INVENTORY',
        };
        logger.error(logData);
        return h.response({ error: 'Insufficient inventory' }).code(400);
      }
    }
    await decrementInventory(
      vendingMachineId,
      inventoryId,
      rowNumber,
      columnNumber,
      amount,
    );
    logData.message = 'Transaction successful';
    logger.info(logData);
    return h.response({ message: 'Transaction successful' }).code(200);
  } catch (error) {
    logData.error = {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      stack: error.stack,
    };
    logger.error(logData);
    return h.response({ error: error.message }).code(400);
  }
}

export async function restockTransaction(request, h) {
  return h.response({ message: 'Restock transaction successful' }).code(200);
}
