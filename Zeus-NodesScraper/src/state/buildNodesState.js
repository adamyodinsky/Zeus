const logger = require('../helpers/logger');
const {parseNodes} = require('./parseNode');
const {parseNodesUsage} = require('./parseUsage');
const {fetchNodesArray, fetchNodesUsage} = require('./fetch');

const mainNodesStateBuilder = async () => {
  logger.info('Nodes State Build Iteration Starting...');
  let startTime = Date.now();

  const nodesArray = await fetchNodesArray();
  parseNodes(nodesArray);
  const nodesUsageArray = await fetchNodesUsage();
  parseNodesUsage(nodesUsageArray);

  let interval = (Date.now() - startTime) / 1000;
  logger.info('Nodes State Build Iteration Ended Successfully, Nodes modified:',
      nodesArray.arr.length);
  logger.info('Nodes Build Iteration Time:', interval + 's');
};

module.exports = {mainNodesStateBuilder};
