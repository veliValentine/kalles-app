import StorageService from "./storageService";

const storage = StorageService("refreshToken");

const RefreshTokenStorage = () => {
	const getToken = async () => await storage.getItem();

	const saveToken = async (token) => {
		await storage.saveItem(token);
	};

	const removeToken = async () => {
		await storage.removeItem();
	};

	return {
		getToken,
		saveToken,
		removeToken,
	};
};

export default RefreshTokenStorage;