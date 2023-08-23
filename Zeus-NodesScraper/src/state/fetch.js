const { exec } = require("../helpers/exec");
const logger = require("../helpers/logger");
const _ = require("lodash/array");
const k8s = require("@kubernetes/client-node");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const fetchNodesUsage = async () => {
  let date;
  let nodesUsageArray = [];
  let command = "kubectl top nodes";

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
    date: date,
  };
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
      date: date,
    };
    logger.info(`Fetched ${nodesArray.arr.length} Nodes Data`);
  } catch (err) {
    logger.error(err.stack);
  }

  return nodesArray;
};

const fetchNodesArray2 = async () => {
  k8sApi.listNode().then((res) => {
    console.log(res.body);
  });

  let date;
  let command = `kubectl describe nodes`;
  let nodesArray = [];

  try {
    nodesArray = await exec(command);
    date = Date.now();
    nodesArray = nodesArray.stdout.split(/\n\s*\n/);
    nodesArray = {
      arr: nodesArray,
      date: date,
    };
    logger.info(`Fetched ${nodesArray.arr.length} Nodes Data`);
  } catch (err) {
    logger.error(err.stack);
  }

  return nodesArray;
};

module.exports = { fetchNodesArray, fetchNodesUsage };
