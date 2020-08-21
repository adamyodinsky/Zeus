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
            request: [Number],
            limit: [Number]
          },
          memory: {
            request: [Number],
            limit: [Number]
          }
        },
      date: {
        type: Date,
        required: true
      },
      expirationDate: {
        type: Date,
        expires: 0,
        default: Date.now() + 1000 * 60 * config.SAVE_DOC_MIN
      }
    },
    {strict: false}
);

const nodeRequestModelName = config.NODES_REQUEST_MODEL_NAME;
const NodeRequest = mongoose.model(nodeRequestModelName, NodeRequestSchema);

module.exports = {nodeRequestModelName, NodeRequestSchema, NodeRequest};
