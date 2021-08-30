import StorageService from './storageService';

class UserStorage {
  constructor(item = 'user') {
    this.item = item;
  }

  async getUser() {
    const user = await StorageService.getItem(this.item);
    return user;
  }

  async addUser(user) {
    if (!user.username) {
      throw new Error('User has no username');
    }
    await StorageService.saveItem(this.item, user);
  }

  async removeUser() {
    await StorageService.clearStorage(this.item);
  }
}

export default UserStorage;