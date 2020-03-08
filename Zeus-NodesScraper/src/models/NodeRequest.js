const mongoose = require("mongoose");
const config = require("../config/config");

const NodeRequestSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },
      cluster: {
        type: String,
        required: true,
        default: config.CLUSTER
      },
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
      created: {
        type: Date,
        default: Date.now,
        required: true,
      },
      expirationDate: {
        type: Date,
        expires: 0,
        default: Date.now() + 1000 * 60 * config.SAVE_DOC_MIN
      }
    },
    {strict: false}
);

const nodeRequestModelName = "node";
const NodeRequest = mongoose.model(nodeRequestModelName, NodeRequestSchema);

module.exports = {nodeRequestModelName, NodeRequestSchema, NodeRequest};
