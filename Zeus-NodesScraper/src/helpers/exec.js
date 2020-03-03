const exec_sh = require("exec-sh").promise;
const config = require('../config/config');

const exec = async (command) => {
  let result;

  if(config.DEBUG) {
    console.log(`${command}`);
  }

  result = await exec_sh(`${command}`, true);

  if(result.stderr) {
    let err = new Error();
    err.stderr = result.stderr;
    throw err;
  }

  return result;
};

module.exports = { exec };
