'use strict';

const express = require('express');
const { health } = require('../controllers/healthController');
const { getControllers, getSpecificController, getNodes, getNodesUsage, getNodesRequest, getClusterUsage, getClusterRequest} = require('../controllers/getStateControler');

const routes = () => {
  const apiRouter = express.Router();

  // API Routes
  apiRouter.get('/', health);
  apiRouter.get('/controllers', getControllers);
  apiRouter.get('/controllerUsage', getSpecificController);
  apiRouter.get('/nodes', getNodes);
  apiRouter.get('/nodesUsage', getNodesUsage);
  apiRouter.get('/nodesRequest', getNodesRequest);
  apiRouter.get('/clusterUsage', getClusterUsage);
  apiRouter.get('/clusterRequest', getClusterRequest);

  return apiRouter;
};

module.exports = routes;
