import AsyncStorage from '@react-native-community/async-storage';

class StorageService {
  constructor(namespace = 'storageForMessages') {
    this.namespace = namespace;
  }

  async getMessages() {
    const rawMessages = await AsyncStorage.getItem(`${this.namespace}:messages`);
    return rawMessages ? JSON.parse(rawMessages) : [];
  }

  async getMessage(id) {
    const messages = await this.getMessages();
    return messages.find((message) => message.id === id);
  }

  async addMessage(message) {
    const currentMessages = await this.getMessages();
    const newMessages = [...currentMessages, message];
    await AsyncStorage.setItem(`${this.namespace}:messages`, JSON.stringify(newMessages));
  }

  async clearMessages() {
    await AsyncStorage.removeItem(`${this.namespace}:messages`);
  }
}

export default StorageService;
