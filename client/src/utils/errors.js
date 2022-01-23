import LocationError from "../models/error/LocationError";
import ServerError from "../models/error/ServerError";

export const handleError = (e, message = "no error hanler message given") => {
	console.log(message);
	if (e instanceof Error) {
		console.log(e.message);
		return e.message;
	}
	console.log("Error thrown");
	throw e;
};

export const handleApiErrors = (error, updateError) => {
	if (error instanceof ServerError) {
		return updateError("There was an error with the server");
	}
	if (error instanceof LocationError) {
		return updateError("There was an error with the location");
	}
	if (error instanceof Error) {
		console.log(JSON.stringify({
			error: error.name,
			message: error.message
		}));
	}
	updateError("An unexpected error happened!");
};
