const mongoose = require('mongoose');
const config = require('../config/config');

const ClusterUsageSchema = new mongoose.Schema(
    {
      cluster: String,
      cpu: Number,
      memory: Number,
      date: Date,
      expirationDate: Date
    },
    {strict: false},
);

const clusterUsageModelName = config.clusterUsageModelName;
const ClusterUsage = mongoose.model(clusterUsageModelName, ClusterUsageSchema);

module.exports = {clusterUsageModelName, ClusterUsageSchema, ClusterUsage};
