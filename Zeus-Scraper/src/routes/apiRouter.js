'use strict';

const express = require('express');
const { health } = require('../controllers/healthController');

const routes = () => {
  const apiRouter = express.Router();

  // API Routes
  apiRouter.get('/', health);

  return apiRouter;
};

module.exports = routes;
