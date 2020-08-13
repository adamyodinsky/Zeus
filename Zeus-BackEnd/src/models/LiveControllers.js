const mongoose = require('mongoose');
const config = require('../config/config');

const liveControllerSchema = new mongoose.Schema({
  name: String,
  cluster: String,
  updates_counter: Number,
  namespace: String,
  date: Date,
  created: Date,
  expirationDate:Date,
}, {strict: false});

const liveControllerModelName = config.liveControllerModelName;
const LiveController = mongoose.model(liveControllerModelName, liveControllerSchema);

module.exports = { liveControllerModelName, LiveController, liveControllerSchema };
