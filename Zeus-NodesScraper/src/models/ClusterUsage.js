const mongoose = require('mongoose');
const config = require('../config/config');

const ClusterUsageSchema = new mongoose.Schema(
    {
      cluster: {
        type: String,
        required: true,
        default: config.CLUSTER,
      },
      cpu: Number,
      memory: Number,
      date: Date,
      expirationDate: {
        type: Date,
        expires: 0,
        default: Date.now() + 1000 * 60 * config.SAVE_DOC_MIN,
      },
    },
    {strict: false},
);

const clusterUsageModelName = config.clusterUsageModelName;
const ClusterUsage = mongoose.model(clusterUsageModelName, ClusterUsageSchema);

module.exports = {clusterUsageModelName, ClusterUsageSchema, ClusterUsage};
