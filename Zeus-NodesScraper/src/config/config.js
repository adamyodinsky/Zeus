'use strict';

module.exports = {
  METRIC_INTERVAL: Number(process.env.METRIC_INTERVAL) || 30,
  SAVE_DOC_MIN: Number(process.env.SAVE_DOC_MIN) ||  60,
  HOST: process.env.HOST || 'localhost',
  PORT: Number(process.env.PORT || 3003),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === "true",
  CLUSTER: process.env.CLUSTER || 'eks-dev',
  MONGO_URI: process.env.MONGO_URI || "mongodb://root:1234@localhost:27017/admin",
  DEPLOYMENT_MODEL_NAME: process.env.DEPLOYMENT_MODEL || 'deployment',
  NODES_MODEL_NAME: process.env.NODES_MODEL_NAME || 'node',
  NODES_USAGE_MODEL_NAME: process.env.NODES_USAGE_MODEL_NAME || 'node-usage',
  NODES_REQUEST_MODEL_NAME: process.env.NODES_REQUEST_MODEL_NAME || 'node-request',
  CLUSTER_USAGE_MODEL_NAME: process.env.CLUSTER_USAGE_MODEL_NAME || 'cluster-usage',
  CLUSTER_REQUEST_MODEL_NAME: process.env.CLUSTER_REQUEST_MODEL_NAME || 'cluster-request',
};
