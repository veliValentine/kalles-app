const logger = require('./logger');

const handleError = (error, message = '') => {
  if (message) {
    logger.errorConsole(message);
  }
  if (error instanceof Error) {
    logger.errorConsole(error.message);
  } else {
    throw error;
  }
};

module.exports = {
  handleError,
};
