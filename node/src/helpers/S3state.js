const { exec } = require('../helpers/exec');
const fs = require('fs');
const config = require('../config/config');

const saveStateToS3 = async(state) => {
  console.log("\n- Saving To State File in S3...");
  fs.writeFileSync(config.STATE_FILE_PATH ,JSON.stringify(state, null, 4));
  await exec(`aws s3  cp ${config.STATE_FILE_PATH}  s3://${config.S3_BUCKET}/${config.STATE_FILE_NAME}`);
  console.log('  Saved state file successfully!')
};

module.exports = { getStateFromS3, saveStateToS3 };
