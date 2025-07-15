import { db } from '../../../../db/index.js';
import { createValidationError, createNotFoundError } from '../../../../src/utils/error.js';
import { AppError } from '../../../../src/errors/app-error.js';

export async function validateCityId(cityId, request) {
  const logData = {
    method: request.method,
    path: request.path,
    cityId,
  };

  if (!cityId) {
    console.error('City ID is required', logData);
    throw createValidationError('City ID is required');
  }

  try {
    const city = await db('cities').where('id', cityId).first();

    if (!city) {
      throw createNotFoundError(`City with ID ${cityId} not found`);
    }

    return city;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error('Error validating city ID:', error);
    throw createValidationError('Invalid city ID');
  }
}

export async function validateVendingMachineId(vendingMachineId, request) {
  const logData = {
    method: request.method,
    path: request.path,
    vendingMachineId,
  };

  if (!vendingMachineId) {
    console.error('Vending machine ID is required', logData);
    throw createValidationError('Vending machine ID is required');
  }

  try {
    const vendingMachine = await db('vending_machines')
      .where('id', vendingMachineId)
      .first();

    if (!vendingMachine) {
      throw createNotFoundError(
        `Vending machine with ID ${vendingMachineId} not found`,
      );
    }

    return vendingMachine;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error('Error validating vending machine ID:', error);
    throw createValidationError('Invalid vending machine ID');
  }
}
