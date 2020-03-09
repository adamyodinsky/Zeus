'use strict';

const express = require('express');
const { health } = require('../controllers/healthController');
const { getDeploymentsState, getNodes, getNodesUsage, getNodesRequest} = require('../controllers/getStateControler');

const routes = () => {
  const apiRouter = express.Router();

  // API Routes
  apiRouter.get('/', health);
  apiRouter.get('/deployments', getDeploymentsState);
  apiRouter.get('/nodes', getNodes);
  apiRouter.get('/nodesUsage', getNodesUsage);
  apiRouter.get('/nodesRequest', getNodesRequest);


  return apiRouter;
};

module.exports = routes;
