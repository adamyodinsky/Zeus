const mongoose = require('mongoose');
const config = require('../config/config');

const DeploymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  uid: {
    type: Number,
    required: true
  },
  containers: {
        type: [Object],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {strict: false});

const Deployment = mongoose.model('deployment', DeploymentSchema);

module.exports = Deployment;
