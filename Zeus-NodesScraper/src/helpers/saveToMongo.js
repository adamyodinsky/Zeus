const { Node, nodeModelName } = require("../models/Node");
const NodeModel = require("mongoose").model(nodeModelName);

const logger = require("../helpers/logger");
const config = require('../config/config');

const saveNode = async newNode => {
  let count;
  let newNodeDoc;
  let conditions = [
    { name: newNode.name }
  ];

  try {
    let nodeExists = await Node.findOne({ $and: conditions });
    if (!nodeExists) {
      newNodeDoc = new Node({ ...newNode });
      count = await newNodeDoc.save();
    } else {
      // update surface objects
      count = await NodeModel.updateOne(
          { $and: conditions },
          {
            $set: {
              last_update: Date.now(),
              updates_counter: nodeExists.updates_counter + 1,
              pods: newNode.pods,
              expirationDate: Date.now() + (1000 * 60 * config.SAVE_DOC_MIN)
            },
            $push: { "node": newNode.node[0] }
          },
          { new: true }
      );

    }
    logger.debug("Stored Node Object in DB", null);
  } catch (err) {
    logger.error(err.stack);
  }
  return 1;
};


const saveNodeUsage = async newNodeUsage => {
  let count;
  let conditions = [
    { name: newNodeUsage.name }
  ];

  try {
    let nodeExists = await Node.findOne({ $and: conditions });
    if (!nodeExists) {
      return;
    } else {
      // update surface objects
      count = await NodeModel.updateOne(
          { $and: conditions },
          {
            $push: { "usage":  newNodeUsage}
          },
          { new: true }
      );

    }
    logger.debug("Stored Node Usage Object in DB", null);
  } catch (err) {
    logger.error(err.stack);
  }
  return 1;
};


module.exports = { saveNode, saveNodeUsage };
