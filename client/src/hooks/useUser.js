import { useState } from "react";

import useError from "./useError";
import useLoading from "./useLoading";

import ServerError from "../models/error/ServerError";
import { createUser, getUser } from "../service/userService";

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

	const saveUser = (user, token) => {
		const userWithToken = {
			...user,
			token,
		};
		setUser(userWithToken);
	};

	const handleApiErrors = (error) => {
		if (error instanceof ServerError) {
			return updateError("There was an error with the server");
		}
		throw error;
	};

	const logout = () => {
		setUser(null);
	};

	return [isLoading, error, user, fetchUser, login, register, logout];
};

export default useUser;