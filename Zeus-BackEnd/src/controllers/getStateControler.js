const logger = require('../helpers/logger');
const config = require('../config/config');


const getState = async(req, res) => {
  try {

    res.status(200).json("OK");
    logger.info('get state controller success');
  } catch (e) {
    logger.error(e.message)
  }
};


module.exports = { getState };
