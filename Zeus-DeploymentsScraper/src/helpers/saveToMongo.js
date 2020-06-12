const { Controller, controllerModelName } = require("../models/Controller");
const ControllerModel = require("mongoose").model(controllerModelName);

const { LiveController, liveControllerModelName } = require("../models/LiveControllers");
const LiveControllerModel = require("mongoose").model(liveControllerModelName);


const logger = require("../helpers/logger");

const saveController = async (newControllerObj) => {
  let count = 0;
  let newControllerDoc;


  try {
    newControllerDoc = new Controller({...newControllerObj});
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
  let newControllerDoc;
  let conditions = [ { name: newControllerObj.name }, { namespace: newControllerObj.namespace} ];

  try {
    let controllerExist = await LiveController.findOne({ $and: conditions });
    if (!controllerExist) {
      newControllerDoc = new Controller({...newControllerObj});
      await newControllerDoc.save();
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
