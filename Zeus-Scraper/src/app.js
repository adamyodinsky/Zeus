'use strict';

const express = require('express');
const config = require('./config/config');
const logger = require('./helpers/logger');
const { mainStateBuilder } = require('./functions/main');

const app = express();
const apiRouter = require('./routes/apiRouter')();

// use router api
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', apiRouter);

// run server
app.listen(3000, () => {
  logger.info(`Server running on ${config.Port}:${config.Host}`);
});

mainStateBuilder();
