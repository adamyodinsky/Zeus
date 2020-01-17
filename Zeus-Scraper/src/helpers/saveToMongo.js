const {
  CurrentUsage,
  CurrentUsageSchema,
  modelName
} = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(modelName);

const logger = require("../helpers/logger");
const config = require("../config/config");

const saveCurrentUsageObject = async curr_usage => {
  try {
    const newUsageObject = new CurrentUsage({ ...curr_usage });
    let exist = await CurrentUsage.findOne({ hash: curr_usage.hash });
    if (!exist) {
      await newUsageObject.save();
    } else {
      await CurrentUsageModel.updateOne(
        { hash: curr_usage.hash },
        { ...curr_usage, expirationDate: (Date.now() + 1000*60) },
        { new: true }
      );
    }

    logger.info(`Stored new Object in DB`);
    return 1;
  } catch (err) {
    logger.error(err.message);
    return 0;
  }
};

module.exports = { saveCurrentUsageObject };
