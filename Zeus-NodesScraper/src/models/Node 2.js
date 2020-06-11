const mongoose = require("mongoose");
const config = require("../config/config");

const ClusterSchema = new mongoose.Schema(
    {
        cluster: {
            type: String,
            required: true,
            default: config.CLUSTER
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
const Node = mongoose.model(nodeModelName, ClusterSchema);

module.exports = {nodeModelName, NodeSchema: ClusterSchema, Node};

