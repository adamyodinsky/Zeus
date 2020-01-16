const config = require('./config');

// Set up a whitelist and check against it:
const whitelist = [
  `http://${config.frontEndHost}:${config.frontEndPort}`
];

// set up cors options
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

module.exports = corsOptions;
