const logger = require('../helpers/logger');
const _ = require('lodash/array');
const {saveNodeUsage} = require('../helpers/saveToMongo');

const deepParseNodeUsage = (node, date) => {
  const arrUsage = _.compact(node.split(/\s+/));

  return {
    name: arrUsage[0],
    cpu: [arrUsage[1], arrUsage[2]],
    memory: [arrUsage[3], arrUsage[4]],
    date: date,
  };
};

const parseNodesUsage = (nodesUsageArray) => {
  let nodesUsageObj = {};
  for (let node of nodesUsageArray.arr) {
    try {
      nodesUsageObj = deepParseNodeUsage(node, nodesUsageArray.date);
      saveNodeUsage(nodesUsageObj);
    } catch (e) {
      logger.error(e.stack);
    }
  }
};

module.exports = { parseNodesUsage, deepParseNodeUsage};
