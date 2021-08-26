import StorageService from './storageService';

class MessageStorage {
  constructor(item = 'message') {
    this.item = item;
  }

  async getMessages() {
    const messages = await StorageService.getItem(this.item);
    return messages ? messages : [];
  }

  async getMessage(id) {
    const messages = await this.getMessages();
    return messages.find((message) => message.id === id);
  }

  async addMessage(message) {
    const currentMessages = await this.getMessages();
    const newMessages = [...currentMessages, message];
    await StorageService.saveItem(this.item, newMessages);
  }

  async clearMessages() {
    await StorageService.clearStorage(this.item);
  }
}

export default MessageStorage;