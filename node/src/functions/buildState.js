const { exec } = require('../helpers/exec');
const logger = require('../helpers/logger');

const getPodsJson = async() => {
  let command =  'kubectl get pods -n apps -o json';
  let podsJson;

  try {
    podsJson = await exec(command);
    podsJson = JSON.parse(podsJson.stdout);
    logger.info(`Got Deployments Json, length=${podsJson.items.length}`)
  } catch (err) {
    logger.error(err.message);
  }

  return podsJson;
};


const buildState = async() => {
  const podsJson = await getPodsJson();
  const state = [];

  for (const pod of podsJson.items) {
    try {

      const newStateObject = {
        containers: []
      };

      newStateObject.name = pod.metadata.name;
      newStateObject.uid  = pod.metadata.uid;
      newStateObject.namespace =  pod.metadata.namespace;

      for (const container of pod.spec.containers) {
        let newContainerObject = {
          name: container.name,
          resources: container.resources
        };

        newStateObject.containers.push(newContainerObject);
      }

      state.push(newStateObject);
      logger.info(`a new object added successfully, name: ${newStateObject.name}`);
    } catch (e) {
      logger.error(e.message);
    }
  }

  logger.info(`a build of new state was ended successfully, length: ${state.length}`);
  return state;
};



module.exports = { buildState };

