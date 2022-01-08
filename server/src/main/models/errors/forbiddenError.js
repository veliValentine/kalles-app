const RestError = require("./restError");

class ForbiddenError extends RestError {
	constructor(message = "") {
		super(403, `Forbidden! ${message}`);
		this.name = "ForbiddenError";
	}
}

module.exports = ForbiddenError;
