const logger = require("../helpers/logger");
const {saveLiveController} = require('../helpers/saveToMongo');
const {saveController} = require('../helpers/saveToMongo');
const {fetchPodsUsage} = require('./fetch');
const {parseControllerNameFromPod} = require('./parse');
const {fetchPodsJson} = require('./fetch');
const {convertToNumber} = require(
    '../../../Zeus-NodesScraper/src/helpers/convert');
const {parseControllerName} = require('./parse');
const {parsePodUsage} = require('./parse');


// insert containers to a key-value set in a controller object
const buildContainersSet = (newControllerObj, pod) => {
  for (const container of pod.spec.containers) {
    newControllerObj.containers[container.name] = {
      name: container.name,
      resources: container.resources,
      image: container.image,
      usage: {
        txt: undefined,
        sum: {
          cpu: 0,
          memory: 0
        }
      }
    }
  }
};


const buildControllersSet = (podsJson, controllersSet) => {

  for (let i = 0; i < podsJson.items.length; i++) {
    const pod = podsJson.items[i];
    const controllerNameKind = parseControllerNameFromPod(pod);

    // create controller obj
    let newControllerObj = {
      name: controllerNameKind.name,
      replicas: 1,
      kind: controllerNameKind.kind,
      namespace: pod.metadata.namespace,
      pods: [{
        name: pod.metadata.name,
        nodeName: pod.spec.nodeName
      }],
      containers: [],
      date: Date.now()
    };

    buildContainersSet(newControllerObj, pod);

    // insert controller to Controllers key-value set
    if(controllersSet[newControllerObj.name] === undefined) {
      controllersSet[newControllerObj.name] = newControllerObj;
    } else { // or push pod to an existing controller
      controllersSet[newControllerObj.name].pods.push({
        name: pod.metadata.name,
        nodeName: pod.spec.nodeName
      });
      controllersSet[newControllerObj.name].replicas += 1;
    }
  }

  return controllersSet;
};

const InsertContainersUsage = (controllersSet, PodsCurrentUsageList) => {
  // insert current usages to controllersSet under containers Set
  for (let i = 0; i < PodsCurrentUsageList.length; i++) {
    let pod = parsePodUsage(PodsCurrentUsageList[i]);

    for(let rmStrings=2; rmStrings >=0; rmStrings--) {
      let controllerName = parseControllerName(pod[0], rmStrings);
      let containerName = pod[1];
      let cpu = convertToNumber(pod[2]);
      let memory = convertToNumber(pod[3]);

      if (controllersSet[controllerName] !== undefined) {
        controllersSet[controllerName].containers[containerName].usage.sum = {
          cpu: controllersSet[controllerName].containers[containerName].usage.sum.cpu + cpu,
          memory: controllersSet[controllerName].containers[containerName].usage.sum.memory + memory
        };
        controllersSet[controllerName].containers[containerName].usage.txt = {
          cpu: pod[2],
          memory: pod[3]
        };
        rmStrings = -1; // break
      }
    }
  }
};

const buildControllersRequestUsageList = async () => {
  const controllersSet = [];

  try {
    // fetch list of pods current resources usage and manifests
    let PodsCurrentUsageList = await fetchPodsUsage();
    let podsJson = await fetchPodsJson();

    // build controllers set
    buildControllersSet(podsJson, controllersSet);

    // insert containers usages under controller objects
    InsertContainersUsage(controllersSet, PodsCurrentUsageList);

    logger.info("Parsed Pod-Manifests:", podsJson.items.length, "Container-Usage:", PodsCurrentUsageList.length);
  } catch (e) {
    logger.error(e.stack);
  }
  return controllersSet;
};

const build = async () => {
  logger.info("Controllers Build Iteration Starting...");
  let resourcesCount = 0;
  let controllerCount = 0;
  let controllersSetCount = 0;
  let startTime = Date.now();

  try {
    const controllersSet = await buildControllersRequestUsageList();
    for (const [key, value] of Object.entries(controllersSet)) {
      resourcesCount += await saveController(value);
      controllerCount += await saveLiveController(value);
      controllersSetCount++;
    }
  } catch (e) {
    logger.error(e.stack);
  }
  let interval =  (Date.now() - startTime) / 1000;
  logger.info(`Set-Count: ${controllersSetCount}, Resources-Count: ${resourcesCount}, Controllers-Count: ${controllerCount}`);
  logger.info("Controllers Build Ended Successfully, Iteration Time:", interval + 's');
};

module.exports = { buildControllersState: build };
