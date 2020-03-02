'use strict';

module.exports = {
  DEFAULT_DEPLOYMENTS_LIMIT: Number(process.env.DEFAULT_DEPLOYMENTS_LIMIT) || 10,
  DEFAULT_NODES_LIMIT: Number(process.env.DEFAULT_NODES_LIMIT) || 10,
  deploymentModelName: process.env.DEPLOYMENT_MODEL || 'deployments',
  nodesModelName: process.env.DEPLOYMENT_MODEL || 'nodes',
  Host: process.env.HOST || 'localhost',
  Port: Number(process.env.PORT) || 3001,
  logLevel: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === "true",
  //----------FRONT-END----------------------------
  frontEndHost: process.env.FRONTEND_HOST || 'localhost',
  frontEndPort: Number(process.env.FRONTEND_PORT) || 3006,
  MONGO_URI: process.env.MONGO_URI || "mongodb://root:1234@localhost:27017/admin"
};
