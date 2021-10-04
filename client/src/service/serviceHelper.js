import ServerError from '../utils/ServerError';

export const HTTP_OK = 200;

export const HTTP_CREATED = 201;

export const HTTP_NO_CONTENT = 204;

export const throwInvalidresponse = (response, status = HTTP_OK) => {
	const { status: responseStatus } = response;
	console.log(`ServerStatus: ${responseStatus} wantedStatus: ${status}`)
	if (responseStatus !== status) {
		console.log('throwing server error')
		throw new ServerError(responseStatus);
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
	if (error instanceof ServerError) throw error;
	if (error instanceof Error) {
		throw new Error(`message: ${error.message} serverMessage: ${jsonResponse.error}`);
	}
	throw new Error(jsonResponse.error);
};
