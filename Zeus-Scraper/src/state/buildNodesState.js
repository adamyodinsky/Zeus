const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const config = require("../config/config");
const _ = require('lodash/array');


const parseResources = (nodeLines, i) => {

    // create resource Array
    const resourceArray = [];
    while(!nodeLines[i].match(/^Events:/)) {
        resourceArray.push(nodeLines[i]);
        i++;
    }

    console.log(resourceArray);

    let cpu = resourceArray.filter(line => line.match(/cpu/));
    cpu = _.compact(cpu[0].split(/\s+/));
    let cpuRequest = [cpu[1], cpu[2]];
    let cpuLimits  = [cpu[3], cpu[4] ];
    console.log(cpuRequest, cpuLimits);

    let memory = resourceArray.filter(line => line.match(/memory/));
    memory = _.compact(memory[0].split(/\s+/));
    let memRequest = [memory[1], memory[2]];
    let memLimits  = [memory[3], memory[4] ];
    console.log(memRequest, memLimits);
    // TODO put mem and cpu in mongo collection
};

const parseNode = (node) => {
        const nodeLines = node.split(/\n/);

        // Get Name
        let Name = nodeLines.filter(line => line.match(/^Name:/));
        Name = Name[0].split(/\s+/)[1];
        console.log(Name);
        // TODO - put name in mongo collection

        // Get Roles
        let Roles = nodeLines.filter(line => line.match(/^Roles:/));
        Roles = Roles[0].split(/\s+/)[1];
        console.log(Roles);
        // TODO - put roles in mongo collection

        // parse resources allocation
        for (let i=0; i<nodeLines.length; i++) {
            if (nodeLines[i].match(/Allocated resources:/)) {
                parseResources(nodeLines, i);
            }
        }

};

const parseNodes = (nodeArray) => {
    for(let node of nodeArray) {
        parseNode(node);
    }
};

const fetchNodesArray = async() => {
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



const mainNodesState = async() => {
    const nodeArray = await fetchNodesArray();
    parseNodes(nodeArray);
};


mainNodesState().catch((e) =>{
    console.log(e.stack);
    process.exit(1);
});