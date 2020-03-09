'use strict';

module.exports = {
  METRIC_INTERVAL: Number(process.env.METRIC_INTERVAL) || 30,
  SAVE_DOC_MIN: Number(process.env.SAVE_DOC_MIN) ||  60,
  Host: process.env.HOST || 'localhost',
  Port: Number(process.env.PORT || 3003),
  logLevel: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === "true",
  CLUSTER: process.env.CLUSTER || 'eks-dev',
  MONGO_URI: process.env.MONGO_URI || "mongodb://root:1234@localhost:27017/admin",
  deploymentModelName: process.env.DEPLOYMENT_MODEL || 'deployment',
  nodeModelName: process.env.NODES_MODEL_NAME || 'node',
  nodeUsageModelName: process.env.NODES_USAGE_MODEL_NAME || 'node-usage',
  nodeRequestModelName: process.env.NODES_REQUEST_MODEL_NAME || 'node-request',
};
