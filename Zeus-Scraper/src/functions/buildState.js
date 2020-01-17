const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const { saveCurrentUsageObject } = require("../helpers/saveToMongo");
const { currentUsageModelName } = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const config = require("../config/config");

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

const buildPodJson = async(deployment, newDeploymentObject) => {
  let currentUsageObject = true;
  let deploymentResourceMap = (
      new Map(deployment.spec.template.spec.containers.map(container => {
        return [container.name, container.resources]
      })));

  // iterating over live pods matching a deployment
  while(currentUsageObject) {
    currentUsageObject = await CurrentUsageModel.findOneAndDelete({
      pod_name: {$regex: deployment.metadata.name}
    });

    if (currentUsageObject) {
      let pod = {
        pod_name: currentUsageObject.pod_name,
        containers: []
      };
      // iterating over containers inside a live pod
      for (let container of currentUsageObject.containers) {
        let newContainer = {
          container_name: container.container_name,
          resources: {}, // how do i know this is the right container resources?
          usage_samples: [
            {
              memory: currentUsageObject.memory,
              cpu: currentUsageObject.cpu,
              date: currentUsageObject.date
            }
          ]
        };
        if (container.container_name === 'istio-proxy') {
          newContainer.resources = config.sideCar.resources
        }
      }
    }
    // TODO - CONVERT STRINGS TO NUMBERS, CPU MEM
  }

  return newPodObject;
};

const populateCurrentUsage = async () => {
  let count = 0;
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
      while (PodsCurrentUsageList[i + 1]) {
        let nextPod = PodsCurrentUsageList[i + 1].split(/(\s+)/);
        if (pod[0] === nextPod[0]) {
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
  let state = [];
  let deploymentsJson;
  let currentUsageMap;

  try {
    deploymentsJson = await fetchDeploymentsJson();
    await populateCurrentUsage();
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
        pods: []
      };

      // build the pod inner objects
      newDeploymentObject = await buildPodJson(deployment, newDeploymentObject);

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
