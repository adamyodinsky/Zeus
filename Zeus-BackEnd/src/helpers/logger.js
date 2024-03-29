'use strict';

const bunyan = require('bunyan');
const config = require('../config/config');

const logger = bunyan.createLogger({
  name: `Porus-BackEnd`,
  src: true,
  streams: [
    {
      level: config.logLevel,
      stream: process.stdout
    }
  ]
});

if (process.env.NODE_ENV === 'unit-test') {
  logger.level(bunyan.FATAL + 1);
}

module.exports = logger;
