
const convertToNumber = (str) => {
  return Number(str.replace(/\D/g, ""));
};

const computeCapacity = (resourceArr) => {
  let usageValue = resourceArr[0];
  let usagePercent = resourceArr[1];
  return Math.ceil(usageValue * (100 / usagePercent));
};

const normalizeData = (resourceValue, dataType) => {
  let result = convertToNumber(resourceValue);

  if (dataType === 'memory') {
    if (resourceValue.includes('Ki')) {
      result = Math.ceil(result / Math.pow(2, 10));
    } else {
      result = Math.ceil(result / Math.pow(2, 20));
    }
  }

  return result;
};


module.exports = {convertToNumber, computeCapacity, normalizeData};
