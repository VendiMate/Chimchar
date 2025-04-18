import Joi from 'joi';
import {
  findClosestVendingMachine,
  getCities,
  getCoordinates,
} from './controller.js';

const register = async (server, options) => {
  server.route({
    method: 'GET',
    path: '/cities',
    options: {
      handler: async (request, h) => {
        return await getCities(request, h);
      },
    },
  });
  server.route({
    method: 'GET',
    path: '/coordinates',
    options: {
      handler: async (request, h) => {
        return await getCoordinates(request, h);
      },
    },
  });
  server.route({
    method: 'post',
    path: '/closest',
    options: {
      handler: async (request, h) => {
        return await findClosestVendingMachine(request, h);
      },
      // validate the body has lat and long
      validate: {
        payload: Joi.object({
          lat: Joi.number().required(),
          long: Joi.number().required(),
        }),
      },
    },
  });
};

const name = 'coordinates-plugin';

export const plugin = { register, name };
export { name };
