'use strict';

const config = require('./config/config');
const connectDB = require('./config/mongoose');
connectDB();

const express = require('express');
const logger = require('./helpers/logger');
const bodyParser = require('body-parser');
const cors = require('cors');
// const corsOptions = require('./config/corsConfig');

const app = express();
const apiRouter = require('./routes/apiRouter')();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', apiRouter); // use router api


// run server
app.listen(config.Port, () => {
  logger.info(`Server running on ${config.Port}:${config.Host}`);
});

