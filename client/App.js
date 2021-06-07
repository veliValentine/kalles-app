import React, { useEffect } from 'react';
import Main from './src/Main';

import { NativeRouter } from 'react-router-native';
import StorageService from './src/service/storageService';
import StorageContext from './src/contexts/StorageContext';

const storageService = new StorageService();

const App = () => {
  useEffect(() => {
    console.log('Clear storage');
    const clearStorage = async () => {
      await storageService.clearMessages();
    };
    clearStorage();
  }, []);

  return (
    <NativeRouter>
      <StorageContext.Provider value={storageService} >
        <Main />
      </StorageContext.Provider>
    </NativeRouter>
  );
};

export default App;
