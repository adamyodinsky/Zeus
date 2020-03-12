const logger = require('../helpers/logger');
const _ = require('lodash/array');
const {convertToNumber} = require('../helpers/convert');
const {saveNodeUsage} = require('../helpers/saveToMongo');

const deepParseNodeUsage = (node, date) => {
  const arrUsage = _.compact(node.split(/\s+/));

  return {
    name: arrUsage[0],
    cpu: [convertToNumber(arrUsage[1]), convertToNumber(arrUsage[2])],
    memory: [convertToNumber(arrUsage[3]), convertToNumber(arrUsage[4])],
    date: date,
  };
};

const parseNodesUsage = (nodesUsageArray) => {
  let nodesUsageObj = {};
  let clusterUsageObj = {
      cpu: 0,
      memory: 0
  };

  for (let node of nodesUsageArray.arr) {
    try {
      nodesUsageObj = deepParseNodeUsage(node, nodesUsageArray.date);
      saveNodeUsage(nodesUsageObj);

      clusterUsageObj.cpu += nodesUsageObj.cpu[0];
      clusterUsageObj.cpu += nodesUsageObj.cpu[0];
      clusterUsageObj.memory += nodesUsageObj.memory[0];
      clusterUsageObj.memory += nodesUsageObj.memory[0];
      clusterUsageObj.date = nodesUsageObj.date;

    } catch (e) {
      logger.error(e.stack);
    }
  }

  return clusterUsageObj;
};

module.exports = { parseNodesUsage, deepParseNodeUsage};
