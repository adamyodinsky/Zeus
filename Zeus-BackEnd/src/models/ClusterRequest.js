const mongoose = require("mongoose");
const config = require("../config/config");

const ClusterRequestSchema = new mongoose.Schema(
    {
      cluster: String,
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
      date: Date,
      expirationDate: Date
    },
    {strict: false}
);

const clusterRequestModelName = config.clusterRequestModelName;
const ClusterRequest = mongoose.model(clusterRequestModelName, ClusterRequestSchema);

module.exports = {clusterRequestModelName, ClusterRequestSchema, ClusterRequest};
