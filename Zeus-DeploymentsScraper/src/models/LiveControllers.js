const mongoose = require('mongoose');
const config = require('../config/config');

const liveControllerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cluster: {
    type: String,
    required: true,
    default: config.CLUSTER
  },
  namespace: {
    type: String,
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

const controllerModelName = 'current_usage';
const Controller = mongoose.model(controllerModelName, liveControllerSchema);

module.exports = { controllerModelName, Controller, controllerSchema: liveControllerSchema };
