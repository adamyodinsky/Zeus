'use strict';

module.exports = {
  host: process.env.HOST || 'localhost',
  port: Number(process.env.PORT) || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  targetHost: process.env.TARGET_HOST || 'localhost',
  targetPort: process.env.TARGET_PORT || 3000,
  nonLeaf: process.env.NON_LEAF === 'true'
};
