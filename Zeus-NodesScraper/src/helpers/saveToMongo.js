const {Node, nodeModelName} = require('../models/Node');
const NodeModel = require('mongoose').model(nodeModelName);
const {NodeRequest} = require('../models/NodeRequest');
const {NodeUsage}  = require('../models/NodeUsage');

const logger = require('../helpers/logger');
const config = require('../config/config');

const saveNodeResources = async newNode => {
  let count;
  let newNodeRequestDoc;

  try {
    newNodeRequestDoc = new NodeRequest({...newNode});
    await newNodeRequestDoc.save();
    count = 1;
    logger.debug('Stored NodeRequest Object in DB', null);
  } catch (err) {
    count = 0;
    logger.error(err.stack);
  }
  return count;
};

const saveNode = async newNode => {
  let count = 0;
  let newNodeDoc;
  let conditions = [
    {name: newNode.name},
  ];

  try {
    let nodeExists = await Node.findOne({$and: conditions});
    if (!nodeExists) {
      newNodeDoc = new Node({...newNode});
      await newNodeDoc.save();
      count = 1;
    } else {
      // update surface objects
      await NodeModel.updateOne(
          {$and: conditions},
          {
            $set: {
              last_update: Date.now(),
              updates_counter: nodeExists.updates_counter + 1,
              pods: newNode.pods,
              expirationDate: Date.now() + (1000 * 60 * config.SAVE_DOC_MIN),
            },
          },
          {new: true},
      );

    }
    count = 1;
    logger.debug('Stored Node Object in DB', null);
  } catch (err) {
    logger.error(err.stack);
  }
  return count;
};

const saveNodeUsage = async newNode => {
  let count;
  let newNodeUsageDoc;

  try {
    newNodeUsageDoc = new NodeUsage({...newNode});
    await newNodeUsageDoc.save();
    count = 1;
    logger.debug('Stored NodeRequest Object in DB', null);
  } catch (err) {
    count = 0;
    logger.error(err.stack);
  }
  return count;
};

module.exports = {saveNode, saveNodeUsage, saveNodeResources};
