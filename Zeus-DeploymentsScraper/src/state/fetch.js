const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const _ = require('lodash');
const config = require('../config/config');

const fetchPodsJson = async () => {
  let command;

  if(config.ALL_NAMESPACES){
    command = `kubectl get pods -A -o json`;
  } else {
    command = `kubectl get pods -n ${config.NAMESPACE} -o json`;
  }
  let podsJson;

  try {
    podsJson = await exec(command);
    podsJson = JSON.parse(podsJson.stdout);
    logger.info(`Got Deployments Json, length=${podsJson.items.length}`);
  } catch (err) {
    logger.error(err.stack);
  }

  return podsJson;
};

const fetchPodsUsage = async() => {
  let command;

  if (config.ALL_NAMESPACES) {
    command = `kubectl top pods -A --containers`;
  } else if (config.NAMESPACE) {
    command = `kubectl top pods  -n ${config.NAMESPACE} --containers`;
  } else {
    logger.error(
        'FATAL CONFIGURATION ERROR! look at "NAMESPACE"/"ALL_NAMESPACES" environment variable');
  }
  try {
    // make a list of pods current resources usage
    let PodsCurrentUsageList = await exec(command);
    PodsCurrentUsageList = _.compact(PodsCurrentUsageList.stdout.split("\n"));
    PodsCurrentUsageList.shift(); // remove title;
    return PodsCurrentUsageList;
  } catch (e) {
    logger.error(e.stack);
  }
};

module.exports = { fetchPodsJson, fetchPodsUsage };
