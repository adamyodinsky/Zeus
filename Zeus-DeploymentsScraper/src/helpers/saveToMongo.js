const ControllerModel = require("mongoose").model(controllerModelName);
const { Controller, controllerModelName } = require("../models/Controller");
const { LiveController, liveControllerModelName } = require("../models/LiveControllers");


const logger = require("../helpers/logger");

const saveController = async (newControllerObj) => {
  let count;
  let newControllerDoc;

  try {
    newControllerDoc = new Controller({...newControllerObj});
    await newControllerDoc.save();
    count = 1;
    logger.debug('Stored Controller Object in DB', newControllerObj.name);
  } catch (err) {
    count = 0;
    logger.error(err.stack);
  }
  return count;
};



const saveLiveController = async (newControllerObj) => {
  let count;
  let newControllerDoc;

  try {
    newControllerDoc = new Controller({...newControllerObj});
    await newControllerDoc.save();
    count = 1;
    logger.debug('Stored Controller Object in DB', newControllerObj.name);
  } catch (err) {
    count = 0;
    logger.error(err.stack);
  }
  return count;
};

module.exports = { saveController, saveLiveController };
