import { useEffect, useState } from "react";

import useError from "./useError";
import useLoading from "./useLoading";

import { clearUserStorageData, createUser, getUser, getUserInfoFromStorage } from "../service/userService";
import { handleApiErrors } from "../utils/errors";

const useUser = () => {
	const [user, setUser] = useState();
	const [isLoading, startLoading, stopLoading] = useLoading();
	const [error, updateError] = useError();

	useEffect(() => {
		const timeOutId = setTimeout(setUserFromStorage);
		return () => clearTimeout(timeOutId);
	}, []);

	const setUserFromStorage = async () => {
		const userData = await getUserInfoFromStorage();
		if (userData) {
			await login(userData);
		}
	};

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

	const register = async ({ uid, accessToken, username }) => {
		startLoading();
		try {
			const user = await createUser(accessToken, uid, username);
			saveUser(user, accessToken);
		} catch (error) {
			handleApiErrors(error, updateError);
		}
		stopLoading();
	};

	const logout = async () => {
		await clearUserStorageData();
		setUser(null);
	};

	const getUserFromServer = async (uid, accessToken) => {
		try {
			const user = await getUser(accessToken, uid);
			saveUser(user, accessToken);
		} catch (error) {
			handleApiErrors(error, updateError);
		}
	};

	const saveUser = (user, token) => {
		const userWithToken = {
			...user,
			token,
		};
		setUser(userWithToken);
	};

	return [isLoading, error, user, fetchUser, login, register, logout];
};

export default useUser;