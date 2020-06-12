const { buildControllersState } = require('./state/build');
const logger = require('./helpers/logger');
const config = require('./config/config');


const executeStateBuilder = async() => {
  try {
    await buildControllersState();
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
