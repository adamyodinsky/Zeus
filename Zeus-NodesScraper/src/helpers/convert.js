
const convertToNumber = (str) => {
  return Number(str.replace(/\D/g, ""));
};

const computeCapacity = (resourceArr) => {
  let usageValue = convertToNumber(resourceArr[0]);
  let usagePercent = convertToNumber(resourceArr[1]);
  return Math.ceil(usageValue * (100 / usagePercent));
};


module.exports = {convertToNumber, computeCapacity};
