const mongoose = require('mongoose');
const config   = require('./config');
const logger   = require('../helpers/logger');

const connectDB = async () => {
  // remove deprecation warnings
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("MongoDB Connected...")
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB ;


//deprecation solution:
//---------------------
// Replace update() with updateOne(), updateMany(), or replaceOne()
// Replace remove() with deleteOne() or deleteMany().
// Replace count() with countDocuments(),
// unless you want to count how many documents are in the whole collection (no filter).
// In the latter case, use estimatedDocumentCount().
