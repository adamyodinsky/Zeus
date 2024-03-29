const _ = require('lodash/array');
const {convertToNumber} = require('../helpers/convert');
const {normalizeData} = require('../helpers/convert');

const parsePodsResources = (resourceArray) => {
  const pods = [];

  for (let i = 3; i < resourceArray.length; i++) {
    const podLineArray = _.compact(resourceArray[i].split(/\s+/));
    let pod = {
      namespace: podLineArray[0],
      name: podLineArray[1],
      cpu: {
        request: [podLineArray[2], podLineArray[3]],
        limit: [podLineArray[4], podLineArray[5]],
      },
      memory: {
        request: [podLineArray[6], podLineArray[7]],
        limit: [podLineArray[8], podLineArray[9]],
      },
      age: podLineArray[10],
    };
    pods.push(pod);
  }
  return pods;
};



const parseNodeResources = (resourceArray, date) => {

  let cpu = resourceArray.filter(line => line.match(/cpu/));
  cpu = _.compact(cpu[0].split(/\s+/));
  let cpuRequest = [convertToNumber(cpu[1]), convertToNumber(cpu[2])];
  let cpuLimits = [convertToNumber(cpu[3]), convertToNumber(cpu[4])];

  let memory = resourceArray.filter(line => line.match(/memory/));
  memory = _.compact(memory[0].split(/\s+/));
  let memRequest = [normalizeData(memory[1], 'memory'), convertToNumber(memory[2])];
  let memLimits = [normalizeData(memory[3], 'memory'), convertToNumber(memory[4])];

  return {
    cpu: {
      request: cpuRequest,
      limit: cpuLimits,
    },
    memory: {
      request: memRequest,
      limit: memLimits,
    }
  };
};

module.exports = { parseNodeResources, parsePodsResources};
