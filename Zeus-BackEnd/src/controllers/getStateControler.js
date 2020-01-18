const config = require("../config/config");
const logger = require("../helpers/logger");
const { createConditions } = require('../helpers/createCondition');
const { DeploymentSchema } = require("../models/Deployment");
const DeploymentModel = require("mongoose").model(
  config.deploymentModelName,
  DeploymentSchema
);

const getState = async (req, res) => {
  try {
    const limit = req.query.limit || config.DEFAULT_LIMIT;
    const page = req.query.page || 0;
    const sort = req.query.sort || "";
    const regexOptions = req.query.regexOpt || 'i';

    // set regex
    let regex = req.query.regex || "account-activations-deployment";
    regex = new RegExp(`${regex}`);

    // set conditions
    const fields = ['cluster', 'namespace', 'deployment_name', 'containers.container_name'];
    const conditions = createConditions(regex, fields, regexOptions);

    const response = await DeploymentModel.find(conditions)
      .limit(limit)
      .skip(page * limit)
      .sort(sort);

    res.status(200).json(response);
    logger.info("get state controller success");
  } catch (e) {
    logger.error(e.message);
  }
};

module.exports = { getState };
