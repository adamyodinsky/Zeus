const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const { saveCurrentUsageObject, saveDeployment } = require("../helpers/saveToMongo");
const { currentUsageModelName } = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const config = require("../config/config");

const convertToNumber = (str) => {
  return Number(str.replace(/\D/g, ""));
};

const convertResourcesValues = resources => {
  let result = {};
  for (let [key, value] of Object.entries(resources)) {
    result[key] = convertToNumber(resources[key]);
  }

  return result;
};

const buildDeploymentObject = async (deployment, newDeploymentObject) => {
  let currentUsageObject = true;
  let deploymentResourceMap = new Map(
    deployment.spec.template.spec.containers.map(container => {
      return [container.name, container.resources];
    })
  );

  // iterating over live pods matching a deployment
  while (currentUsageObject) {
    currentUsageObject = await CurrentUsageModel.findOneAndDelete({
      pod_name: { $regex: deployment.metadata.name }
    });

    if (!currentUsageObject) {
      continue;
    }

    let newPod = {
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
            date: currentUsageObject.date,
            txt: {
              memory: container.memory,
              cpu: container.cpu
            },
            num: {}
          }
        ]
      };

      if (container.container_name === config.sideCar.name) {
        newContainer.resources.txt = config.sideCar.resources;
      } else {
        newContainer.resources.txt = deploymentResourceMap.get(
          container.container_name
        );
      }

      newContainer.resources.num = {};
      newContainer.resources.num.requests = convertResourcesValues(newContainer.resources.txt.requests);
      newContainer.usage_samples[0].num = convertResourcesValues(newContainer.usage_samples[0].txt);

      console.log(JSON.stringify(newContainer));
      process.exit(0);
      newPod.containers.push(newContainer);
    } // for loop ended
    newDeploymentObject.pods.push(newPod);

    // TODO - CONVERT STRINGS TO NUMBERS, CPU MEM
  } // while loop ended

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
        pods: []
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
    `a build of new state was ended successfully, length: ${state.length}, modified: ${count}`
  );
  return count;
};

module.exports = { buildState };
