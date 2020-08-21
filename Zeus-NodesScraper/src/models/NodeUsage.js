const mongoose = require('mongoose');
const config = require('../config/config');

const NodeUsageSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      cluster: {
        type: String,
        required: true,
        default: config.CLUSTER,
      },
      cpu: [Number],
      memory: [Number],
      date: Date,
      expirationDate: {
        type: Date,
        expires: 0,
        default: Date.now() + 1000 * 60 * config.SAVE_DOC_MIN,
      },
    },
    {strict: false},
);

const nodeUsageModelName = config.NODES_USAGE_MODEL_NAME;
const NodeUsage = mongoose.model(nodeUsageModelName, NodeUsageSchema);

module.exports = {nodeUsageModelName, NodeUsageSchema, NodeUsage};
