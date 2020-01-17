const mongoose = require('mongoose');
const config = require('../config/config');

const DeploymentSchema = new mongoose.Schema({
  deployment_name: {
    type: String,
    required: true
  },
  uid: {
    type: Number,
    required: true
  },
  updates_counter: {
    type: Number,
    required: true,
    default: 0
  },
  namespace: {
    type: String,
    required: true,
    default: config.NAMESPACE
  },
  date: {
    type: Date,
    default: Date.now
  },
  expirationDate: {
    type: Date,
    expires: 0,
    default: (Date.now() + 1000*60*10), // 15 minutes
  }
}, {strict: false});


const deploymentModelName = 'deployment';
const Deployment = mongoose.model(deploymentModelName, DeploymentSchema);

module.exports = { deploymentModelName, DeploymentSchema, Deployment };
