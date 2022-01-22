import instance from "../service/instance/apiInstance";
import { apiError, getDefaultOptions, throwUndefined } from "./serviceHelper";

const USERS_API = "/users";

export const getUser = async (token = throwUndefined(), id = throwUndefined()) => {
	try {
		const options = getDefaultOptions(token);
		const { data } = await instance.get(`${USERS_API}/${id}`, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};

export const createUser = async (token = throwUndefined(), id = throwUndefined(), username = throwUndefined()) => {
	try {
		const body = {
			id,
			username
		};
		const options = getDefaultOptions(token);
		const { data } = await instance.post(`${USERS_API}`, body, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};

export const getUsersMessages = async (token = throwUndefined(), id = throwUndefined()) => {
	try {
		const options = getDefaultOptions(token);
		const { data } = await instance.get(`${USERS_API}/${id}/messages`, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};

export const getUsersLikedMessages = async (token = throwUndefined(), id = throwUndefined()) => {
	try {
		const options = getDefaultOptions(token);
		const { data } = await instance.get(`${USERS_API}/${id}/liked`, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};
