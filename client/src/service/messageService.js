import { HTTP_CREATED, throwInvalidresponse, postJsonOption, deleteJsonOption, HTTP_NO_CONTENT, handleServerError } from './serviceHelper';
import { parseLocation } from '../utils';
import { handleError } from '../utils/errors';
import { SERVER_URL_BASE } from '../utils/URL';

const MESSAGE_URL = `${SERVER_URL_BASE}/messages`;

export const fetchMessages = async (location) => {
	try {
		const URL = coordinateQueryURL(location);
		const response = await fetch(URL);
		throwInvalidresponse(response);
		const messages = await response.json();
		return messages;
	} catch (e) {
		handleError(e, 'Error handling server request');
		return [];
	}
};

const coordinateQueryURL = (location) => {
	const { latitude, longitude } = parseLocation(location, 'messageService.js');
	return `${MESSAGE_URL}?latitude=${latitude}&longitude=${longitude}`;
};

export const postMessage = async (message) => {
	let responseJSON;
	try {
		const response = await fetch(MESSAGE_URL, postJsonOption(message));
		responseJSON = await response.json();
		throwInvalidresponse(response, HTTP_CREATED);
		return responseJSON;
	} catch (e) {
		if (e instanceof Error) {
			throw new Error(`message: ${e.message} serverMessage: ${responseJSON.error}`);
		}
		throw new Error(responseJSON.error);
	}
};

export const postLike = async (messageId) => {
	let responseJson;
	try {
		const response = await fetch(`${MESSAGE_URL}/${messageId}/like`, postJsonOption());
		responseJson = await response.json();
		throwInvalidresponse(response);
		return responseJson.likes ? responseJson.likes : 1;
	} catch (error) {
		handleServerError(error, responseJson);
	}
};

export const deleteMessage = async (messageId) => {
	let response;
	try {
		response = await fetch(`${MESSAGE_URL}/${messageId}`, deleteJsonOption());
		throwInvalidresponse(response, HTTP_NO_CONTENT);
		return;
	} catch (error) {
		const responseJson = await response.json();
		handleServerError(error, responseJson);
	}
};
