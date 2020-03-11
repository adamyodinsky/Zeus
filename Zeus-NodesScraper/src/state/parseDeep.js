const _ = require('lodash/array');
const {parsePodsResources, parseNodeResources} = require('./parseResources');

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
    i++;
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
    i++;
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

  const NodeRequest = parseNodeResources(resourceArray, date);

  return [NodeRequest, Pods, Addresses];

};

module.exports = {parseAddresses, parseDeep};
