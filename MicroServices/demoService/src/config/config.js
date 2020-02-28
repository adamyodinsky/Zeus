'use strict';

module.exports = {
  host: process.env.HOST || 'localhost',
  port: Number(process.env.PORT) || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  targetHost: process.env.TARGET_HOST,
  targetPort: process.env.TARGET_PORT,
  hostName: process.env.HOST_NAME || 'service-test',
  nonLeaf: process.env.NON_LEAF === 'true'
};
