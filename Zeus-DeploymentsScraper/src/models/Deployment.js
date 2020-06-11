const mongoose = require("mongoose");
const config = require("../config/config");

const DeploymentSchema = new mongoose.Schema(
  {
    deployment_name: {
      type: String,
      required: true
    },
    cluster: {
      type: String,
      required: true,
      default: config.CLUSTER
    },
    namespace: {
      type: String,
      required: true
    },
    pod_names: {
      type: [String],
      required: true
    },
    date: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    expirationDate: {
      type: Date,
      expires: 0,
      default: Date.now() + 1000 * 60 * config.SAVE_DOC_MIN
    },
    replicas: {
      type: Number,
      required: true
    },
    containers: [
      {
        container_name: String,
        resources: {
          txt: Object,
          num: Object,
          sum: Object
        },
        usage:
          {
            txt: {
              memory: String,
              cpu: String
            },
            sum: {
              memory: Number,
              cpu: Number
            },
            avg: {
              memory: Number,
              cpu: Number
            }
          }
      }
    ]
  },
  { strict: false }
);

const deploymentModelName = "deployment";
const Deployment = mongoose.model(deploymentModelName, DeploymentSchema);

module.exports = { deploymentModelName, DeploymentSchema, Deployment };
