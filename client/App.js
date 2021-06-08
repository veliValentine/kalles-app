import React from 'react';
import Main from './src/Main';

import { NativeRouter } from 'react-router-native';
import StorageService from './src/service/storageService';
import StorageContext from './src/contexts/StorageContext';

const storageService = new StorageService();

const App = () => (
  <NativeRouter>
    <StorageContext.Provider value={storageService} >
      <Main />
    </StorageContext.Provider>
  </NativeRouter>
);

export default App;
