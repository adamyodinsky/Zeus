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
            request: [String],
            limit: [String]
          },
          memory: {
            request: [String],
            limit: [String]
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

const clusterRequestModelName = config.nodeRequestModelName;
const ClusterRequest = mongoose.model(clusterRequestModelName, ClusterRequestSchema);

module.exports = {clusterRequestModelName, ClusterRequestSchema, ClusterRequest};
