// const MongoClient = require('mongodb').MongoClient;
// const config   = require('./config');
// const logger   = require('../helpers/logger');
//
// const connectMongoDB = async() => {
//   // Connection URL
//   let db;
//   const url = 'mongodb://localhost:27017';
//   // Database Name
//   const dbName = 'admin';
//   const client = new MongoClient(url, { useNewUrlParser: true });
//
//   try {
//     // Use connect method to connect to the Server
//     await client.connect();
//
//     db = client.db(dbName);
//   } catch (err) {
//     logger.error(err.stack);
//   }
//
//   return db;
// };
//
// module.exports = { connectMongoDB };
