const mongoose = require("mongoose");
const config = require("../config/config");

const NodeRequestSchema = new mongoose.Schema(
    {
      name: String,
      cluster: String,
      resources:
        {
          cpu: {
            request: [Number],
            limit: [Number]
          },
          memory: {
            request: [Number],
            limit: [Number]
          },
          date: Date
        },
      created: Date,
      expirationDate: Date
    },
    {strict: false}
);

const nodeRequestModelName = config.nodeRequestModelName;
const NodeRequest = mongoose.model(nodeRequestModelName, NodeRequestSchema);

module.exports = {nodeRequestModelName, NodeRequestSchema, NodeRequest};
