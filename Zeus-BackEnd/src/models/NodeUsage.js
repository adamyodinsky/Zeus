const mongoose = require('mongoose');
const config = require('../config/config');

const NodeUsageSchema = new mongoose.Schema(
    {
      name: String,
      cluster: String,
      cpu: [String],
      memory: [String],
      date: Date,
      created: String,
      expirationDate: Date
    },
    {strict: false},
);

const nodeUsageModelName = config.nodeUsageModelName;
const NodeUsage = mongoose.model(nodeUsageModelName, NodeUsageSchema);

module.exports = {nodeUsageModelName, NodeUsageSchema, NodeUsage};
