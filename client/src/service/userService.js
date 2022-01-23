import instance from "../service/instance/apiInstance";
import { refreshAccessToken } from "./firebaseService";
import { apiError, getDefaultOptions, throwUndefined } from "./serviceHelper";
import RefreshTokenStorage from "./storage/refreshTokenStorage";
import UserUidStorage from "./storage/userUidStorage";

const USERS_API = "/users";

const refreshTokenStorage = RefreshTokenStorage();
const userUidStorage = UserUidStorage();

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

export const getUserInfoFromStorage = async () => {
	const refreshToken = await refreshTokenStorage.getToken();
	const uid = await userUidStorage.getUserUid();
	if (!refreshToken || !uid) return;
	const accessToken = await refreshAccessToken(refreshToken);
	if (!accessToken) return;
	return { uid, accessToken };
};

export const clearUserStorageData = async () => {
	await refreshTokenStorage.removeToken();
	await userUidStorage.removeUserUid();
};
