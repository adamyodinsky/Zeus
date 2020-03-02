'use strict';
const logger = require('../helpers/logger');

const health = async(req, res) => {
  try {
    res.status(200).json('OK');
    logger.info('OK');
  } catch (e) {
    logger.error(e.stack)
  }
};

module.exports = { health };
