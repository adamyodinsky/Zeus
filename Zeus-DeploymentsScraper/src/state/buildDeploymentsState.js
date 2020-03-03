const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const { saveCurrentUsageObject, saveDeployment } = require("../helpers/saveToMongo");
const { currentUsageModelName } = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const config = require("../config/config");
const _ = require('lodash/array');

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
  let sideCarInjected;

  // TODO - should be more system agnostic, this is to specific
  if (config.SIDE_CAR_ACTIVE) {
    sideCarInjected = !(deployment.spec.template.metadata.annotations["sidecar.istio.io/inject"] === "false");
  }

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

  // inject sidecar initial values
  if(config.SIDE_CAR_ACTIVE && sideCarInjected) {
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
      logger.error(e.stack);
    }
  }

  return newContainersMap;

};


const buildDeploymentObject = async (deployment, newDeploymentObject) => {
  let date;

  // init basic variables
  let countPods = 0;

  // init data structures
  let podNames = [];
  let memSumMap = {};
  let cpuSumMap = {};

  // init complex variables
  let regex = new RegExp( '^' + deployment.metadata.name + '.*');
  let conditions = [
    { pod_name: { $regex: regex }},
    { namespace: { $eq: deployment.metadata.namespace }}
  ];

  // make a map of containers with initial data
  let newContainersMap = CreateInitialContainers(deployment, newDeploymentObject, memSumMap, cpuSumMap);
  try {
    // loop over matching current usage objects from mongo
    let currentUsageObject = await CurrentUsageModel.findOneAndDelete({ $and: conditions});
    while (currentUsageObject) {
        // gather sum of memory and cpu
        for (let container of currentUsageObject._doc.containers) {
          memSumMap[container.container_name].push(convertToNumber(container.cpu));
          cpuSumMap[container.container_name].push(convertToNumber(container.memory));
        }

        // gather and count pods names
        podNames.push(currentUsageObject._doc.pod_name);
        date = currentUsageObject._doc.date;
        countPods++;
        currentUsageObject = await CurrentUsageModel.findOneAndDelete({ $and: conditions}); // for next iteration
    }
  } catch (e) {
    logger.error(e.stack);
  }

  try {
    // compute sum of cpu and mem
    for (let [key, newContainer] of Object.entries(newContainersMap)) {
      memSumMap[key] = memSumMap[key].reduce((a, b) => a + b, 0);
      cpuSumMap[key] = cpuSumMap[key].reduce((a, b) => a + b, 0);

      newContainersMap[key].usage_samples[0].sum.memory = memSumMap[key];
      newContainersMap[key].usage_samples[0].sum.cpu = cpuSumMap[key];
      newContainersMap[key].usage_samples[0].avg.memory = memSumMap[key] / newDeploymentObject.replicas;
      newContainersMap[key].usage_samples[0].avg.cpu = cpuSumMap[key] / newDeploymentObject.replicas;
      newContainersMap[key].usage_samples[0].date = date;

      newDeploymentObject.containers.push(newContainer);
    }
  } catch (e) {
    logger.error(e.stack);
  }
  newDeploymentObject.pod_names = podNames;
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

const buildPodsCurrentUsageList = async () => {
  let count = 0;
  const podsCurrentUsage = [];
  let command;

  if (config.ALL_NAMESPACES) {
    command = `kubectl top pods -A --containers`;
  } else if (config.NAMESPACE) {
    command = `kubectl top pods  -n ${config.NAMESPACE} --containers`;
  } else {
    logger.error('FATAL CONFIGURATION ERROR!');
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
      podsCurrentUsage.push(newPodObject);
    }
    logger.info(`Got current usage state to mongo collection, count:`, count);
  } catch (e) {
    logger.error(e.stack);
  }
  return podsCurrentUsage;
};

const fetchDeploymentsJson = async () => {
  let command;

  if(config.ALL_NAMESPACES){
    command = `kubectl get deployments -A -o json`;
  } else {
    command = `kubectl get deployments -n ${config.NAMESPACE} -o json`;
  }
  let deploymentsJson;

  try {
    deploymentsJson = await exec(command);
    deploymentsJson = JSON.parse(deploymentsJson.stdout);
    logger.info(`Got Deployments Json, length=${deploymentsJson.items.length}`);
  } catch (err) {
    logger.error(err.stack);
  }

  return deploymentsJson;
};

const buildDeploymentsState = async () => {
  logger.info("Deployment State Build Iteration Starting...");
  let startTime = Date.now();
  let count = 0;
  let deploymentsJson;

  try {
    deploymentsJson = await fetchDeploymentsJson();
    const podsCurrentUsage = await buildPodsCurrentUsageList();
    await populateCurrentUsage(podsCurrentUsage);
  } catch (e) {
    logger.error(e.stack);
    return;
  }

  for (const deployment of deploymentsJson.items) {
    try {
      let newDeploymentObject = {
        deployment_name: deployment.metadata.name,
        cluster: config.CLUSTER,
        namespace: deployment.metadata.namespace,
        uid: deployment.metadata.uid,
        replicas: deployment.spec.replicas,
        containers: []
      };

      // build the pod inner objects
      newDeploymentObject = await buildDeploymentObject(deployment, newDeploymentObject);
      //TODO - save newDeploymentObject to mongo call to function
      count += await saveDeployment(newDeploymentObject);
    } catch (e) {
      logger.error(e.stack);
    }
  }

  let interval =  (Date.now() - startTime) / 1000;
  logger.info(`Deployment State Build Iteration Ended Successfully, Modified: ${count} Docs`);
  logger.info("Deployment Build Iteration Time:", interval + 's');
  return count;
};

module.exports = { buildDeploymentsState };
