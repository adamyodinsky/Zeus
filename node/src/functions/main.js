const { buildState, addCurrentUsageToState } = require('./buildState');
const { saveStateToS3 } = require('../helpers/S3state');
const logger = require('../helpers/logger');

const executeStateBuilder = async() => {
  logger.info("State Build Iteration Starting...");
  try {
    let state = await buildState();
    await addCurrentUsageToState(state);
    process.exit(1);
    await saveStateToS3(state);
    logger.info("State Build Iteration Ended Successfully");
  } catch (err) {
    logger.error(err.message);
  }
};

const mainStateBuilder = () => {
  setInterval(executeStateBuilder, 1000*5);
};

module.exports = { mainStateBuilder };
