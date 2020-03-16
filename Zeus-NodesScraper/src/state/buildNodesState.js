const logger = require('../helpers/logger');
const {parseNodes} = require('./parseNode');
const {parseNodesUsage} = require('./parseUsage');
const {fetchNodesArray, fetchNodesUsage} = require('./fetch');
const {saveClusterResources, saveClusterUsage} = require('../helpers/saveToMongo');


const mainNodesStateBuilder = async () => {
  logger.info('Nodes State Build Iteration Starting...');
  let startTime = Date.now();

  const nodesArray = await fetchNodesArray();
  const clusterResources = parseNodes(nodesArray);
  saveClusterResources(clusterResources);
  const nodesUsageArray = await fetchNodesUsage();
  const clusterUsage = parseNodesUsage(nodesUsageArray);
  saveClusterUsage(clusterUsage);

  let interval = (Date.now() - startTime) / 1000;
  logger.info('Nodes State Build Iteration Ended Successfully, Nodes modified:',
      nodesArray.arr.length);
  logger.info('Nodes Build Iteration Time:', interval + 's');
};

module.exports = {mainNodesStateBuilder};
