const logger = require('../helpers/logger');
const {saveNode, saveNodeResources} = require('../helpers/saveToMongo');
const {parseDeep} = require('./parseDeep');

const parseNode = (node, date) => {
  let nodeObject, resourceObject;
  const nodeLines = node.split(/\n/);

  // Get Name
  let Name = nodeLines.filter(line => line.match(/^Name:/));
  Name = Name[0].split(/\s+/)[1];

  // Get Roles
  let Roles = nodeLines.filter(line => line.match(/^Roles:/));
  Roles = Roles[0].split(/\s+/)[1];

  let objects = parseDeep(nodeLines, date);

  nodeObject = {
    name: Name,
    roles: Roles,
    addresses: objects[2],
    pods: objects[1],
  };

  resourceObject = {
    name: Name,
    resources: objects[0],
    date
  };

  // console.log(JSON.stringify(nodeObject, null, 2));
  return {nodeObject, resourceObject};
};

const parseNodes = (nodesArray) => {
  for (let node of nodesArray.arr) {
    try {
      let {nodeObject, resourceObject} = parseNode(node, nodesArray.date);
      saveNode(nodeObject);
      saveNodeResources(resourceObject);
    } catch (e) {
      logger.error(e.stack);
    }
  }
};

module.exports ={ parseNode, parseNodes};
