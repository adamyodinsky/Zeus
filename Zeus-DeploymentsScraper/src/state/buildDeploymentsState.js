const logger = require("../helpers/logger");
const { saveDeployment } = require("../helpers/saveToMongo");
const { currentUsageModelName } = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const config = require("../config/config");
const {buildPodsRequestUsageList} = require('./fetch');
const {populateCurrentUsage} = require('./fetch');
const {fetchPodsJson} = require('./fetch');

const convertToNumber = (str) => {
  return Number(str.replace(/\D/g,''));
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
          cpuSumMap[container.container_name].push(convertToNumber(container.cpu));
          memSumMap[container.container_name].push(convertToNumber(container.memory));
        }

        // gather and count pods names
        podNames.push(currentUsageObject._doc.pod_name);
        // date = currentUsageObject._doc.date;
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
      newContainersMap[key].usage_samples[0].date = Date.now();
      newDeploymentObject.containers.push(newContainer);
    }
  } catch (e) {
    logger.error(e.stack);
  }
  newDeploymentObject.pod_names = podNames;
  return newDeploymentObject;
};



const buildDeploymentsState = async () => {
  logger.info("Deployment State Build Iteration Starting...");
  let startTime = Date.now();
  let count = 0;
  let podsJson;

  try {
    podsJson = await fetchPodsJson();
    const podsCurrentUsage = await buildPodsRequestUsageList(podsJson);
    await populateCurrentUsage(podsCurrentUsage);
  } catch (e) {
    logger.error(e.stack);
    return;
  }

  for (const deployment of podsJson.items) {
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
