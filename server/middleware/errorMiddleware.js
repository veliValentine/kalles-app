const BadRequestError = require('../models/errors/badRequestError');
const NotFoundError = require('../models/errors/notFoundError');
const RestError = require('../models/errors/restError');
const logger = require('../utils/logger');

const errorMiddleware = (error, req, res, next) => {
  logger.errorConsole(error);

  if (error instanceof BadRequestError) {
    return handleRestErrors(res, error);
  }
  if (error instanceof NotFoundError) {
    return handleRestErrors(res, error);
  }
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