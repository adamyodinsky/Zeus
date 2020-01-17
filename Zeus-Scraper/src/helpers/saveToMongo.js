const { CurrentUsage, currentUsageModelName } = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const { Deployment, deploymentModelName} = require('../models/Deployment');
const DeploymentModel = require('mongoose').model(deploymentModelName);

const logger = require("../helpers/logger");


const saveCurrentUsageObject = async curr_usage => {
  let count;
  try {
    const newUsageObject = new CurrentUsage({ ...curr_usage });
    let exist = await CurrentUsage.findOne({ pod_name: curr_usage.pod_name });
    if (!exist) {
      count = await newUsageObject.save();
    } else {
      count = await CurrentUsageModel.updateOne(
        { pod_name: curr_usage.pod_name },
        {
          ...curr_usage,
          updated: true,
          updates_counter: exist.updates_counter + 1,
          expirationDate: Date.now() + 1000 * 60 * 2
        },
        { new: true }
      );
    }
    logger.debug("Stored new Object in DB", null);
  } catch (err) {
    logger.error(err.message);
  }
  return count.nModified;
};

const saveDeployment = async(currentUsageObject, newDeploymentObject) => {
  let count;
  try {
    let exist = await DeploymentModel.findOne({ deployment_name: newDeploymentObject.deployment_name});
    if (!exist) {
      count = await newUsageObject.save();
    } else {
      count = await CurrentUsageModel.updateOne(
          { pod_name: curr_usage.pod_name },
          {
            ...curr_usage,
            updated: true,
            updates_counter: exist.updates_counter + 1,
            expirationDate: Date.now() + 1000 * 120
          },
          { new: true }
      );
    }
    logger.debug("Stored new Object in DB", null);
  } catch (err) {
    logger.error(err.message);
  }
  return count.nModified;
};

module.exports = { saveCurrentUsageObject };
