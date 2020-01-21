const { buildState } = require('./state/buildState');
const logger = require('./helpers/logger');
const config = require('./config/config');


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
  executeStateBuilder().then(()=>{
    setInterval(executeStateBuilder, 1000 * config.METRIC_INTERVAL);
  });
};

module.exports = { mainStateBuilder };
