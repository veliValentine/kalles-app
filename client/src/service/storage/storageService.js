import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageService = (item = throwError()) => {
	const nameSpace = `kalle-studio:${item}`;

	const getItem = async () => {
		const jsonValue = await AsyncStorage.getItem(nameSpace);
		return JSON.parse(jsonValue);
	};

	const saveItem = async (object = throwError('Nothing to')) => {
		const stringObject = JSON.stringify(object);
		await AsyncStorage.setItem(nameSpace, stringObject);
	};

	const removeItem = async () => {
		await AsyncStorage.removeItem(nameSpace);
	};

	return {
		getItem,
		saveItem,
		removeItem
	};
};

const throwError = (message = 'No item given') => { throw new Error(message); };

export default StorageService;
