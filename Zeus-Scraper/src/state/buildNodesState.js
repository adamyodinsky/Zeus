const {exec} = require("../helpers/exec");
const logger = require("../helpers/logger");
const config = require("../config/config");
const _ = require('lodash/array');
const {saveNode, saveNodeUsage} = require("../helpers/saveToMongo");

const parsePodsResources = (resourceArray) => {
    const pods = [];

    for (let i = 3; i < resourceArray.length; i++) {
        const podLineArray = _.compact(resourceArray[i].split(/\s+/));
        let pod = {
            namespace: podLineArray[0],
            name: podLineArray[1],
            cpu: {
                request: [podLineArray[2], podLineArray[3]],
                limit: [podLineArray[4], podLineArray[5]]
            },
            mem: {
                request: [podLineArray[6], podLineArray[7]],
                limit: [podLineArray[8], podLineArray[9]],
            },
            age: podLineArray[10]
        };
        pods.push(pod);
    }
    return pods;
};

const parseNodeResources = (resourceArray) => {

    let cpu = resourceArray.filter(line => line.match(/cpu/));
    cpu = _.compact(cpu[0].split(/\s+/));
    let cpuRequest = [cpu[1], cpu[2]];
    let cpuLimits = [cpu[3], cpu[4]];

    let memory = resourceArray.filter(line => line.match(/memory/));
    memory = _.compact(memory[0].split(/\s+/));
    let memRequest = [memory[1], memory[2]];
    let memLimits = [memory[3], memory[4]];


    return {
        cpu: {
            request: cpuRequest,
            limit: cpuLimits
        },
        mem: {
            request: memRequest,
            limit: memLimits
        }
    };

};

const parseAddresses = (addressesArray) => {
    let addressesObjArray = [];

    for (let i = 1; i < addressesArray.length; i++) {
        addressesObjArray.push(_.compact(addressesArray[i].split(/\s+/)));
    }

    return addressesObjArray;
};

const parseDeep = (nodeLines) => {
    let i = 0;

    // ### PARSE ADDRESS ###
    // reset array and skip
    let resourceArray = [];
    while (!nodeLines[i].match(/^Addresses:/)) {
        i++
    }
    // fill array with relevant content
    while (!nodeLines[i].match(/^Capacity:/)) {
        resourceArray.push(nodeLines[i]);
        i++;
    }

    // parse relevant content
    const Addresses = parseAddresses(resourceArray);

    // ### PARSE PODS RESOURCES ###
    // reset array and skip
    resourceArray = [];
    while (!nodeLines[i].match(/^Non-terminated Pods:/)) {
        i++
    }
    // fill array with relevant content
    while (!nodeLines[i].match(/^Allocated resources:/)) {
        resourceArray.push(nodeLines[i]);
        i++;
    }
    // parse relevant content
    const Pods = parsePodsResources(resourceArray);

    // ### PARSE NODE RESOURCES ###
    // reset array, no need to skip
    resourceArray = [];
    while (!nodeLines[i].match(/^Events:/)) {
        resourceArray.push(nodeLines[i]);
        i++;
    }

    const Node = parseNodeResources(resourceArray);

    return [Node, Pods, Addresses]

};


const parseNode = (node) => {
    let nodeObject;
    const nodeLines = node.split(/\n/);

    // Get Name
    let Name = nodeLines.filter(line => line.match(/^Name:/));
    Name = Name[0].split(/\s+/)[1];

    // Get Roles
    let Roles = nodeLines.filter(line => line.match(/^Roles:/));
    Roles = Roles[0].split(/\s+/)[1];

    let objects = parseDeep(nodeLines);

    nodeObject = {
        name: Name,
        roles: Roles,
        node: objects[0],
        addresses: objects[2],
        pods: objects[1]
    };

    // console.log(JSON.stringify(nodeObject, null, 2));

    return nodeObject;
};

const parseNodes = (nodesArray) => {
    let nodeObject = {};
    for (let node of nodesArray) {
        try {
            nodeObject = parseNode(node);
            saveNode(nodeObject);
        } catch (e) {
            logger.error(e.message);
        }
    }
};

const deepParseNodeUsage = (node) => {
    const arrUsage = _.compact(node.split(/\s+/));

    return {
        name: arrUsage[0],
        cpu: [arrUsage[1], arrUsage[2]],
        mem: [arrUsage[3], arrUsage[4]],
        date: Date.now()
    }
};


const parseNodesUsage = (nodesUsageArray) => {
    let nodesUsageObj = {};
    for (let node of nodesUsageArray) {
        try {
            nodesUsageObj = deepParseNodeUsage(node);
            console.log(nodesUsageObj);
            saveNodeUsage(nodesUsageObj);
        } catch (e) {
            logger.error(e.message);
        }
    }
};

const fetchNodesUsage = async() => {
    let nodesUsageArray = [];
    let command = 'kubectl top nodes';

    try {
        nodesUsageArray = await exec(command);
        nodesUsageArray = _.compact(nodesUsageArray.stdout.split(/\n/));
        nodesUsageArray.shift();
        logger.info(`Fetched ${nodesUsageArray.length} Nodes Usage Data`);
    } catch (err) {
        logger.error(err.stack);
    }

    return nodesUsageArray;
};

const fetchNodesArray = async () => {
    let command = `kubectl describe nodes`;
    let nodesArray = [];

    try {
        nodesArray = await exec(command);
        nodesArray = nodesArray.stdout.split(/\n\s*\n/);
        logger.info(`Fetched ${nodesArray.length} Nodes Data`);
    } catch (err) {
        logger.error(err.stack);
    }
    return nodesArray;
};


const mainNodesStateBuilder = async () => {
    const nodesArray = await fetchNodesArray();
    const nodesUsageArray = await fetchNodesUsage();
    parseNodes(nodesArray);
    parseNodesUsage(nodesUsageArray);
};

//
// mainNodesStateBuilder().catch((e) => {
//     console.log(e.stack);
//     process.exit(1);
// });

module.exports = { mainNodesStateBuilder };