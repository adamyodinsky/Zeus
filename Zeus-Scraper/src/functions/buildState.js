const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const { saveCurrentUsageObject } = require("../helpers/saveToMongo");
const CurrentUsageModel = require("mongoose").model(modelName);
const config = require('../config/config');

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

const buildPodJson = (deployment, newPodObject) => {
  for (let container of deployment.spec.template.spec.containers) {
    let newContainerObject = {
      name: container.name,
      resources: container.resources
    };

    // TODO - get matching current usage data by regex deployment-name* from mongo
    // mutate data with the newContainerObject
    // and put the container
    let currentUsageObject = 1;
    while(currentUsageObject) {
      const conditions = {};
      currentUsageObject = CurrentUsageModel.findOneAndDelete();
      if (currentUsageObject) {
        container.resources.current = {
          cpu: currentUsageObject.cpu,
          memory: currentUsageObject.memory
        };

        container = convertResourcesValues(container);
      } else {
        logger.debug("Could not found current state for key:", key);
      }

    }

    // push the object to the new container object
    newPodObject.containers.push(newContainerObject);
  }
  return newPodObject;
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
        pod_name: pod[0],
        namespace: config.NAMESPACE,
        containers: []
      };

      podObject.containers.push({
        container_name: pod[2],
        cpu: pod[4],
        memory: pod[6]
      });

      // push containers to the same pod object
      while (PodsCurrentUsageList[i+1]) {
        let nextPod = PodsCurrentUsageList[i+1].split(/(\s+)/);
        if(pod[0] === nextPod[0]) {
          podObject.containers.push({
            container_name: nextPod[2],
            cpu: nextPod[4],
            memory: nextPod[6]
          });
          i++;
        } else {
          break;
        }
      }

      count += await saveCurrentUsageObject(podObject); // save to mongo
    }
    logger.info(`Got current usage state to mongo collection, count:`, count);
  } catch (e) {
    logger.error(e.message);
  }
  return count;
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
  // build the state by iterating over all the deployments in a namespace
  for (const deployment of deploymentsJson.items) {
    try {
      // build initial object
      let newDeploymentObject = {
        name: deployment.metadata.name,
        uid: deployment.metadata.uid,
        namespace: deployment.metadata.namespace,
        pods: []
      };

      // build the pod inner objects
      newDeploymentObject = buildPodJson(deployment, newDeploymentObject);

      //TODO - save newDeploymentObject to mongo
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
