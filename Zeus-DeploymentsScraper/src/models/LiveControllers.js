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

const liveControllerModelName = config.LIVE_CONTROLLER_MODEL_NAME;
const LiveController = mongoose.model(liveControllerModelName, liveControllerSchema);

module.exports = { liveControllerModelName, LiveController, liveControllerSchema };
