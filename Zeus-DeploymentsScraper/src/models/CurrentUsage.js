const mongoose = require('mongoose');
const config = require('../config/config');

const CurrentDeploymentsUsageSchema = new mongoose.Schema({
  cluster: {
    type: String,
    required: true,
    default: config.CLUSTER
  },
  namespace: {
    type: String,
    required: true
  },
  pod_name: {
    type: String,
    required: true
  },
  containers: {
    type: [Object],
    required: true
  },
  updates_counter: {
    type: Number,
    required: true,
    default: 0
  },
  date: {
    type: Date,
    required: true
  },
  last_update: {
    type: Date
  },
  created: {
    type: Date,
    required: true,
    default: Date.now()
  },
  expirationDate: {
    type: Date,
    expires: 0,
    default: (Date.now() + 1000*60*2),
  }
}, {strict: false});

const currentUsageModelName = 'current_usage';
const CurrentUsage = mongoose.model(currentUsageModelName, CurrentDeploymentsUsageSchema);

module.exports = { currentUsageModelName, CurrentUsage, CurrentUsageSchema: CurrentDeploymentsUsageSchema };
