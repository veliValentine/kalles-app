/* eslint-disable no-console */
const { isTestEnvironment } = require('./environment');
const { timeStamp } = require('./time');

const logger = () => {
  const logConsole = (message) => {
    if (!isTestEnvironment) {
      console.log(message);
    }
  };

  const errorConsole = (message) => {
    if (!isTestEnvironment) {
      console.error(`ERROR - ${timeStamp()} - ${message}`);
    }
  };

  return {
    logConsole,
    errorConsole,
  };
};

module.exports = logger();
