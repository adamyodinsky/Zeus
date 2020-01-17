const {
  CurrentUsage,
  modelName
} = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(modelName);

const logger = require("../helpers/logger");
const config = require("../config/config");

const saveCurrentUsageObject = async curr_usage => {
  let count;
  try {
    const newUsageObject = new CurrentUsage({ ...curr_usage });
    let exist = await CurrentUsage.findOne({ hash: curr_usage.hash });
    if (!exist) {
      count = await newUsageObject.save();
    } else {
      count = await CurrentUsageModel.updateOne(
        { hash: curr_usage.hash },
        { ...curr_usage, expirationDate: (Date.now() + 1000*60) },
        { new: true }
      );
    }

    logger.info(`Stored new Object in DB`);
  } catch (err) {
    logger.error(err.message);
  }
  return count.nModified;
};

module.exports = { saveCurrentUsageObject };
