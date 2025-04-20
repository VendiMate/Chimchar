import { db } from '../../../../db/index.js';
import { AppError } from '../../../../src/errors/app-error.js';
import {
  createNotFoundError,
  createValidationError,
  createInternalServerError,
} from '../../../../src/utils/error.js';
import { validateCityId, validateVendingMachineId } from './helper.js';
import logger from '../../../../src/utils/logger.js';

export async function getVendingMachines(request, h) {
  const logData = {
    method: request.method,
    path: request.path,
    startTime: new Date().toISOString(),
  };

  try {
    const vendingMachines = await db('vending_machines').select('*');

    // Update the log object with completion data
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      count: vendingMachines.length,
      status: 'success',
    });

    // Log once at the end with all information
    logger.info('Vending machines fetch completed', logData);

    return h
      .response({
        status: '200',
        data: vendingMachines,
      })
      .code(200);
  } catch (error) {
    // Update log object with error information
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'error',
      error: error.message,
    });

    // Log the error once
    logger.error('Vending machines fetch failed', logData);

    return h
      .response({
        status: '500',
        message: 'Internal server error',
      })
      .code(500);
  }
}

export async function getVendingMachinesByCity(request, h) {
  const logData = {
    method: request.method,
    path: request.path,
    cityId: request.params.cityId,
    startTime: new Date().toISOString(),
  };

  try {
    // Validate city ID using our helper function
    await validateCityId(logData.cityId, request);

    const vendingMachinesByCity = await db('vending_machines')
      .select('*')
      .where('city_id', logData.cityId);

    if (vendingMachinesByCity.length === 0) {
      // Update log for not found case
      Object.assign(logData, {
        endTime: new Date().toISOString(),
        duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
        status: 'not_found',
        count: 0,
      });

      logger.warn('No vending machines found for city', logData);
      throw createNotFoundError('No vending machines found for this city');
    }

    // Update log for success case
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'success',
      count: vendingMachinesByCity.length,
    });

    logger.info('Vending machines fetch by city completed', logData);

    return h
      .response({
        status: '200',
        data: vendingMachinesByCity,
      })
      .code(200);
  } catch (error) {
    // Update log for error case
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'error',
      error: error.message,
    });

    if (error instanceof AppError) {
      logger.error('Custom error in vending machines by city fetch', logData);
      throw error;
    }

    // For other errors, include stack trace
    Object.assign(logData, { stack: error.stack });
    logger.error('Failed to fetch vending machines for city', logData);
    throw createInternalServerError(
      'Failed to fetch vending machines for city',
    );
  }
}
export async function getSnacks(request, h) {
  const logData = {
    method: request.method,
    path: request.path,
    startTime: new Date().toISOString(),
  };

  try {
    const snacks = await db('snack_inventories').select('*');
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'success',
      count: snacks.length,
    });

    logger.info('Snacks fetch completed', logData);
    return h
      .response({
        status: '200',
        data: snacks,
      })
      .code(200);
  } catch (error) {
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'error',
      error: error.message,
    });
    logger.error('Failed to fetch snacks', logData);
    throw createInternalServerError('Failed to fetch snacks');
  }
}

export async function getDrinks(request, h) {
  const logData = {
    method: request.method,
    path: request.path,
    startTime: new Date().toISOString(),
  };

  try {
    const drinks = await db('drink_inventories').select('*');
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'success',
      count: drinks.length,
    });

    logger.info('Drinks fetch completed', logData);
    return h
      .response({
        status: '200',
        data: drinks,
      })
      .code(200);
  } catch (error) {
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'error',
      error: error.message,
    });
    logger.error('Failed to fetch drinks', logData);
    throw createInternalServerError('Failed to fetch drinks');
  }
}

export async function getSnacksByVendingMachine(request, h) {
  const vendingMachineId = request.params.vendingMachineId;
  const logData = {
    method: request.method,
    path: request.path,
    vendingMachineId: vendingMachineId,
    startTime: new Date().toISOString(),
  };

  await validateVendingMachineId(vendingMachineId, request);

  try {
    const snackInventoryItems = await db('vending_machine_inventories')
      .select('inventory_id', 'quantity')
      .where('vending_machine_id', vendingMachineId)
      .where('inventory_type', 'snack');

    if (snackInventoryItems.length === 0) {
      Object.assign(logData, {
        endTime: new Date().toISOString(),
        duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
        status: 'not_found',
        count: 0,
      });

      logger.warn('No snacks found for vending machine', logData);
      throw createNotFoundError('No snacks found for this vending machine');
    }

    // Extract just the inventory_id values from the array of objects
    const inventoryIds = snackInventoryItems.map((item) => item.inventory_id);

    // Fetch snacks using the extracted inventory_ids
    const snacks = await db('snack_inventories')
      .select('*')
      .whereIn('id', inventoryIds);

    // Add the quantity to each snack
    const snacksWithQuantity = snacks.map((snack) => {
      const quantity = snackInventoryItems.find(
        (item) => item.inventory_id === snack.id,
      )?.quantity;
      return {
        ...snack,
        quantity: quantity,
      };
    });

    if (snacksWithQuantity.length === 0) {
      Object.assign(logData, {
        endTime: new Date().toISOString(),
        duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
        status: 'not_found',
        count: 0,
      });

      logger.warn('Found vending machine but no snacks found', logData);
      throw createNotFoundError('No snacks found for this vending machine');
    }

    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'success',
      count: snacksWithQuantity.length,
    });

    logger.info('Snacks fetch by vending machine completed', logData);
    return h
      .response({
        status: '200',
        data: snacksWithQuantity,
      })
      .code(200);
  } catch (error) {
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'error',
      error: error.message,
    });
    logger.error('Failed to fetch snacks by vending machine', logData);
    throw createInternalServerError(
      'Failed to fetch snacks by vending machine',
    );
  }
}

export async function getDrinksByVendingMachine(request, h) {
  const logData = {
    method: request.method,
    path: request.path,
    vendingMachineId: request.params.vendingMachineId,
    startTime: new Date().toISOString(),
  };

  try {
    const drinkInventoryIds = await db('vending_machine_inventories')
      .select('inventory_id')
      .where('vending_machine_id', logData.vendingMachineId)
      .where('inventory_type', 'drink');

    if (drinkInventoryIds.length === 0) {
      Object.assign(logData, {
        endTime: new Date().toISOString(),
        duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
        status: 'not_found',
        count: 0,
      });

      logger.warn('No drinks found for vending machine', logData);
      throw createNotFoundError('No drinks found for this vending machine');
    }

    // drinkInventoryIds is an array of inventory_ids. We need to fetch the drinks from the drink_inventories table.
    const drinks = await db('drink_inventories')
      .select('*')
      .whereIn('id', drinkInventoryIds);

    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'success',
      count: drinks.length,
    });

    logger.info('Drinks fetch by vending machine completed', logData);
    return h
      .response({
        status: '200',
        data: drinks,
      })
      .code(200);
  } catch (error) {
    Object.assign(logData, {
      endTime: new Date().toISOString(),
      duration: `${Date.now() - new Date(logData.startTime).getTime()}ms`,
      status: 'error',
      error: error.message,
    });
    logger.error('Failed to fetch drinks by vending machine', logData);
    throw createInternalServerError(
      'Failed to fetch drinks by vending machine',
    );
  }
}
