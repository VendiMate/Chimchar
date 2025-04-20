import { db } from '../../../../db/index.js';
import {
  createNotFoundError,
  createValidationError,
} from '../../../../src/utils/error.js';
import logger from '../../../../src/utils/logger.js';
export async function validateCityId(cityId, request) {
  // First validate if cityId is provided
  const logData = {
    method: request.method,
    path: request.path,
    startTime: new Date().toISOString(),
  };
  if (!cityId) {
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'not_found',
    });
    logger.error('City ID is required', logData);
    throw createValidationError('City ID is required');
  }

  // Check if city exists
  const city = await db('location_cities')
    .select('*')
    .where('id', cityId)
    .first();

  if (!city) {
    throw createNotFoundError(`City with ID ${cityId} not found`);
  }
}

export async function validateVendingMachineId(vendingMachineId, request) {
  const logData = {
    method: request.method,
    path: request.path,
    startTime: new Date().toISOString(),
  };
  if (!vendingMachineId) {
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'not_found',
    });
    logger.error('Vending machine ID is required', logData);
    throw createValidationError('Vending machine ID is required');
  }
  const vendingMachine = await db('vending_machines')
    .select('*')
    .where('id', vendingMachineId)
    .first();
  if (!vendingMachine) {
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'not_found',
    });
    logger.error('Vending machine ID not found', logData);
    throw createNotFoundError(
      `Vending machine with ID ${vendingMachineId} not found`,
    );
  }
}
