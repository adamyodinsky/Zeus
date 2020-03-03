const { buildDeploymentsState } = require('./state/buildDeploymentsState');
const logger = require('./helpers/logger');
const config = require('./config/config');


const executeStateBuilder = async() => {
  try {
    await buildDeploymentsState();
  } catch (err) {
    logger.error(err.stack);
  }
};

const mainStateBuilder = () => {
  executeStateBuilder().then(()=>{
    setInterval(executeStateBuilder, 1000 * config.METRIC_INTERVAL);
  });
};

module.exports = { mainStateBuilder };
