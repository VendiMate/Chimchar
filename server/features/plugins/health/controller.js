"use strict";

export const health = async () => {
  return { status: "Healthy", uptime: process.uptime() };
};
