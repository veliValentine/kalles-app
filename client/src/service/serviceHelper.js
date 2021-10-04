import BadRequestError from '../models/errors/badRequestError';
import NotFoundError from '../models/errors/notFoundError';
import ServerError from '../models/errors/serverError';

export const HTTP_OK = 200;

export const HTTP_CREATED = 201;

export const HTTP_NO_CONTENT = 204;

const HTTP_BAD_REQUEST = 400;

const HTT_NOT_FOUND = 404;

export const throwInvalidresponse = (response, status = HTTP_OK) => {
	const { status: responseStatus } = response;
	if (responseStatus !== status) {
		const ERROR_MESSAGE = 'There was an error with the server';
		if (responseStatus === HTTP_BAD_REQUEST) throw new BadRequestError(ERROR_MESSAGE);
		if (response === HTT_NOT_FOUND) throw new NotFoundError(ERROR_MESSAGE);
		throw new Error(`Server responded with status: ${responseStatus}`);
	}
};

export const postJsonOption = (requestBody) => ({
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(requestBody)
});

export const deleteJsonOption = () => ({
	method: 'DELETE'
});

export const handleServerError = (error, jsonResponse) => {
	if (error instanceof ServerError) {
		throw error;
	}
	if (error instanceof Error) {
		throw new Error(`message: ${error.message} serverMessage: ${jsonResponse.error}`);
	}
	throw new Error(jsonResponse.error);
};
