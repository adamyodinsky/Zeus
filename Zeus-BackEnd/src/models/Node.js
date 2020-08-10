const mongoose = require("mongoose");
const config = require("../config/config");

const NodeSchema = new mongoose.Schema({
        name: String,
        roles: [String],
        addresses: Array,
        cluster: String,
        updates_counter: Number,
        last_update: Date,
        created: Date,
        expirationDate: Date
    },
    {strict: false}
);

const nodeModelName = config.nodeModelName;
const Node = mongoose.model(nodeModelName, NodeSchema);

module.exports = {nodeModelName, NodeSchema, Node};

