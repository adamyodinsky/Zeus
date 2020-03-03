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
            memory: {
                request: [podLineArray[6], podLineArray[7]],
                limit: [podLineArray[8], podLineArray[9]],
            },
            age: podLineArray[10]
        };
        pods.push(pod);
    }
    return pods;
};

const parseNodeResources = (resourceArray, date) => {

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
        memory: {
            request: memRequest,
            limit: memLimits
        },
        date: date
    };

};

const parseAddresses = (addressesArray) => {
    let addressesObjArray = [];

    for (let i = 1; i < addressesArray.length; i++) {
        addressesObjArray.push(_.compact(addressesArray[i].split(/\s+/)));
    }

    return addressesObjArray;
};

const parseDeep = (nodeLines, date) => {
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

    const Node = parseNodeResources(resourceArray, date);

    return [Node, Pods, Addresses];

};


const parseNode = (node, date) => {
    let nodeObject;
    const nodeLines = node.split(/\n/);

    // Get Name
    let Name = nodeLines.filter(line => line.match(/^Name:/));
    Name = Name[0].split(/\s+/)[1];

    // Get Roles
    let Roles = nodeLines.filter(line => line.match(/^Roles:/));
    Roles = Roles[0].split(/\s+/)[1];

    let objects = parseDeep(nodeLines, date);

    nodeObject = {
        name: Name,
        roles: Roles,
        node: [objects[0]],
        addresses: objects[2],
        pods: objects[1],
    };

    // console.log(JSON.stringify(nodeObject, null, 2));
    return nodeObject;
};

const parseNodes = (nodesArray) => {
    let nodeObject = {};
    for (let node of nodesArray.arr) {
        try {
            nodeObject = parseNode(node, nodesArray.date);
            saveNode(nodeObject);
        } catch (e) {
            logger.error(e.stack);
        }
    }
};

const deepParseNodeUsage = (node, date) => {
    const arrUsage = _.compact(node.split(/\s+/));

    return {
        name: arrUsage[0],
        cpu: [arrUsage[1], arrUsage[2]],
        memory: [arrUsage[3], arrUsage[4]],
        date: date
    }
};


const parseNodesUsage = (nodesUsageArray) => {
    let nodesUsageObj = {};
    for (let node of nodesUsageArray.arr) {
        try {
            nodesUsageObj = deepParseNodeUsage(node, nodesUsageArray.date);
            saveNodeUsage(nodesUsageObj);
        } catch (e) {
            logger.error(e.stack);
        }
    }
};

const fetchNodesUsage = async() => {
    let date;
    let nodesUsageArray = [];
    let command = 'kubectl top nodes';

    try {
        nodesUsageArray = await exec(command);
        date = Date.now();
        nodesUsageArray = _.compact(nodesUsageArray.stdout.split(/\n/));
        nodesUsageArray.shift();
        logger.info(`Fetched ${nodesUsageArray.length} Nodes Usage Data`);
    } catch (err) {
        logger.error(err.stack);
    }

    return {
        arr: nodesUsageArray,
        date: date
    }
};

const fetchNodesArray = async () => {
    let date;
    let command = `kubectl describe nodes`;
    let nodesArray = [];

    try {
        nodesArray = await exec(command);
        date = Date.now();
        nodesArray = nodesArray.stdout.split(/\n\s*\n/);
        nodesArray = {
            arr: nodesArray,
            date: date
        };
        logger.info(`Fetched ${nodesArray.arr.length} Nodes Data`);
    } catch (err) {
        logger.error(err.stack);
    }

    return nodesArray;
};


const mainNodesStateBuilder = async () => {
    logger.info("Nodes State Build Iteration Starting...");
    let startTime = Date.now();

    const nodesArray = await fetchNodesArray();
    parseNodes(nodesArray);
    const nodesUsageArray = await fetchNodesUsage();
    parseNodesUsage(nodesUsageArray);

    let interval =  (Date.now() - startTime) / 1000;
    logger.info("Nodes State Build Iteration Ended Successfully, Nodes modified:", nodesArray.arr.length);
    logger.info("Nodes Build Iteration Time:", interval + 's');
};


module.exports = { mainNodesStateBuilder };
