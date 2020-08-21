const mongoose = require('mongoose');
const config = require('../config/config');

const controllerSchema = new mongoose.Schema({
  name: String,
  cluster: String,
  replicas: Number,
  namespace: String,
  pods:  Array,
  containers: [Object],
  date: Date,
  created: Date,
  expirationDate:  Date,
}, {strict: false});

const controllerModelName = config.controllerModelName;
const Controller = mongoose.model(controllerModelName, controllerSchema);

module.exports = { controllerModelName, Controller, controllerSchema };
