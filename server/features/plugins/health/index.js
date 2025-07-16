"use strict";
import { health } from "./controller.js";

const register = async (server) => {
  server.route({
    method: "GET",
    path: "/health",
    options: {
      auth: false,
      handler: async (request, h) => {
        const res = await health();
        return h.response(res);
      },
    },
  });
};

const name = "health";

export const plugin = { register, name };
