class RestError extends Error {
	constructor(status = 500, message = "Server error") {
		super(message.trim());
		this.name = "RestError";
		this.status = status;
	}
}

module.exports = RestError;
