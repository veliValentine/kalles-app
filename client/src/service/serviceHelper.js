import { getAuthHeader } from "./instance/apiInstance";

import LocationError from "../models/error/LocationError";
import ServerError from "../models/error/ServerError";

export const HTTP_OK = 200;

export const HTTP_CREATED = 201;

export const HTTP_NO_CONTENT = 204;

export const throwInvalidresponse = (response, status = HTTP_OK) => {
	const { status: responseStatus } = response;
	if (responseStatus !== status) {
		throw new ServerError(responseStatus);
	}
};

export const postJsonOption = (requestBody) => ({
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify(requestBody)
});

export const deleteJsonOption = () => ({
	method: "DELETE"
});

export const handleServerError = (error, jsonResponse) => {
	if (error instanceof ServerError) throw error;
	if (error instanceof Error) {
		throw new Error(`message: ${error.message} serverMessage: ${jsonResponse.error}`);
	}
	throw new Error(jsonResponse.error);
};

export const getDefaultOptions = (token) => ({
	headers: getAuthHeader(token),
});

export const apiError = (error) => {
	console.log("Api error");
	const errorObject = {
		message: error.message,
		status: error.response.status,
		body: error && error.response && error.response.data
	};
	console.log(JSON.stringify(errorObject));
	if (error instanceof LocationError) {
		throw new ServerError("There was an error with the location");
	}
	throw new ServerError("There was an error with the server");
};

export const throwUndefined = () => { throw new Error("Undefined"); };
