const mongoose = require("mongoose");
const config = require("../config/config");

const NodeRequestSchema = new mongoose.Schema(
    {
      name: String,
      cluster: String,
      resources:
        {
          cpu: {
            request: [String],
            limit: [String]
          },
          memory: {
            request: [String],
            limit: [String]
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
