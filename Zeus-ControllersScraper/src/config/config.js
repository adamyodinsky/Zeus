"use strict";

module.exports = {
  CONTROLLER_MODEL_NAME: process.env.CONTROLLER_MODEL_NAME || "controller",
  LIVE_CONTROLLER_MODEL_NAME:
    process.env.LIVE_CONTROLLER_MODEL_NAME || "live-controller",
  METRIC_INTERVAL: Number(process.env.METRIC_INTERVAL) || 30,
  SAVE_DOC_MIN: Number(process.env.SAVE_DOC_MIN) || 60,
  NAMESPACE: process.env.NAMESPACE || "apps",
  ALL_NAMESPACES: process.env.ALL_NAMESPACES === "true",
  HOST: process.env.HOST || "localhost",
  PORT: Number(process.env.PORT || 3002),
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  DEBUG: process.env.DEBUG === "true",
  SIDE_CAR_ACTIVE: process.env.SIDE_CAR_ACTIVE === "true",
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://root:1234@localhost:27027/admin",
  CLUSTER: process.env.CLUSTER || "minikube",
};
