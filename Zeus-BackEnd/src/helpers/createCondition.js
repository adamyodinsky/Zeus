const config = require('../config/config');
const logger = require('./logger');

const createConditions = (regex, fields, options) => {
  const conditions= [];

  for(let field of fields) {
    conditions.push(
    {
      [field]: {
        $regex: regex,
            '$options': options
      }
    });
}
  return ({'$or': conditions});
};

module.exports = { createConditions };
