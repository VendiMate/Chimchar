import { db } from '../../../../db/index.js';
import { AppError } from '../../../../src/errors/app-error.js';
import {
  createNotFoundError,
  createValidationError,
  createInternalServerError,
} from '../../../../src/utils/error.js';
import { validateCityId, validateVendingMachineId } from './helper.js';

export async function getVendingMachines(request, h) {
  const startTime = Date.now();

  try {
    const vendingMachines = await db('vending_machines').select('*');

    console.log('Vending machines fetch completed', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      count: vendingMachines.length,
    });

    return h
      .response({
        status: '200',
        data: vendingMachines,
      })
      .code(200);
  } catch (error) {
    console.error('Vending machines fetch failed:', error);
    console.log('Vending machines fetch failed', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      error: error.message,
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
      console.log('No vending machines found for city', {
        method: request.method,
        path: request.path,
        duration: `${Date.now() - startTime}ms`,
        cityId,
        count: 0,
      });
    }

    console.log('Vending machines fetch by city completed', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      cityId,
      count: vendingMachinesByCity.length,
    });

    return h
      .response({
        status: '200',
        data: vendingMachinesByCity,
      })
      .code(200);
  } catch (error) {
    if (error instanceof AppError) {
      console.error('Custom error in vending machines by city fetch:', error);
      console.log('Custom error in vending machines by city fetch', {
        method: request.method,
        path: request.path,
        duration: `${Date.now() - startTime}ms`,
        cityId,
        error: error.message,
      });
      throw error;
    }

    console.error('Failed to fetch vending machines for city:', error);
    console.log('Failed to fetch vending machines for city', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      cityId,
      error: error.message,
    });
    throw createInternalServerError(
      'Failed to fetch vending machines for city',
    );
  }
}

export async function getSnacks(request, h) {
  const startTime = Date.now();

  try {
    const snacks = await db('snack_inventories').select('*');

    console.log('Snacks fetch completed', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      count: snacks.length,
    });

    return h
      .response({
        status: '200',
        data: snacks,
      })
      .code(200);
  } catch (error) {
    console.error('Failed to fetch snacks:', error);
    console.log('Failed to fetch snacks', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      error: error.message,
    });
    throw createInternalServerError('Failed to fetch snacks');
  }
}

export async function getDrinks(request, h) {
  const startTime = Date.now();

  try {
    const drinks = await db('drink_inventories').select('*');

    console.log('Drinks fetch completed', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      count: drinks.length,
    });

    return h
      .response({
        status: '200',
        data: drinks,
      })
      .code(200);
  } catch (error) {
    console.error('Failed to fetch drinks:', error);
    console.log('Failed to fetch drinks', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      error: error.message,
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
      console.log('No snacks found for vending machine', {
        method: request.method,
        path: request.path,
        duration: `${Date.now() - startTime}ms`,
        vendingMachineId,
        count: 0,
      });
    }

    console.log('Snacks by vending machine fetch completed', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      vendingMachineId,
      count: snackInventoryItems.length,
    });

    return h
      .response({
        status: '200',
        data: snackInventoryItems,
      })
      .code(200);
  } catch (error) {
    if (error instanceof AppError) {
      console.error('Custom error in snacks by vending machine fetch:', error);
      console.log('Custom error in snacks by vending machine fetch', {
        method: request.method,
        path: request.path,
        duration: `${Date.now() - startTime}ms`,
        vendingMachineId,
        error: error.message,
      });
      throw error;
    }

    console.error('Failed to fetch snacks for vending machine:', error);
    console.log('Failed to fetch snacks for vending machine', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      vendingMachineId,
      error: error.message,
    });
    throw createInternalServerError(
      'Failed to fetch snacks for vending machine',
    );
  }
}

export async function getDrinksByVendingMachine(request, h) {
  const startTime = Date.now();
  const vendingMachineId = request.params.vendingMachineId;

  try {
    await validateVendingMachineId(vendingMachineId, request);

    const drinkInventoryItems = await db('vending_machine_inventories')
      .select('inventory_id', 'quantity')
      .where('vending_machine_id', vendingMachineId)
      .where('inventory_type', 'drink');

    if (drinkInventoryItems.length === 0) {
      console.log('No drinks found for vending machine', {
        method: request.method,
        path: request.path,
        duration: `${Date.now() - startTime}ms`,
        vendingMachineId,
        count: 0,
      });
    }

    console.log('Drinks by vending machine fetch completed', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      vendingMachineId,
      count: drinkInventoryItems.length,
    });

    return h
      .response({
        status: '200',
        data: drinkInventoryItems,
      })
      .code(200);
  } catch (error) {
    if (error instanceof AppError) {
      console.error('Custom error in drinks by vending machine fetch:', error);
      console.log('Custom error in drinks by vending machine fetch', {
        method: request.method,
        path: request.path,
        duration: `${Date.now() - startTime}ms`,
        vendingMachineId,
        error: error.message,
      });
      throw error;
    }

    console.error('Failed to fetch drinks for vending machine:', error);
    console.log('Failed to fetch drinks for vending machine', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      vendingMachineId,
      error: error.message,
    });
    throw createInternalServerError(
      'Failed to fetch drinks for vending machine',
    );
  }
}

export async function getInventoryByVendingMachine(request, h) {
  const startTime = Date.now();
  const vendingMachineId = request.params.vendingMachineId;

  try {
    await validateVendingMachineId(vendingMachineId, request);

    const inventoryItems = await db('vending_machine_inventories as vmi')
      .leftJoin('snack_inventories as si', function() {
        this.on('vmi.inventory_id', '=', 'si.id').andOn('vmi.inventory_type', '=', db.raw('?', ['snack']));
      })
      .leftJoin('drink_inventories as di', function() {
        this.on('vmi.inventory_id', '=', 'di.id').andOn('vmi.inventory_type', '=', db.raw('?', ['drink']));
      })
      .select(
        'vmi.id',
        'vmi.inventory_id',
        'vmi.inventory_type',
        'vmi.quantity',
        'vmi.price',
        'vmi.row_number',
        'vmi.column_number',
        'vmi.status',
        db.raw('COALESCE(si.name, di.name) as name'),
        db.raw('COALESCE(si.image_url, di.image_url) as image_url'),
        db.raw('COALESCE(si.default_price, di.default_price) as default_price')
      )
      .where('vmi.vending_machine_id', vendingMachineId);

    if (inventoryItems.length === 0) {
      console.log('No inventory found for vending machine', {
        method: request.method,
        path: request.path,
        duration: `${Date.now() - startTime}ms`,
        vendingMachineId,
        count: 0,
      });
    }

    console.log('Inventory by vending machine fetch completed', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      vendingMachineId,
      count: inventoryItems.length,
    });

    return h
      .response({
        status: '200',
        data: inventoryItems,
      })
      .code(200);
  } catch (error) {
    if (error instanceof AppError) {
      console.error('Custom error in inventory by vending machine fetch:', error);
      console.log('Custom error in inventory by vending machine fetch', {
        method: request.method,
        path: request.path,
        duration: `${Date.now() - startTime}ms`,
        vendingMachineId,
        error: error.message,
      });
      throw error;
    }

    console.error('Failed to fetch inventory for vending machine:', error);
    console.log('Failed to fetch inventory for vending machine', {
      method: request.method,
      path: request.path,
      duration: `${Date.now() - startTime}ms`,
      vendingMachineId,
      error: error.message,
    });
    throw createInternalServerError(
      'Failed to fetch inventory for vending machine',
    );
  }
}
