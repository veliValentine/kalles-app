import AsyncStorage from '@react-native-community/async-storage';

const data = [
  {
    id: '0',
    text: 'Hello Helsinki',
    location: {
      latitude: 60.171712519065174,
      longitude: 24.94059522394236
    },
    username: 'Helsinki',
  },
  {
    id: '1',
    text: 'Hello Kumpula',
    location: {
      latitude: 60.2058235648218,
      longitude: 24.963834277842142
    },
    username: 'Kumpula',
  },
  {
    id: '2',
    text: 'Hello Viikki',
    location: {
      latitude: 60.22773733793554,
      longitude: 25.014474383948446
    },
    username: 'Testuser 3',
  },
];

class Storage {
  constructor(namespace = 'storageForMessages') {
    this.namespace = namespace;
  }

  async getMessages() {
    //console.log('get messages from storage');
    const rawMessages = await AsyncStorage.getItem(`${this.namespace}:messages`);
    return rawMessages ? JSON.parse(rawMessages) : [];
  }

  async getMessage(id) {
    //console.log('get a message from storage');
    const messages = await this.getMessages();
    return messages.find((message) => message.id === id);
  }

  async addMessage(message) {
    //console.log('add a message to storage');
    const currentMessages = await this.getMessages();
    const newMessages = [...currentMessages, message];
    await AsyncStorage.setItem(`${this.namespace}:messages`, JSON.stringify(newMessages));
  }

  async initMessages() {
    //console.log('add messages');
    await AsyncStorage.setItem(`${this.namespace}:messages`, JSON.stringify(data));
  }

  async clearMessages() {
    await AsyncStorage.removeItem(`${this.namespace}:messages`);
  }
}

export default Storage;
