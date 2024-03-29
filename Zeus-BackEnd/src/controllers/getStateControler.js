const config = require('../config/config');
const logger = require('../helpers/logger');
const {createConditions} = require('../helpers/createCondition');
//MongoDB
const {controllerSchema} = require('../models/Controller');
const ControllerModel = require('mongoose').model(
    config.controllerModelName,
    controllerSchema,
);
const {liveControllerSchema} = require('../models/LiveControllers');
const LiveControllerModel = require('mongoose').model(
    config.liveControllerModelName,
    liveControllerSchema,
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

const {NodeRequestSchema} = require('../models/NodeRequest');
const NodesRequestModel = require('mongoose').model(
    config.nodeRequestModelName,
    NodeRequestSchema,
);

const {ClusterRequestSchema} = require('../models/ClusterRequest');
const ClusterRequestModel = require('mongoose').model(
    config.clusterRequestModelName,
    ClusterRequestSchema,
);

const {ClusterUsageSchema} = require('../models/ClusterUsage');
const ClusterUsageModel = require('mongoose').model(
    config.clusterUsageModelName,
    ClusterUsageSchema,
);

const getControllers = async (req, res) => {
  try {
    const limit = req.query.limit || config.DEFAULT_CONTROLLERS_LIMIT;
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
      'name',
      'kind'];
    const conditions = createConditions(regex, fields, regexOptions);

    const response = await LiveControllerModel.find(conditions).
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

const getSpecificController = async (req, res) => {
  try {
    const limit = Number(req.query.limit || config.DEFAULT_SPECIFIC_CONTROLLER_LIMIT);
    const page = req.query.page || 0;
    const sort = Number(req.query.sort) || 1;
    const cluster = req.query.cluster;
    const name = req.query.name;
    const namespace = req.query.namespace;
    const kind = req.query.kind;

    // set conditions
    const conditions = [{name: name}, {cluster: cluster}, {kind: kind}, {namespace: namespace}];

    const response = await ControllerModel.find({$and: conditions}).
        limit(limit).
        skip(page * limit).
        sort({date: sort});

    res.status(200).json({
      length: response.length,
      data: response,
    });

    logger.info('get specific controller - success');
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


const getNodesRequest = async (req, res) => {
  try {
    const limit = Number(req.query.limit || config.DEFAULT_NODES_USAGE_LIMIT);
    const page = req.query.page || 0;
    const sort = Number(req.query.sort) || 1;
    const cluster = req.query.cluster;
    const name = req.query.name;


    // set conditions
    const conditions = [{name: name}, {cluster: cluster}];

    const response = await NodesRequestModel.find({$and: conditions}).
        limit(limit).
        skip(page * limit).
        sort({date: sort});

    res.status(200).json({
      length: response.length,
      data: response,
    });

    logger.info('get nodes request state controller - success');
  } catch (e) {
    res.status(500).json('Internal Server Error');
    logger.error(e.stack);
  }
};


const getClusterUsage = async (req, res) => {
  try {
    const limit = Number(req.query.limit || config.DEFAULT_CLUSTER_USAGE_LIMIT);
    const page = req.query.page || 0;
    const sort = Number(req.query.sort) || 1;

    const response = await ClusterUsageModel.find().
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


const getClusterRequest = async (req, res) => {
  try {
    const limit = Number(req.query.limit || config.DEFAULT_CLUSTER_USAGE_LIMIT);
    const page = req.query.page || 0;
    const sort = Number(req.query.sort) || 1;

    const response = await ClusterRequestModel.find().
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

module.exports = {getControllers, getSpecificController, getNodes, getNodesUsage, getNodesRequest, getClusterRequest, getClusterUsage};
