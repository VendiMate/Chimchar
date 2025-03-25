import Joi from 'joi';
import { getCoordinates } from './controller.js';

const register = async (server, options) => {
  server.route({
    method: 'GET',
    path: '/coordinates',
    options: {
      handler: async (request, h) => {
        return await getCoordinates(request, h);
      },
    },
  });
};

const name = 'coordinates-plugin';

export const plugin = { register, name };
export { name };
