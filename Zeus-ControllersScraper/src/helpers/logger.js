'use strict';

const bunyan = require('bunyan');
const config = require('../config/config');

const logger = bunyan.createLogger({
  name: `Porus-Deployments-Scraper-${config.CLUSTER}`,
  src: true,
  streams: [
    {
      level: config.LOG_LEVEL,
      stream: process.stdout
    }
  ]
});

if (process.env.NODE_ENV === 'unit-test') {
  logger.level(bunyan.FATAL + 1);
}

module.exports = logger;
