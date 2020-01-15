const { exec } = require('../helpers/exec');
const fs = require('fs');
const config = require('../config/config');
const logger = require('./logger');

const saveStateToS3 = async(state) => {
  logger.info("Saving To State File in S3...");
  try {
    fs.writeFileSync(config.STATE_FILE_PATH ,JSON.stringify(state, null, 4));
    await exec(`aws --profile=zooz-dev s3  cp ${config.STATE_FILE_PATH}  s3://${config.S3_BUCKET}/${config.STATE_FILE_NAME}`);
    logger.info('Saved state file successfully!');
  } catch (e) {
    logger.error(e.message);
  }
};

module.exports = { saveStateToS3 };
