const config = require('../config/config');
const logger = require('../helpers/logger');
const {createConditions} = require('../helpers/createCondition');
//MongoDB
const {DeploymentSchema} = require('../models/Deployment');
const DeploymentModel = require('mongoose').model(
    config.deploymentModelName,
    DeploymentSchema,
);
const {NodeSchema} = require('../models/Node');
const NodesModel = require('mongoose').model(
    config.nodeModelName,
    NodeSchema,
);
const {NodeUsageSchema} = require('../models/NodeUsage');
const NodesUsageModel = require('mongoose').model(
    config.nodeUsageModelName,
    NodeUsageSchema,
);

// const {NodeRequestSchema} = require('../models/NodeRequest');
// const NodesRequestModel = require('mongoose').model(
//     config.nodesRequestModelName,
//     NodeSchema,
// );

const getDeploymentsState = async (req, res) => {
  try {
    const limit = req.query.limit || config.DEFAULT_DEPLOYMENTS_LIMIT;
    const page = req.query.page || 0;
    const sort = req.query.sort || '';
    const regexOptions = req.query.regexOpt || 'i';

    // set regex
    let regex = req.query.regex || '';
    regex = new RegExp(`${regex}`);

    // set conditions
    const fields = [
      'cluster',
      'namespace',
      'deployment_name',
      'containers.container_name'];
    const conditions = createConditions(regex, fields, regexOptions);

    const response = await DeploymentModel.find(conditions).
        limit(limit).
        skip(page * limit).
        sort(sort);

    res.status(200).json({
      length: response.length,
      data: response,
    });

    logger.info('get deployments state controller - success');
  } catch (e) {
    res.status(500).json('Internal Server Error');
    logger.error(e.stack);
  }
};

const getNodes = async (req, res) => {
  try {
    const limit = req.query.limit || config.DEFAULT_NODES_LIMIT;
    const page = req.query.page || 0;
    const sort = req.query.sort || '';
    const regexOptions = req.query.regexOpt || 'i';

    // set regex
    let regex = req.query.regex || '';
    regex = new RegExp(`${regex}`);

    // set conditions
    const fields = ['cluster', 'name'];
    const conditions = createConditions(regex, fields, regexOptions);

    const response = await NodesModel.find(conditions).
        limit(limit).
        skip(page * limit).
        sort(sort);

    res.status(200).json({
      length: response.length,
      data: response,
    });

    logger.info('get nodes state controller - success');
  } catch (e) {
    res.status(500).json('Internal Server Error');
    logger.error(e.stack);
  }
};

const getNodesUsage = async (req, res) => {
  try {
    const limit = Number(req.query.limit || config.DEFAULT_NODES_USAGE_LIMIT);
    const page = req.query.page || 0;
    const sort = Number(req.query.sort) || 1;
    const cluster = req.query.cluster;
    const name = req.query.name;


    // set conditions
    const conditions = [{name: name}, {cluster: cluster}];

    const response = await NodesUsageModel.find({$and: conditions}).
        limit(limit).
        skip(page * limit).
        sort({date: sort});

    res.status(200).json({
      length: response.length,
      data: response,
    });

    logger.info('get nodes usage state controller - success');
  } catch (e) {
    res.status(500).json('Internal Server Error');
    logger.error(e.stack);
  }
};

module.exports = {getDeploymentsState, getNodes, getNodesUsage};
