const RestError = require("./restError");

class UnauthorizedError extends RestError {
	constructor(message = "") {
		super(401, `Unauthorized! ${message}`);
		this.name = "UnauthorizedRequestError";
	}
}

module.exports = UnauthorizedError;
