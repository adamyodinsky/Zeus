const mongoose = require('mongoose');
const config = require('../config/config');

const CurrentUsageSchema = new mongoose.Schema({
  pod_name: {
    type: String,
    required: true
  },
  containers_name: {
    type: String,
    required: true
  },
  cpu: {
    type: String,
    required: true
  },
  memory: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {strict: false});

const CurrentUsage = mongoose.model('current_usage', CurrentUsageSchema);

module.exports = CurrentUsage;
