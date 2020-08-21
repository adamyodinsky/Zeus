'use strict';

const express = require('express');
const config = require('./config/config');
const logger = require('./helpers/logger');
const { mainStateBuilder } = require('./main');
const connectDB = require('./config/mongoose');

const app = express();
connectDB();

// use router api
const apiRouter = require('./routes/apiRouter')();
app.use('/', apiRouter);

// run server
app.listen(config.PORT, () => {
  logger.info(`Server running on ${config.PORT}:${config.HOST}`);
});

mainStateBuilder();
