const CurrentUsage = require('../models/CurrentUsage');
const logger  = require('../helpers/logger');
const config  = require('../config/config');


const saveCurrentUsageObject = async ( curr_usage ) => {
  try {
    const newUsageObject = new CurrentUsage( {...curr_usage} );
    await newUsageObject.save();
    logger.info(`Stored new Object in DB`);
    return 1;
  } catch (err) {
    logger.error(err.message);
    return 0;
  }
};

module.exports = { saveCurrentUsageObject };
