'use strict';

const express = require('express');
const { health } = require('../controllers/healthController');
const { getState } = require('../controllers/getStateControler');

const routes = () => {
  const apiRouter = express.Router();

  // API Routes
  apiRouter.get('/', health);
  apiRouter.get('/state', getState);

  return apiRouter;
};

module.exports = routes;
