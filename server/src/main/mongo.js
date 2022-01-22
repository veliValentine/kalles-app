const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const { handleError } = require("./utils/errorHandler");

const logger = require("./utils/logger");

logger.logConsole(`Connecting to MongoDB - ${MONGODB_URI}`);

const connected = () => {
	logger.logConsole("Connected to MongoDB");
};

const notConnected = (error) => handleError(error, "Error connecting to MongoDB");

mongoose.connect(MONGODB_URI)
	.then(connected)
	.catch(notConnected);
