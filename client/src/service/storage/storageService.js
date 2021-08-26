import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  constructor(namespace = 'kalle-studio') {
    this.namespace = namespace;
  }

  async getStorage(item = throwError()) {
    const rawItem = await AsyncStorage.getItem(`${this.namespace}:${item}`);
    return JSON.parse(rawItem);
  }

  async saveItem(item = throwError(), object = throwError('Required object to save')) {
    await AsyncStorage.setItem(`${this.namespace}:${item}`, JSON.stringify(object));
  }

  async clearStorage(item = throwError()) {
    await AsyncStorage.removeItem(`${this.namespace}:${item}`);
  }
}

const throwError = (message = 'No item given') => { throw new Error(message); };

export default StorageService;
