const { isTestEnvironment, isDevelopmentEnvironment } = require("./environment");

require("dotenv").config();

const DEFAULT_EXPIRES_TIME = 7 * 24 * 60 * 60;

const {
	PORT = 3001,
	TEST_USERNAME,
	TEST_PASSWORD,
	MESSAGE_EXPIRES_TIME_MINUTES = DEFAULT_EXPIRES_TIME,
	MONGO_TEST_URI,
	MONGO_DEV_URI,
} = process.env;

let MONGODB_URI = process.env.MONGO_URI;
if (isTestEnvironment) {
	MONGODB_URI = MONGO_TEST_URI;
}
if (isDevelopmentEnvironment) {
	MONGODB_URI = MONGO_DEV_URI;
}

module.exports = {
	PORT,
	MONGODB_URI,
	TEST_USERNAME,
	TEST_PASSWORD,
	MESSAGE_EXPIRES_TIME_MINUTES,
};
