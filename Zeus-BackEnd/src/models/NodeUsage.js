const mongoose = require('mongoose');
const config = require('../config/config');

const NodeUsageSchema = new mongoose.Schema(
    {
      name: String,
      cluster: String,
      cpu: [Number],
      memory: [Number],
      date: Date,
      created: String,
      expirationDate: Date
    },
    {strict: false},
);

const nodeUsageModelName = config.nodeUsageModelName;
const NodeUsage = mongoose.model(nodeUsageModelName, NodeUsageSchema);

module.exports = {nodeUsageModelName, NodeUsageSchema, NodeUsage};
