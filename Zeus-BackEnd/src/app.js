'use strict';

const express = require('express');
const config = require('./config/config');
const logger = require('./helpers/logger');
const bodyParser = require('body-parser');
const { downloadFromS3Interval } = require('./controllers/getStateControler');
const cors = require('cors');
const connectDB = require('./config/mongoose');
// const corsOptions = require('./config/corsConfig');


connectDB();
const app = express();
const apiRouter = require('./routes/apiRouter')();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', apiRouter); // use router api

downloadFromS3Interval();

// run server
app.listen(config.Port, () => {
  logger.info(`Server running on ${config.Port}:${config.Host}`);
});

