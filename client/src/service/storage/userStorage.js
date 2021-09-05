import StorageService from './storageService';
import validateUser from '../../utils/validators';

const storage = StorageService('user');

const UserStorage = () => {
	const getUser = async () => {
		const user = await storage.getItem();
		return user;
	};

	const saveUser = async (user) => {
		validateUser(user);
		await storage.saveItem(user);
	};

	const removeUser = async () => {
		await storage.removeItem();
	};

	return {
		getUser,
		saveUser,
		removeUser,
	};
};

export default UserStorage;