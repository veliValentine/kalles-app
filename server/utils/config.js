const { isTestEnvironment, isDevelopmentEnvironment } = require("./environment");

require("dotenv").config();

const { PORT } = process.env;

let MONGODB_URI = process.env.MONGO_MESSAGES_URI;
if (isTestEnvironment) {
	MONGODB_URI = process.env.MONGO_MESSAGES_TEST_URI;
}
if (isDevelopmentEnvironment) {
	MONGODB_URI = process.env.MONGO_MESSAGES_DEV_URI;
}

module.exports = {
	PORT,
	MONGODB_URI,
};
