const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const { saveCurrentUsageObject, saveDeployment } = require("../helpers/saveToMongo");
const { currentUsageModelName } = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const config = require("../config/config");

const convertToNumber = (str) => {
  return Number(str.replace(/\D/g, ""));
};

const convertResourcesValues = (resources) => {
  let result = {};

    for (let [key, value] of Object.entries(resources)) {
      result[key] = convertToNumber(value);
    }

  return result;
};

const CreateInitialContainers = (deployment, newDeploymentObject, memSumMap, cpuSumMap) => {
  let newContainersMap = {};
  for (let container of deployment.spec.template.spec.containers) {
    // create empty array  keys of container names, array as value
    memSumMap[container.name] = [];
    cpuSumMap[container.name] = [];

    // set initial container values, all but sample values
    newContainersMap[container.name] = {
      container_name: container.name,
      resources: {
        txt: container.resources,
        num: {},
        sum: {}
      },
      usage_samples: [
        {
          sum: {},
          avg: {}
        }
      ]
    };
  }

  // inject sidecar intial values
  if(config.SIDE_CAR_ACTIVE) {
    newContainersMap[config.sideCar.container_name] = config.sideCar;
    memSumMap[config.sideCar.container_name] = [];
    cpuSumMap[config.sideCar.container_name] = [];
  }

  // make numeric conversions
  for (let [key, newContainer] of Object.entries(newContainersMap)) {
    try {
      newContainersMap[key].resources.num.requests = convertResourcesValues(newContainer.resources.txt.requests);
      newContainersMap[key].resources.sum.requests = {
        cpu: newContainer.resources.num.requests.cpu * newDeploymentObject.replicas,
        memory: newContainer.resources.num.requests.memory * newDeploymentObject.replicas
      };
    } catch (e) {
      logger.error(e.message);
    }
  }

  return newContainersMap;

};


const buildDeploymentObject = async (deployment, newDeploymentObject) => {
  // init basic variables
  let countPods = 0;

  // init data structures
  let podNames = [];
  let usageObjectsMap = {};
  let memSumMap = {};
  let cpuSumMap = {};

  // init complex variables
  let regex = new RegExp( '^' + deployment.metadata.name + '.*');
  let condition = {
    pod_name: { $regex: regex }
  };

  // make a map of containers with initial data
  let newContainersMap = CreateInitialContainers(deployment, newDeploymentObject, memSumMap, cpuSumMap);

  // loop over matching current usage objects from mongo
  let currentUsageObject = await CurrentUsageModel.findOneAndDelete(condition);
  while (currentUsageObject) {

    if (currentUsageObject) {
      // gather sum of memory and cpu
      for (let container of currentUsageObject._doc.containers) {
        memSumMap[container.container_name].push(convertToNumber(container.cpu));
        cpuSumMap[container.container_name].push(convertToNumber(container.memory));
      }

      // gather and count pods names
      podNames.push(currentUsageObject.pod_name);
      countPods++;
      currentUsageObject = await CurrentUsageModel.findOneAndDelete(condition); // for next iteration
    }
  }

  // compute sum of cpu and mem
  for (let [key, newContainer] of Object.entries(newContainersMap)) {
    memSumMap[key] = memSumMap[key].reduce((a, b) => a + b,0);
    cpuSumMap[key] = cpuSumMap[key].reduce((a, b) => a + b,0);

    newContainersMap[key].usage_samples[0].sum.memory = memSumMap[key];
    newContainersMap[key].usage_samples[0].sum.cpu    = cpuSumMap[key];
    newContainersMap[key].usage_samples[0].avg.memory = memSumMap[key] / newDeploymentObject.replicas;
    newContainersMap[key].usage_samples[0].avg.cpu    = cpuSumMap[key] / newDeploymentObject.replicas;
    newDeploymentObject.containers.push(newContainersMap[key]);
  }
    console.log('bla');
    console.log();

  return newDeploymentObject;
};


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

const buildPodsCurrentUsageList = async () => {
  let count = 0;
  const podsCurrentUsage = [];

  const command = `kubectl top pods  -n ${config.NAMESPACE} --containers`;
  try {
    // make a list of pods current resources usage
    let PodsCurrentUsageList = await exec(command);
    PodsCurrentUsageList = PodsCurrentUsageList.stdout.split("\n");
    // remove first and last object;
    PodsCurrentUsageList.pop();
    PodsCurrentUsageList.shift();

    // create pod current resources usage objects and push into the array
    for (let i = 0; i < PodsCurrentUsageList.length; i++) {
      let pod = PodsCurrentUsageList[i].split(/(\s+)/);

      let newPodObject = {
        pod_name: pod[0],
        namespace: config.NAMESPACE,
        containers: []
      };

      newPodObject.containers.push({
        container_name: pod[2],
        cpu: pod[4],
        memory: pod[6]
      });

      // push containers to the same pod object
      while (PodsCurrentUsageList[i + 1]) {
        let nextPod = PodsCurrentUsageList[i + 1].split(/(\s+)/);
        if (pod[0] === nextPod[0]) {
          newPodObject.containers.push({
            container_name: nextPod[2],
            cpu: nextPod[4],
            memory: nextPod[6]
          });
          i++;
        } else {
          break;
        }
      }
      podsCurrentUsage.push(newPodObject);
    }
    logger.info(`Got current usage state to mongo collection, count:`, count);
  } catch (e) {
    logger.error(e.message);
  }
  return podsCurrentUsage;
};

const fetchDeploymentsJson = async () => {
  let command = `kubectl get deployments -n ${config.NAMESPACE} -o json`;
  let deploymentsJson;

  try {
    deploymentsJson = await exec(command);
    deploymentsJson = JSON.parse(deploymentsJson.stdout);
    logger.info(`Got Deployments Json, length=${deploymentsJson.items.length}`);
  } catch (err) {
    logger.error(err.message);
  }

  return deploymentsJson;
};

const buildState = async () => {
  let count = 0;
  let deploymentsJson;

  try {
    deploymentsJson = await fetchDeploymentsJson();
    const podsCurrentUsage = await buildPodsCurrentUsageList();
    await populateCurrentUsage(podsCurrentUsage);
  } catch (e) {
    logger.error(e.message);
    return;
  }

  for (const deployment of deploymentsJson.items) {
    try {
      let newDeploymentObject = {
        deployment_name: deployment.metadata.name,
        uid: deployment.metadata.uid,
        updated: true,
        replicas: deployment.spec.replicas,
        containers: []
      };

      // build the pod inner objects
      newDeploymentObject = await buildDeploymentObject(deployment, newDeploymentObject);
      //TODO - save newDeploymentObject to mongo call to function
      count += await saveDeployment(newDeploymentObject);
    } catch (e) {
      logger.error(e.message);
    }
  }
  logger.info(
    `a build of new state was ended successfully, modified: ${count}`
  );
  return count;
};

module.exports = { buildState };
