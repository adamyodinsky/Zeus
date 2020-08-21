const logger = require("../helpers/logger");
const _ = require('lodash');
const config = require('../config/config');

const convertToNumber = (str) => {
  return Number(str.replace(/\D/g,''));
};

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

const parseControllerName = (podName, rmStrings) => {
  let controllerNameArr = podName.split('-');
  let controllerName = "";

  for (let i=0; i < controllerNameArr.length - rmStrings; i++) {
    controllerName += controllerNameArr[i] + '-';
  }

  return controllerName.substring(0, controllerName.length - 1);
};

const parseControllerNameFromPod = (podJson) => {
  let controllerName = "";
  let controllerNameArr = podJson.metadata.name.split('-');
  let rmStrings, controllerKind;

  try {
    controllerKind = podJson.metadata.ownerReferences[0].kind;
    switch (controllerKind) {
      case 'ReplicaSet':
        rmStrings = 2;
        break;
      case 'DaemonSet':
      case 'StatefulSet':
        rmStrings = 1;
        break;
      default:
        rmStrings = 0;
    }
  } catch (e) {
    logger.debug("no owner was found, using pod name as controller name");
    controllerKind = "Pod";
    rmStrings = 0;
  }

  for (let i=0; i < controllerNameArr.length - rmStrings; i++) {
    controllerName += controllerNameArr[i] + '-';
  }


  return {
    name: controllerName.substring(0, controllerName.length - 1),
    kind: controllerKind
  };
};



module.exports = { convertToNumber, parseControllerName, parsePodUsage, parseControllerNameFromPod };
