import { dispenseTransaction, restockTransaction } from './controller.js';
import Joi from 'joi';

const register = async (server, options) => {
  /*
    This route is used to process a transaction for a vending machine.
    It will decrement the inventory for the given vending machine, inventory id, row number, and column number by the given amount.
    */
  server.route({
    method: 'POST',
    path: '/transaction/dispense',
    options: {
      handler: dispenseTransaction,
      validate: {
        payload: Joi.object({
          vendingMachineId: Joi.string().required(),
          rowNumber: Joi.number().required(),
          columnNumber: Joi.number().required(),
          amount: Joi.number().optional(),
        }),
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/transaction/restock/{vendingMachineId}/{inventoryId}/{rowNumber}/{columnNumber}',
    options: {
      handler: restockTransaction,
      validate: {
        params: Joi.object({
          vendingMachineId: Joi.string().required(),
          inventoryId: Joi.string().required(),
          rowNumber: Joi.number().required(),
          columnNumber: Joi.number().required(),
        }),
      },
    },
  });
};

const name = 'transaction-plugin';

export const plugin = { register, name };
export { name };
