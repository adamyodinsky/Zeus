const { CurrentUsage, modelName } = require("../models/CurrentUsage");
const CurrentUsageModel = require("mongoose").model(modelName);

const logger = require("../helpers/logger");
const config = require("../config/config");

const saveCurrentUsageObject = async curr_usage => {
  let count;
  try {
    const newUsageObject = new CurrentUsage({ ...curr_usage });
    let exist = await CurrentUsage.findOne({ pod_name: curr_usage.pod_name });
    if (!exist) {
      count = await newUsageObject.save();
    } else {
      count = await CurrentUsageModel.updateOne(
        { pod_name: curr_usage.pod_name },
        {
          ...curr_usage,
          updates_counter: exist.updates_counter + 1,
          expirationDate: Date.now() + 1000 * 120
        },
        { new: true }
      );
    }
    logger.debug("Stored new Object in DB", null);
  } catch (err) {
    logger.error(err.message);
  }
  return count.nModified;
};

module.exports = { saveCurrentUsageObject };
