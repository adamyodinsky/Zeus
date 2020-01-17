const { buildState } = require('./buildState');
const { saveStateToS3 } = require('../helpers/S3state');
const logger = require('../helpers/logger');
// const moment = require('moment');


const executeStateBuilder = async() => {
  logger.info("State Build Iteration Starting...");
  let startTime = Date.now();
  try {
    await buildState();
    logger.info("State Build Iteration Ended Successfully");
  } catch (err) {
    logger.error(err.message);
  }
  let interval =  (Date.now() - startTime) / 1000;
  logger.info("Build Iteration Time in seconds:", interval);
};

const mainStateBuilder = () => {
  executeStateBuilder();
  setInterval(executeStateBuilder, 1000*30);
};

module.exports = { mainStateBuilder };
