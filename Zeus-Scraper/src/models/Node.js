const mongoose = require("mongoose");
const config = require("../config/config");

const NodeSchema = new mongoose.Schema(
  {
    node_name: {
      type: String,
      required: true
    },
    cluster: {
      type: String,
      required: true,
      default: config.CLUSTER
    },
    role: {
        type: String
    },
    uid: {
      type: String,
      required: true
    },
    updates_counter: {
      type: Number,
      required: true,
      default: 0
    },
    last_update: {
      type: Date
    },
    created: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expirationDate: {
      type: Date,
      // TODO - uncomment in prod
      // expires: 0,
      // default: Date.now() + 1000 * 60 * 15 // 15 minutes
    },
    replicas: {
      type: Number,
      required: true
    },
    containers: [
      {
        container_name: String,
        resources: {
          txt: Object,
          num: Object,
          sum: Object
        },
        usage_samples: [
          {
            date: Date,
            txt: {
              memory: String,
              cpu: String
            },
            sum: {
              memory: Number,
              cpu: Number
            },
            avg: {
              memory: Number,
              cpu: Number
            }
          }
        ]
      }
    ]
  },
  { strict: false }
);

const nodeModelName = "node";
const Node = mongoose.model(nodeModelName, NodeSchema);

module.exports = { nodeModelName, NodeSchema, Node };
