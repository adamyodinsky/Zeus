const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const { saveCurrentUsageObject } = require("../helpers/saveToMongo");
const sum = require('hash-sum');

const convertResourcesValues = container => {
  if (container.resources.requests && container.resources.current) {
    container.resources.requests.cpu = Number(
      container.resources.requests.cpu.replace(/\D/g, "")
    );
    container.resources.requests.memory = Number(
      container.resources.requests.memory.replace(/\D/g, "")
    );
    container.resources.current.cpu = Number(
      container.resources.current.cpu.replace(/\D/g, "")
    );
    container.resources.current.memory = Number(
      container.resources.current.memory.replace(/\D/g, "")
    );
  }
  return container;
};

const getDeploymentsJson = async () => {
  let command = "kubectl get deployments -n apps -o json";
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

const populateCurrentUsage = async () => {
  let count = 0;
  const command = "kubectl top pods  -n apps --containers";
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

      let podObject = {
        hash: sum(`${pod[0]}${pod[2]}`),
        pod_name: pod[0],
        container_name: pod[2],
        cpu: pod[4],
        memory: pod[6]
      };
      count += await saveCurrentUsageObject(podObject); // save to mongo
    }
    logger.info(`Got current usage state to mongo collection, count:`, count);
  } catch (e) {
    logger.error(e.message);
  }
};

const buildContainerJson = (deployment, newPodObject) => {
  for (let container of deployment.spec.template.spec.containers) {
    let newContainerObject = {
      name: container.name,
      resources: container.resources
    };

    // TODO - get and delete matching current usage data by regex deployment-name* from mongo
    // get matching current usage object to the pod_name-container_name key
    // const key = `${newPodObject.name}-${newContainerObject.name}`;
    // const currentUsageContainer = currentUsageMap.get(key);

    if (currentUsageContainer) {
      // put the values

      container.resources.current = {
        cpu: currentUsageContainer.cpu,
        memory: currentUsageContainer.memory
      };

      container = convertResourcesValues(container);
    } else {
      logger.debug("Could not found current state for key:", key);
    }
    // push the object to the new container object
    newPodObject.containers.push(newContainerObject);
  }
  return newPodObject;
};

const buildState = async () => {
  let state = [];
  let deploymentsJson;
  let currentUsageMap;

  // get configs of resources and the current resources usage
  try {
    deploymentsJson = await getDeploymentsJson();
    await populateCurrentUsage();
  } catch (e) {
    logger.error(e.message);
    return;
  }
  // TODO remove this after testing
  process.exit(0);
  // build the state by iterating over all the deployments in a namespace
  for (const deployment of deploymentsJson.items) {
    try {
      // build initial object
      let newPodObject = {
        name: deployment.metadata.name,
        uid: deployment.metadata.uid,
        namespace: deployment.metadata.namespace,
        containers: []
      };

      // build the containers inner objects and push to the containers array
      newPodObject = buildContainerJson(
        deployment,
        newPodObject,
        currentUsageMap
      );
      state.push(newPodObject); // push the new pod object to the state
    } catch (e) {
      logger.error(e.message);
    }
  }
  logger.info(
    `a build of new state was ended successfully, length: ${state.length}`
  );
  return state;
};

module.exports = { buildState };
