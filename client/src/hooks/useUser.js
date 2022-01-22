import { useState } from "react";

import useError from "./useError";
import useLoading from "./useLoading";

import ServerError from "../models/error/ServerError";
import { createUser, getUser, getUsersMessages, getUsersLikedMessages } from "../service/userService";

const useUser = () => {
	const [user, setUser] = useState(null);
	const [isLoading, startLoading, stopLoading] = useLoading();
	const [error, updateError] = useError();

	const fetchUser = async () => {
		if (user && user.id && user.token) {
			startLoading();
			await getUserFromServer(user.id, user.token);
			stopLoading();
		}
	};

	const login = async ({ uid, accessToken }) => {
		startLoading();
		await getUserFromServer(uid, accessToken);
		stopLoading();
	};

	const getUserFromServer = async (uid, accessToken) => {
		try {
			const user = await getUser(accessToken, uid);
			saveUser(user, accessToken);
		} catch (error) {
			handleApiErrors(error);
		}
	};

	const register = async ({ uid, accessToken, username }) => {
		startLoading();
		try {
			const user = await createUser(accessToken, uid, username);
			saveUser(user, accessToken);
		} catch (error) {
			handleApiErrors(error);
		}

		stopLoading();
	};

	const logout = () => {
		setUser(null);
	};

	const getUsersMessagesFromServer = async () => {
		if (isLoggedUser()) {
			try {
				return await getUsersMessages(user.token, user.id);
			} catch (error) {
				handleApiErrors(error);
			}
		}
	};

	const getLikedMessagesFromServer = async () => {
		if (isLoggedUser()) {
			try {
				return await getUsersLikedMessages(user.token, user.id);
			} catch (error) {
				handleApiErrors(error);
			}
		}
	};

	const saveUser = (user, token) => {
		const userWithToken = {
			...user,
			token,
		};
		setUser(userWithToken);
	};

	const isLoggedUser = () => user && user.id && user.token;

	const handleApiErrors = (error) => {
		if (error instanceof ServerError) {
			return updateError("There was an error with the server");
		}
		throw error;
	};

	return [isLoading, error, user, fetchUser, login, register, logout, getUsersMessagesFromServer, getLikedMessagesFromServer];
};

export default useUser;