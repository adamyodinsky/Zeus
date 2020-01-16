'use strict';

module.exports = {
  Host: process.env.CONSUL_HOST || 'localhost',
  Port: Number(process.env.CONSUL_PORT || 3001),
  logLevel: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === "true",
  STATE_FILE_PATH: process.env.STATE_FILE_PATH || `${__dirname}/stateFiles/`,
  STATE_FILE_NAME: process.env.STATE_FILE_NAME || 'ZeusState',
  S3_BUCKET: process.env.S3_BUCKET,
  //----------FRONT-END----------------------------
  frontEndHost: process.env.FRONTEND_HOST || 'localhost',
  frontEndPort: Number(process.env.FRONTEND_PORT) || 3006,
};
