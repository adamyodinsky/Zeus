const logger = require('../helpers/logger');
const config = require('../config/config');
const fs = require('fs');
const { exec } = require('../helpers/exec');


const getState = async(req, res) => {
  try {
    const state = JSON.parse(fs.readFileSync(config.STATE_FILE_PATH));
    res.status(200).json(state);
    logger.info('get state controller success');
  } catch (e) {
    logger.error(e.message)
  }
};


const health = async(req, res) => {
  try {
    res.status(200).json("OK");
    logger.info('OK');
  } catch (e) {
    logger.error(e.message)
  }
};


const downloadFromS3 = async() => {
  logger.info(`- Loading State File: '${config.STATE_FILE_NAME}' From S3 Bucket...`);

  try {
    await exec(
        `aws  --profile=zooz-dev s3 ls s3://${config.S3_BUCKET}/${config.STATE_FILE_NAME}`,
        true);
    await exec(
        `aws  --profile=zooz-dev s3 cp s3://${config.S3_BUCKET}/${config.STATE_FILE_NAME} ${config.STATE_FILE_PATH}`,
        true);
    console.log('Loaded state file successfully!');
  } catch (e) {
    console.log('Could not load state file from s3 bucket. Creating new local state file');
    await exec(`echo '[]' > ${config.STATE_FILE_PATH}`);
  }
};

const downloadFromS3Interval = () => {
  downloadFromS3();
  setInterval(downloadFromS3, 1000*30);
};


module.exports = { health, getState, downloadFromS3Interval };
