'use strict';

const express = require('express');
const { health } = require('../controllers/healthController');
const { getDeploymentsState, getNodesState } = require('../controllers/getStateControler');

const routes = () => {
  const apiRouter = express.Router();

  // API Routes
  apiRouter.get('/', health);
  apiRouter.get('/deployments', getDeploymentsState);
  apiRouter.get('/nodes', getNodesState);

  return apiRouter;
};

module.exports = routes;
