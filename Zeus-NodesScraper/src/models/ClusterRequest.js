const mongoose = require("mongoose");
const config = require("../config/config");

const ClusterRequestSchema = new mongoose.Schema(
    {
      cluster: {
        type: String,
        required: true,
        default: config.CLUSTER
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

const clusterRequestModelName = config.clusterRequestModelName;
const ClusterRequest = mongoose.model(clusterRequestModelName, ClusterRequestSchema);

module.exports = {clusterRequestModelName, ClusterRequestSchema, ClusterRequest};
