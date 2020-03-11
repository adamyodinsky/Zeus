const logger = require('../helpers/logger');
const {computeCapacity} = require('../helpers/convert');
const {saveNode, saveNodeResources} = require('../helpers/saveToMongo');
const {parseDeep} = require('./parseDeep');
const {convertToNumber} = require('../helpers/convert');

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
  let clusterResourceObj = {
    resources:
        {
          cpu: {
            request: 0,
            limit: 0
          },
          memory: {
            request: 0,
            limit: 0,
          }
        }
  };

  for (let node of nodesArray.arr) {
    try {
      let {nodeObject, resourceObject} = parseNode(node, nodesArray.date);
      saveNode(nodeObject);
      saveNodeResources(resourceObject);

      clusterResourceObj.resources.cpu.request += convertToNumber(resourceObject.resources.cpu.request[0]);
      clusterResourceObj.resources.cpu.limit += convertToNumber(resourceObject.resources.cpu.limit[0]);
      clusterResourceObj.resources.memory.request += convertToNumber(resourceObject.resources.memory.request[0]);
      clusterResourceObj.resources.memory.limit += convertToNumber(resourceObject.resources.memory.limit[0]);
      clusterResourceObj.date = resourceObject.date;
    } catch (e) {
      logger.error(e.stack);
    }
  }
  return clusterResourceObj;
};


module.exports ={parseNode, parseNodes};
