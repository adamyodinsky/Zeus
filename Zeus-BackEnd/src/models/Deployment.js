const mongoose = require("mongoose");
const config = require("../config/config");

const DeploymentSchema = new mongoose.Schema(
  {
    deployment_name: String,
    cluster: String,
    namespace: String,
    pod_names: String,
    uid: String,
    updates_counter: Number,
    last_update: {
      type: Date
    },
    created: Date,
    expirationDate: Date,
    replicas: Number,
    containers: [
      {
        container_name: String,
        resources: {
          txt: Object,
          num: Object,
          sum: Object
        },
        usage_samples: [
          {
            date: Date,
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
        ]
      }
    ]
  },
  { strict: false }
);

const deploymentModelName = "deployment";
const Deployment = mongoose.model(deploymentModelName, DeploymentSchema);

module.exports = { deploymentModelName, DeploymentSchema, Deployment };
