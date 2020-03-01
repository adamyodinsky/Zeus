const {
  CurrentUsage,
  currentUsageModelName
} = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(currentUsageModelName);
const { Deployment, deploymentModelName } = require("../models/Deployment");
const DeploymentModel = require("mongoose").model(deploymentModelName);
const { Node, nodeModelName, NodeSchema } = require("../models/Node");
const NodeModel = require("mongoose").model(nodeModelName);


const logger = require("../helpers/logger");
const config = require('../config/config');

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
          cluster: config.CLUSTER,
          namespace: config.NAMESPACE,
          updates_counter: exist.updates_counter + 1
          // TODO expirationDate: Date.now() + 1000 * 60 * 2
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
            cluster: newDeployment.cluster,
            last_update: Date.now(),
            namespace: newDeployment.namespace,
            updates_counter: deploymentExists.updates_counter + 1
            // TODO expirationDate: Date.now() + 1000 * 60 * config.SAVE_DOC
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
              node: newNode.node,
              pods: newNode.pods
              // TODO expirationDate: Date.now() + 1000 * 60 * config.SAVE_DOC
            }
          },
          { new: true }
      );

    }
    logger.debug("Stored new Node Object in DB", null);
  } catch (err) {
    logger.error(err.message);
  }
  return 1;
};


const saveNodeUsage = async newNodeUsage => {
  let count;
  let newNodeDoc;
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
    logger.debug("Stored new Node Object in DB", null);
  } catch (err) {
    logger.error(err.message);
  }
  return 1;
};


module.exports = { saveCurrentUsageObject, saveDeployment, saveNode, saveNodeUsage };
