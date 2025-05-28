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
  const startTime = Date.now();

  try {
    const vendingMachines = await db('vending_machines').select('*');

    logger.logRequest({
      request,
      message: 'Vending machines fetch completed',
      start: startTime,
      additionalData: {
        count: vendingMachines.length
      }
    });

    return h
      .response({
        status: '200',
        data: vendingMachines,
      })
      .code(200);
  } catch (error) {
    logger.logRequest({
      request,
      message: 'Vending machines fetch failed',
      error,
      start: startTime,
      level: 'error'
    });

    return h
      .response({
        status: '500',
        message: 'Internal server error',
      })
      .code(500);
  }
}

export async function getVendingMachinesByCity(request, h) {
  const startTime = Date.now();
  const cityId = request.params.cityId;

  try {
    await validateCityId(cityId, request);

    const vendingMachinesByCity = await db('vending_machines')
      .select('*')
      .where('city_id', cityId);

    if (vendingMachinesByCity.length === 0) {
      logger.logRequest({
        request,
        message: 'No vending machines found for city',
        start: startTime,
        level: 'warn',
        additionalData: {
          cityId,
          count: 0
        }
      });
    }

    logger.logRequest({
      request,
      message: 'Vending machines fetch by city completed',
      start: startTime,
      additionalData: {
        cityId,
        count: vendingMachinesByCity.length
      }
    });

    return h
      .response({
        status: '200',
        data: vendingMachinesByCity,
      })
      .code(200);
  } catch (error) {
    if (error instanceof AppError) {
      logger.logRequest({
        request,
        message: 'Custom error in vending machines by city fetch',
        error,
        start: startTime,
        level: 'error',
        additionalData: { cityId }
      });
      throw error;
    }

    logger.logRequest({
      request,
      message: 'Failed to fetch vending machines for city',
      error,
      start: startTime,
      level: 'error',
      additionalData: { cityId }
    });
    throw createInternalServerError('Failed to fetch vending machines for city');
  }
}

export async function getSnacks(request, h) {
  const startTime = Date.now();

  try {
    const snacks = await db('snack_inventories').select('*');

    logger.logRequest({
      request,
      message: 'Snacks fetch completed',
      start: startTime,
      additionalData: {
        count: snacks.length
      }
    });

    return h
      .response({
        status: '200',
        data: snacks,
      })
      .code(200);
  } catch (error) {
    logger.logRequest({
      request,
      message: 'Failed to fetch snacks',
      error,
      start: startTime,
      level: 'error'
    });
    throw createInternalServerError('Failed to fetch snacks');
  }
}

export async function getDrinks(request, h) {
  const startTime = Date.now();

  try {
    const drinks = await db('drink_inventories').select('*');

    logger.logRequest({
      request,
      message: 'Drinks fetch completed',
      start: startTime,
      additionalData: {
        count: drinks.length
      }
    });

    return h
      .response({
        status: '200',
        data: drinks,
      })
      .code(200);
  } catch (error) {
    logger.logRequest({
      request,
      message: 'Failed to fetch drinks',
      error,
      start: startTime,
      level: 'error'
    });
    throw createInternalServerError('Failed to fetch drinks');
  }
}

export async function getSnacksByVendingMachine(request, h) {
  const startTime = Date.now();
  const vendingMachineId = request.params.vendingMachineId;

  try {
    await validateVendingMachineId(vendingMachineId, request);

    const snackInventoryItems = await db('vending_machine_inventories')
      .select('inventory_id', 'quantity')
      .where('vending_machine_id', vendingMachineId)
      .where('inventory_type', 'snack');

    if (snackInventoryItems.length === 0) {
      logger.logRequest({
        request,
        message: 'No snacks found for vending machine',
        start: startTime,
        level: 'warn',
        additionalData: {
          vendingMachineId,
          count: 0
        }
      });
    }

    const inventoryIds = snackInventoryItems.map((item) => item.inventory_id);
    const snacks = await db('snack_inventories')
      .select('*')
      .whereIn('id', inventoryIds);

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
      logger.logRequest({
        request,
        message: 'Found vending machine but no snacks found',
        start: startTime,
        level: 'warn',
        additionalData: {
          vendingMachineId,
          count: 0
        }
      });
    }

    logger.logRequest({
      request,
      message: 'Snacks fetch by vending machine completed',
      start: startTime,
      additionalData: {
        vendingMachineId,
        count: snacksWithQuantity.length
      }
    });

    return h
      .response({
        status: '200',
        data: snacksWithQuantity,
      })
      .code(200);
  } catch (error) {
    logger.logRequest({
      request,
      message: 'Failed to fetch snacks by vending machine',
      error,
      start: startTime,
      level: 'error',
      additionalData: { vendingMachineId }
    });
    throw createInternalServerError('Failed to fetch snacks by vending machine');
  }
}

export async function getDrinksByVendingMachine(request, h) {
  const startTime = Date.now();
  const vendingMachineId = request.params.vendingMachineId;

  try {
    const drinkInventoryIds = await db('vending_machine_inventories')
      .select('inventory_id')
      .where('vending_machine_id', vendingMachineId)
      .where('inventory_type', 'drink');

    if (drinkInventoryIds.length === 0) {
      logger.logRequest({
        request,
        message: 'No drinks found for vending machine',
        start: startTime,
        level: 'warn',
        additionalData: {
          vendingMachineId,
          count: 0
        }
      });
    }

    const drinks = await db('drink_inventories')
      .select('*')
      .whereIn('id', drinkInventoryIds);

    logger.logRequest({
      request,
      message: 'Drinks fetch by vending machine completed',
      start: startTime,
      additionalData: {
        vendingMachineId,
        count: drinks.length
      }
    });

    return h
      .response({
        status: '200',
        data: drinks,
      })
      .code(200);
  } catch (error) {
    logger.logRequest({
      request,
      message: 'Failed to fetch drinks by vending machine',
      error,
      start: startTime,
      level: 'error',
      additionalData: { vendingMachineId }
    });
    throw createInternalServerError('Failed to fetch drinks by vending machine');
  }
}

export async function getInventoryByVendingMachine(request, h) {
  const startTime = Date.now();
  const vendingMachineId = request.params.vendingMachineId;

  try {
    await validateVendingMachineId(vendingMachineId, request);

    const snackInventory = await getSnacksByVendingMachine(request, h);
    const drinkInventory = await getDrinksByVendingMachine(request, h);

    const inventory = {
      snacks: snackInventory?.source?.data || [],
      drinks: drinkInventory?.source?.data || [],
    };

    logger.logRequest({
      request,
      message: 'Inventory fetch by vending machine completed',
      start: startTime,
      additionalData: {
        vendingMachineId,
        snackCount: inventory.snacks.length,
        drinkCount: inventory.drinks.length
      }
    });

    return h
      .response({
        status: '200',
        data: inventory,
      })
      .code(200);
  } catch (error) {
    logger.logRequest({
      request,
      message: 'Failed to fetch inventory by vending machine',
      error,
      start: startTime,
      level: 'error',
      additionalData: { vendingMachineId }
    });
    
    throw createInternalServerError('Failed to fetch inventory by vending machine');
  }
}
