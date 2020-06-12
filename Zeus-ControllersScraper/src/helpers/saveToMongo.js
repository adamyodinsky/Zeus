const { Controller } = require("../models/Controller");
const { LiveController, liveControllerModelName } = require("../models/LiveControllers");
const LiveControllerModel = require("mongoose").model(liveControllerModelName);
const config = require('../config/config');

const logger = require("../helpers/logger");

const saveController = async (newControllerObj) => {
  const containers = [];
  for (const [key, value] of Object.entries(newControllerObj.containers)) {
    containers.push(value);
  }

  let count = 0;
  let newControllerDoc;
  try {
    newControllerDoc = new Controller({
      ...newControllerObj,
      containers: containers
    });
    await newControllerDoc.save();
    logger.debug('Stored Controller Object in DB', newControllerObj.name);
    count = 1;
  } catch (err) {
    logger.error(err.stack);
  }
  return count;
};



const saveLiveController = async (newControllerObj) => {
  let count = 0;
  let newLiveControllerDoc;
  let conditions = [ { name: newControllerObj.name }, { namespace: newControllerObj.namespace} ];

  try {
    let controllerExist = await LiveController.findOne({ $and: conditions });
    if (!controllerExist) {
      newLiveControllerDoc = new LiveController({
        name: newControllerObj.name,
        namespace: newControllerObj.namespace,
        date: newControllerObj.date,
        replaces: newControllerObj.replicas,
        kind: newControllerObj.kind
      });
      await newLiveControllerDoc.save();
    } else {
      await LiveControllerModel.updateOne(
          {$and: conditions},
          {
            $set: {
              expirationDate: (Date.now() + 1000 * 60 * config.SAVE_DOC_MIN),
              updates_counter: controllerExist.updates_counter + 1,
            },
          },
          {new: true},
      );
    }
    count = 1;
    logger.debug('Stored Controller Object in DB', newControllerObj.name);
  } catch (err) {
    logger.error(err.stack);
  }
  return count;
};

module.exports = { saveController, saveLiveController };
