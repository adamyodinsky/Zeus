const { CurrentUsage, currentUsageModelName } = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const { Deployment, deploymentModelName} = require('../models/Deployment');
const DeploymentModel = require('mongoose').model(deploymentModelName);

const logger = require("../helpers/logger");


const saveCurrentUsageObject = async curr_usage => {
  let count;
  let conditions = { pod_name: curr_usage.pod_name };

  try {
    const newUsageObject = new CurrentUsage({ ...curr_usage });
    let exist = await CurrentUsage.findOne(conditions);
    if (!exist) {
      count = await newUsageObject.save();
    } else {
      count = await CurrentUsageModel.updateOne(
          `${conditions}`,
        {
          ...curr_usage,
          updated: true,
          updates_counter: exist.updates_counter + 1,
          expirationDate: Date.now() + 1000 * 60 * 2
        },
        { new: true }
      );
    }
    logger.debug("Stored new pod current usage Object in DB", null);
  } catch (err) {
    logger.error(err.message);
  }
  return count.nModified;
};

const saveDeployment = async(newDeployment) => {
  let count;
  let newDeploymentDoc;
  const conditions = { deployment_name: newDeployment.deployment_name };

  try {
    let deploymentExists = await Deployment.findOne(conditions);
    if (!deploymentExists) {
      newDeploymentDoc = new Deployment({ ...newDeployment });
      count = await newDeploymentDoc.save();
    } else {

      for (let pod of newDeploymentDoc._doc.pods) {

      };


      count = await DeploymentModel.updateOne(
          conditions,
          {
            ...newDeployment,
            updated: true,
            updates_counter: deploymentExists.updates_counter + 1,
            expirationDate: Date.now() + 1000 * 60 * 7
          },
          { new: true }
      );
    }
    logger.debug("Stored new Deployment Object in DB", null);
  } catch (err) {
    logger.error(err.message);
  }
  return count.nModified;
};

module.exports = { saveCurrentUsageObject, saveDeployment };
