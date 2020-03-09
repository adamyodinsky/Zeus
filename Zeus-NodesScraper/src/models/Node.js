const mongoose = require("mongoose");
const config = require("../config/config");

const NodeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        roles: {
            type: [String],
            required: true
        },
        addresses: {
            type: Array,
            required: true
        },
        cluster: {
            type: String,
            required: true,
            default: config.CLUSTER
        },
        updates_counter: {
            type: Number,
            required: true,
            default: 0
        },
        last_update: {
            type: Date
        },
        expirationDate: {
            type: Date,
            expires: 0,
            default: Date.now() + 1000 * 60 * config.SAVE_DOC_MIN
        }
    },
    {strict: false}
);

const nodeModelName = config.nodeModelName;
const Node = mongoose.model(nodeModelName, NodeSchema);

module.exports = {nodeModelName, NodeSchema, Node};

