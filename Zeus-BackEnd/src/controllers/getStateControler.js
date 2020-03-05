const config = require("../config/config");
const logger = require("../helpers/logger");
const { createConditions } = require('../helpers/createCondition');
const { DeploymentSchema } = require("../models/Deployment");
const DeploymentModel = require("mongoose").model(
  config.deploymentModelName,
  DeploymentSchema
);
const { NodeSchema } = require("../models/Node");
const NodesModel = require("mongoose").model(
    config.nodesModelName,
    NodeSchema
);

const getDeploymentsState = async (req, res) => {
  try {
    const limit = req.query.limit || config.DEFAULT_DEPLOYMENTS_LIMIT;
    const page = req.query.page || 0;
    const sort = req.query.sort || "";
    const regexOptions = req.query.regexOpt || 'i';

    // set regex
    let regex = req.query.regex || "";
    regex = new RegExp(`${regex}`);

    // set conditions
    const fields = ['cluster', 'namespace', 'deployment_name', 'containers.container_name'];
    const conditions = createConditions(regex, fields, regexOptions);

    const response = await DeploymentModel.find(conditions)
      .limit(limit)
      .skip(page * limit)
      .sort(sort);

    res.status(200).json({
      length: response.length,
      data: response
    });

    logger.info("get deployments state controller - success");
  } catch (e) {
    logger.error(e.stack);
  }
};


const getNodesState = async (req, res) => {
  try {
    const limit = req.query.limit || config.DEFAULT_NODES_LIMIT;
    const page = req.query.page || 0;
    const sort = req.query.sort || "";
    const regexOptions = req.query.regexOpt || 'i';

    // set regex
    let regex = req.query.regex || "";
    regex = new RegExp(`${regex}`);

    // set conditions
    const fields = ['cluster', 'namespace', 'name', 'pods.name'];
    const conditions = createConditions(regex, fields, regexOptions);

    const response = await NodesModel.find(conditions)
        .limit(limit)
        .skip(page * limit)
        .sort(sort);

    res.status(200).json({
      length: response.length,
      data: response
    });

    logger.info("get nodes state controller - success");
  } catch (e) {
    logger.error(e.stack);
  }
};

module.exports = { getDeploymentsState, getNodesState };
