import { apiError, getDefaultOptions, throwUndefined } from "./serviceHelper";
import { parseLocation } from "../utils";

const MESSAGES_API = "/messages";

import instance from "../service/instance/apiInstance";

export const getMessages = async (token, location = throwUndefined()) => {
	try {
		const options = getDefaultOptions(token);
		const locationParams = coordinateQueryParams(location);
		const { data } = await instance.get(`${MESSAGES_API}/?${locationParams}`, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};

export const addMessage = async (token, message) => {
	try {
		const options = getDefaultOptions(token);
		const { data } = await instance.post(`${MESSAGES_API}`, message, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};

export const likeMessage = async (token, id, location) => {
	try {
		const options = getDefaultOptions(token);
		const locationParams = coordinateQueryParams(location);
		const { data } = await instance.post(`${MESSAGES_API}/${id}/like?${locationParams}`, null, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};

export const deleteMessage = async (token, id) => {
	try {
		const options = getDefaultOptions(token);
		await instance.delete(`${MESSAGES_API}/${id}`, options);
	} catch (error) {
		apiError(error);
	}
};

const coordinateQueryParams = (location) => {
	const { latitude, longitude } = parseLocation(location);
	return `latitude=${latitude}&longitude=${longitude}`;
};
