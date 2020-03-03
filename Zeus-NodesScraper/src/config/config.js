'use strict';

module.exports = {
  METRIC_INTERVAL: Number(process.env.METRIC_INTERVAL) || 30,
  SAVE_DOC: Number(process.env.SAVE_DOC) ||  60,
  Host: process.env.HOST || 'localhost',
  Port: Number(process.env.PORT || 3003),
  logLevel: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === "true",
  MONGO_URI: process.env.MONGO_URI || "mongodb://root:1234@localhost:27017/admin",
  CLUSTER: process.env.CLUSTER || 'eks-dev',
};
