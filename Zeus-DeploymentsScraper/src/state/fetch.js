const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const {parseDeploymentNameFromPod} = require('./parse');
const {saveCurrentUsageObject} = require('../helpers/saveToMongo');
const { parsePodUsage } = require("./parse");


const populateCurrentUsage = async podsCurrentUsage => {
  let count = 0;
  for (let pod of podsCurrentUsage) {
    try {
      count += await saveCurrentUsageObject(pod); // save to mongo
    } catch (e) {
      logger.error(e.stack);
    }
  }
  return count;
};

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


const buildPodsRequestUsageList = async (podsJson) => {
  let count = 0;
  const podsCurrentUsage = [];
  let command;

  if (config.ALL_NAMESPACES) {
    command = `kubectl top pods -A --containers`;
  } else if (config.NAMESPACE) {
    command = `kubectl top pods  -n ${config.NAMESPACE} --containers`;
  } else {
    logger.error('FATAL CONFIGURATION ERROR! look at "NAMESPACE"/"ALL_NAMESPACES" environment variable');
  }

  try {
    // make a list of pods current resources usage
    let PodsCurrentUsageList = await exec(command);
    let date = Date.now();
    PodsCurrentUsageList = _.compact(PodsCurrentUsageList.stdout.split("\n"));
    PodsCurrentUsageList.shift(); // remove title;

    // create pod current resources usage objects and push into the array
    for (let i = 0; i < PodsCurrentUsageList.length; i++) {
      let pod = parsePodUsage(PodsCurrentUsageList[i]);


      // TODO - add deployment name
      let newPodObject = {
        pod_name: pod[0],
        namespace: pod[4],
        containers: [],
        date: date
      };

      newPodObject.containers.push({
        container_name: pod[1],
        cpu: pod[2],
        memory: pod[3],
      });

      // push containers to the same pod object
      while (PodsCurrentUsageList[i+1]) {
        let nextPod = parsePodUsage(PodsCurrentUsageList[i+1]);
        if (pod[0] === nextPod[0] && pod[4] === nextPod[4]) {
          newPodObject.containers.push({
            container_name: nextPod[1],
            cpu: nextPod[2],
            memory: nextPod[3],
            date: date
          });
          i++;
        } else {
          break;
        }
      }

      newPodObject.deploymentName = parseDeploymentNameFromPod(pod);
      parsePodResourcesRequests(newPodObject, podsJson);
      podsCurrentUsage.push(newPodObject);
    }
    logger.info(`Got current usage state to mongo collection, count:`, count);
  } catch (e) {
    logger.error(e.stack);
  }
  return podsCurrentUsage;
};

module.exports = { fetchPodsJson, buildPodsRequestUsageList, populateCurrentUsage };
