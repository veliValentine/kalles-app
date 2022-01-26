import StorageService from "./storageService";

const storage = StorageService("userUid");

const UserUidStorage = () => {
	const getUserUid = async () => await storage.getItem();

	const saveUserUid = async (userUid) => {
		await storage.saveItem(userUid);
	};

	const removeUserUid = async () => {
		await storage.removeItem();
	};

	return {
		getUserUid,
		saveUserUid,
		removeUserUid,
	};
};

export default UserUidStorage;