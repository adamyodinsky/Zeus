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
        node: {
            type: Object,
            required: true
        },
        addresses: {
            type: Array,
            required: true
        },
        usage: [
            {
                name: String,
                cpu: [String],
                mem: [String],
                date: Date
            }
        ]
        ,
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
        }
    },
    {strict: false}
);

const nodeModelName = "node";
const Node = mongoose.model(nodeModelName, NodeSchema);

module.exports = {nodeModelName, NodeSchema, Node};
