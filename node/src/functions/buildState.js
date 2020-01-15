const { exec } = require('../helpers/exec');
const logger = require('../helpers/logger');

const getPodsJson = async() => {
  let command =  'kubectl get pods -n apps -o json';
  let podsJson;

  try {
    podsJson = await exec(command);
    podsJson = JSON.parse(podsJson.stdout);
    logger.info(`Got Pods Json, length=${podsJson.items.length}`)
  } catch (err) {
    logger.error(err.message);
  }

  return podsJson;
};


const buildState = async() => {
  let state = [];
  let podsJson;
  let currentUsageMap;

  // get configs of resources and the current resources usage
  try {
    podsJson = await getPodsJson();
    currentUsageMap = await getCurrentUsage();
  } catch (e) {
    logger.error(e.message);
    return;
  }

  // build the state by iterating over all the pods in a namespace
  for (const pod of podsJson.items) {
    try {

      // build initial object
      const newPodObject = {
        name: pod.metadata.name,
        uid: pod.metadata.uid,
        namespace: pod.metadata.namespace,
        containers: []
      };

      // build the containers inner objects and push to the containers array
      for (const container of pod.spec.containers) {
        let newContainerObject = {
          name: container.name,
          resources: container.resources
        };

        // get matching current usage object to the pod_name-container_name key
        const key = `${newPodObject.name}-${newContainerObject.name}`;
        const currentUsageContainer = currentUsageMap.get(key);

        if (currentUsageContainer) { // put the values
          container.resources.current = {
            cpu: currentUsageContainer.cpu,
            memory: currentUsageContainer.memory
          };
        } else {
          logger.error('Could not found current state for key:', key);
        }
        // push the object to the new container object
        newPodObject.containers.push(newContainerObject);
      }
      state.push(newPodObject); // push the new pod object to the state
    } catch (e) {
      logger.error(e.message);
    }
  }
  logger.info(`a build of new state was ended successfully, length: ${state.length}`);
  return state;
};

const getCurrentUsage = async() => {
  let currentUsageState = [];
  const command = 'kubectl top pods  -n apps --containers';

  try {
    // make a list of pods current resources usage
    let PodsCurrentUsageList = await exec(command);
    PodsCurrentUsageList = (PodsCurrentUsageList.stdout).split('\n');
    // remove first and last object;
    PodsCurrentUsageList.pop();
    PodsCurrentUsageList.shift();

    // create pod current resources usage objects and push into the array
    for (let pod of PodsCurrentUsageList) {
      pod = pod.split(/(\s+)/);
      const podObject = {
        pod_name: pod[0],
        container_name: pod[2],
        cpu: pod[4],
        memory: pod[6]
      };
      currentUsageState.push(podObject);
    }
    logger.info(`Got current usage state of ${currentUsageState.length}`);
  } catch (e) {
    logger.error(e.message);
  }
  // convert the array to hash-map and return it
  // TODO - just make it a map from the start, no need to make array and than convert
  return  (new Map(currentUsageState.map(obj => [`${obj.pod_name}-${obj.container_name}`, obj])));
};

module.exports = { buildState };

