import Joi from '@hapi/joi';
const register = async (server, options) => {
  //Get all vending machines
  server.route({
    method: 'GET',
    path: '/vending-machines',
    options: {
      handler: async (request, h) => {
        return null;
      },
      validate: {},
    },
  });
  // Get all vending machines by city
  server.route({
    method: 'GET',
    path: '/vending-machines/{cityId}',
    options: {
      handler: async (request, h) => {
        return null;
      },
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
      handler: async (request, h) => {
        return null;
      },
      validate: {},
    },
  });
  // Get all drinks
  server.route({
    method: 'GET',
    path: '/vending-machines/drinks',
    options: {
      handler: async (request, h) => {
        return null;
      },
      validate: {},
    },
  });
  // Get all snacks by vending machine
  server.route({
    method: 'GET',
    path: '/vending-machines/snacks/{vendingMachineId}',
    options: {
      handler: async (request, h) => {
        return null;
      },
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
      handler: async (request, h) => {
        return null;
      },
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
