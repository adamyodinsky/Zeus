const mongoose = require("mongoose");
const config = require("../config/config");

const DeploymentSchema = new mongoose.Schema(
  {
    deployment_name: {
      type: String,
      required: true
    },
    updated: {
      type: Boolean,
      required: true,
      default: true
    },
    uid: {
      type: String,
      required: true
    },
    updates_counter: {
      type: Number,
      required: true,
      default: 0
    },
    namespace: {
      type: String,
      required: true,
      default: config.NAMESPACE
    },
    date: {
      type: Date,
      default: Date.now
    },
    expirationDate: {
      type: Date,
      expires: 0,
      default: Date.now() + 1000 * 60 * 10 // 15 minutes
    },
    pods: [
      {
        pod_name: String,
        containers: [
          {
            container_name: String,
            resources: {
              txt: Object,
              num: Object
            },
            usage_samples: [
              {
                date: Date,
                txt: {
                  memory: String,
                  cpu: String,
                },
                num:  {
                  memory: Number,
                  cpu: Number
                }
              }
            ]
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
