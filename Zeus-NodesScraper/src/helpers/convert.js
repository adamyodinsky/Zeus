
const convertToNumber = (str) => {
  return Number(str.replace(/\D/g, ""));
};

module.exports = {convertToNumber};
