const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');

const logger = require('./utils/logger');

logger.logConsole(`Connecting to MongoDB - ${MONGODB_URI}`);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connected = () => {
  logger.logConsole('Connected to MongoDB');
};

const notConnected = (error) => {
  logger.errorConsole('Error connecting to MongoDB');
  if (error instanceof Error) {
    logger.errorConsole(error.message);
  } else {
    throw error;
  }
};

mongoose.connect(MONGODB_URI, options)
  .then(connected)
  .catch(notConnected);
