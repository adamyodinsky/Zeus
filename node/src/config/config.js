'use strict';

module.exports = {
  // hosts and ports
  Host: process.env.CONSUL_HOST || 'localhost',
  Port: Number(process.env.CONSUL_PORT || 3000),
  // logger
  logLevel: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === "true"
};
