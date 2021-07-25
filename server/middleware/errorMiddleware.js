const RestError = require('../models/errors/restError');
const logger = require('../utils/logger');

const errorMiddleware = (error, _req, res, next) => {
  logger.errorConsole(error);

  if (error instanceof RestError) {
    return handleRestErrors(res, error);
  }
  return next(error); 
};

const handleRestErrors = (res, error) => {
  const isNotRestError = !(error instanceof RestError);
  if (isNotRestError) throw error;
  return res.status(error.status).json({ error: error.message });
};

module.exports = errorMiddleware;
