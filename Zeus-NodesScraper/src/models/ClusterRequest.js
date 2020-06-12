const mongoose = require("mongoose");
const config = require("../config/config");

const ClusterRequestSchema = new mongoose.Schema(
    {
      cluster: {
        type: String,
        required: true,
        default: config.CLUSTER
      },
      capacity: {
        cpu: Number,
        memory: Number
      },
      resources:
        {
          cpu: {
            request: Number,
            limit: Number
          },
          memory: {
            request: Number,
            limit: Number
          }
        },
      date: {
        type: Date,
        required: true
      },
      expirationDate: {
        type: Date,
        expires: 0,
        default: Date.now() + 1000 * 60 * config.SAVE_DOC_MIN
      }
    },
    {strict: false}
);

const clusterRequestModelName = config.CLUSTER_REQUEST_MODEL_NAME;
const ClusterRequest = mongoose.model(clusterRequestModelName, ClusterRequestSchema);

module.exports = {clusterRequestModelName, ClusterRequestSchema, ClusterRequest};
