'use strict';

module.exports = {
  Host: process.env.HOST || 'localhost',
  Port: Number(process.env.PORT) || 3001,
  logLevel: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === "true",
  //----------MONGO-DB----------------------------
  DEFAULT_CONTROLLERS_LIMIT: Number(process.env.DEFAULT_CONTROLLERS_LIMIT) || 5,
  DEFAULT_SPECIFIC_CONTROLLER_LIMIT: Number(process.env.DEFAULT_SPECIFIC_CONTROLLER_LIMIT) || 10,
  DEFAULT_NODES_LIMIT: Number(process.env.DEFAULT_NODES_LIMIT) || 5,
  DEFAULT_NODES_USAGE_LIMIT: Number(process.env.DEFAULT_NODES_USAGE_LIMIT) || 200,
  DEFAULT_CLUSTER_USAGE_LIMIT: Number(process.env.DEFAULT_CLUSTER_USAGE_LIMIT) || 200,
  liveControllerModelName: process.env.LIVE_CONTROLLER_MODEL_NAME || 'live-controller',
  controllerModelName: process.env.CONTROLLER_MODEL_NAME || 'controller',
  nodeModelName: process.env.NODES_MODEL_NAME || 'node',
  nodeUsageModelName: process.env.NODES_USAGE_MODEL_NAME || 'node-usage',
  nodeRequestModelName: process.env.NODES_REQUEST_MODEL_NAME || 'node-request',
  clusterUsageModelName: process.env.NODES_USAGE_MODEL_NAME || 'cluster-usage',
  clusterRequestModelName: process.env.NODES_REQUEST_MODEL_NAME || 'cluster-request',
  //----------FRONT-END----------------------------
  frontEndHost: process.env.FRONTEND_HOST || 'localhost',
  frontEndPort: Number(process.env.FRONTEND_PORT) || 3006,
  MONGO_URI: process.env.MONGO_URI || "mongodb://root:1234@localhost:27017/admin"
};
