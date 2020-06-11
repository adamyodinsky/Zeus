const logger = require("../helpers/logger");

const parsePodUsage = (PodsCurrentUsage) => {
  let pod = {};
  try {
    pod = _.compact(PodsCurrentUsage.split(/\s+/));
    if (config.ALL_NAMESPACES) {
      let namespace = pod.shift();
      pod.push(namespace);
    } else if (config.NAMESPACE) {
      pod.push(config.NAMESPACE);
    } else {
      logger.error('FATAL ERROR IN CONFIGURATION. config.NAMESPACE config.ALL_NAMESPACES');
    }
  } catch (e) {
    logger.error(e.stack);
  }

  return pod;
};

const parseDeploymentNameFromPod = (pod) => {
  let deploymentName = "";
  let deploymentNameArr = pod[0].split('-');

  for (let i=0; i < deploymentNameArr.length - 2; i++) {
    deploymentName += deploymentNameArr[i];
  }

  return deploymentName;
};

const parsePodResourcesRequests = (newPodObject, podsJson) => {

};


module.exports = { parsePodUsage, parseDeploymentNameFromPod };
