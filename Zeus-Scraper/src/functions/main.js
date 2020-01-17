const { buildState } = require('./buildState');
const logger = require('../helpers/logger');


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
  setInterval(executeStateBuilder, 1000*20);
};

module.exports = { mainStateBuilder };
