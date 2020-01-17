const mongoose = require('mongoose');
const config = require('../config/config');

const CurrentUsageSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true
  },
  pod_name: {
    type: String,
    required: true
  },
  container_name: {
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
  expirationDate: {
    type: Date,
    expires: 0,
    default: (Date.now() + 1000*60),
    // index: { expires: 10 }
  }
}, {strict: false});

const modelName = 'current_usage';
const CurrentUsage = mongoose.model(modelName, CurrentUsageSchema);

module.exports = { modelName, CurrentUsage, CurrentUsageSchema };
