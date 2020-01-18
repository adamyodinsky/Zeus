const {
  CurrentUsage,
  currentUsageModelName
} = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const { Deployment, deploymentModelName } = require("../models/Deployment");
const DeploymentModel = require("mongoose").model(deploymentModelName);

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
          last_update: Date.now(),
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


const saveDeployment = async newDeployment => {
  let count;
  let newDeploymentDoc;
  let conditions = [
    { deployment_name: newDeployment.deployment_name },
    { namespace: { $eq: newDeployment.namespace } }
  ];

  try {
    let deploymentExists = await Deployment.findOne({ $and: conditions });
    if (!deploymentExists) {
      newDeploymentDoc = new Deployment({ ...newDeployment });
      count = await newDeploymentDoc.save();
    } else {
      // update surface objects
      count = await DeploymentModel.updateOne(
        { $and: conditions },
        {
          $set: {
            replicas: newDeployment.replicas,
            uid: newDeployment.uid,
            last_update: Date.now(),
            namespace: newDeployment.namespace,
            updates_counter: deploymentExists.updates_counter + 1,
            expirationDate: Date.now() + 1000 * 60 * 7
          }
        },
        { new: true }
      );

      // updated nested objects
      for (let container of newDeployment.containers) {
        conditions.push({
          "containers.container_name": { $eq: container.container_name }
        });
        count = await DeploymentModel.updateOne(
          { $and: conditions },
          {
            $set: {
              "containers.$.resources": container.resources
            },
            $push: { "containers.$.usage_samples": container.usage_samples[0] }
          }
        );
        conditions.pop();
      }
    }
    logger.debug("Stored new Deployment Object in DB", null);
  } catch (err) {
    logger.error(err.message);
  }
  return 1;
};

module.exports = { saveCurrentUsageObject, saveDeployment };
