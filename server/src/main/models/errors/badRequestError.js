const RestError = require("./restError");

class BadRequestError extends RestError {
	constructor(message) {
		super(400, `Bad request: ${message}`);
		this.name = "BadRequestError";
	}
}

module.exports = BadRequestError;
