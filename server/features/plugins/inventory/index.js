import Joi from 'joi';
import {
  getDrinks,
  getDrinksByVendingMachine,
  getInventoryByVendingMachine,
  getSnacks,
  getSnacksByVendingMachine,
  getVendingMachines,
  getVendingMachinesByCity,
} from './controller.js';
const register = async (server, options) => {
  //Get all vending machines
  server.route({
    method: 'GET',
    path: '/vending-machines',
    options: {
      handler: getVendingMachines,
      validate: {},
    },
  });
  // Get all vending machines by city
  server.route({
    method: 'GET',
    path: '/vending-machines/{cityId}',
    options: {
      handler: getVendingMachinesByCity,
      validate: {
        params: Joi.object({
          cityId: Joi.string().required(),
        }),
      },
    },
  });
  // Get all snacks
  server.route({
    method: 'GET',
    path: '/vending-machines/snacks',
    options: {
      handler: getSnacks,
      validate: {},
    },
  });
  // Get all drinks
  server.route({
    method: 'GET',
    path: '/vending-machines/drinks',
    options: {
      handler: getDrinks,
      validate: {},
    },
  });
  // Get all snacks by vending machine
  server.route({
    method: 'GET',
    path: '/vending-machines/snacks/{vendingMachineId}',
    options: {
      handler: getSnacksByVendingMachine,
      validate: {
        params: Joi.object({
          vendingMachineId: Joi.string().required(),
        }),
      },
    },
  });
  // Get all drinks by vending machine
  server.route({
    method: 'GET',
    path: '/vending-machines/drinks/{vendingMachineId}',
    options: {
      handler: getDrinksByVendingMachine,
      validate: {
        params: Joi.object({
          vendingMachineId: Joi.string().required(),
        }),
      },
    },
  });

  // Get all inventory by vending machine
  server.route({
    method: 'GET',
    path: '/vending-machines/inventory/{vendingMachineId}',
    options: {
      handler: getInventoryByVendingMachine,
      validate: {
        params: Joi.object({
          vendingMachineId: Joi.string().required(),
        }),
      },
    },
  });
};

const name = 'inventory-plugin';

export const plugin = { register, name };
export { name };
