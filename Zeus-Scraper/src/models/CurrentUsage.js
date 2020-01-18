const mongoose = require('mongoose');
const config = require('../config/config');

const CurrentUsageSchema = new mongoose.Schema({
  pod_name: {
    type: String,
    required: true
  },
  containers: {
    type: [Object],
    required: true
  },
  namespace: {
    type: String,
    required: true,
    default: config.NAMESPACE
  },
  updates_counter: {
    type: Number,
    required: true,
    default: 0
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
const CurrentUsage = mongoose.model(currentUsageModelName, CurrentUsageSchema);

module.exports = { currentUsageModelName, CurrentUsage, CurrentUsageSchema };
