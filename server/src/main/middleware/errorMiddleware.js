const { CastError, ValidationError } = require("mongoose").Error;
const RestError = require("../models/errors/restError");
const logger = require("../utils/logger");

const errorMiddleware = (error, _req, res, next) => {
	logger.errorConsole(error);

	if (error instanceof RestError) {
		return handleRestErrors(res, error);
	}
	if (error instanceof CastError) {
		return badRequest(res, error);
	}
	if (error instanceof ValidationError) {
		return badRequest(res, error);
	}
	return next(error);
};

const handleRestErrors = (res, error) => {
	throwWrongErrorType(error, RestError);
	return res.status(error.status).json({ error: error.message });
};

const badRequest = (res, error) => res.status(400).json({ error: error.message });

const throwWrongErrorType = (error, type) => {
	const isNotErrorType = !(error instanceof type);
	if (isNotErrorType) {
		throw error;
	}
};

module.exports = errorMiddleware;
