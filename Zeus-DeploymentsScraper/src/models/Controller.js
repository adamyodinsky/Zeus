const mongoose = require('mongoose');
const config = require('../config/config');

const controllerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cluster: {
    type: String,
    required: true,
    default: config.CLUSTER
  },
  replicas: {
    type: Number,
    required: true
  },
  namespace: {
    type: String,
    required: true
  },
  pods: {
    type: Array,
    required: true
  },
  containers: {
    type: [Object],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now()
  },
  expirationDate: {
    type: Date,
    expires: 0,
    default: (Date.now() + 1000 * 60 * config.SAVE_DOC_MIN),
  }
}, {strict: false});

const controllerModelName = config.controllerModelName;
const Controller = mongoose.model(controllerModelName, controllerSchema);

module.exports = { controllerModelName, Controller, controllerSchema };
