'use strict';

const express = require('express');
const config = require('./config/config');
const logger = require('./helpers/logger');
const { mainStateBuilder } = require('./functions/main');
const connectDB = require('./config/mongoDB');

const app = express();
connectDB();

// use router api
const apiRouter = require('./routes/apiRouter')();
app.use('/', apiRouter);

// run server
app.listen(config.Port, () => {
  logger.info(`Server running on ${config.Port}:${config.Host}`);
});

mainStateBuilder();
