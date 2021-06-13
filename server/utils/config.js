const { isTestEnvironment } = require('./environment');

require('dotenv').config();

const { PORT } = process.env;

let MONGODB_URI = process.env.MONGO_MESSAGES_URI;
if (isTestEnvironment) {
  MONGODB_URI = process.env.MONGO_MESSAGES_TEST_URI;
}

module.exports = {
  PORT,
  MONGODB_URI,
};
