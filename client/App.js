import React from 'react';
import Main from './src/Main';

import { NativeRouter } from 'react-router-native';
import Storage from './src/storage';
import StorageContext from './src/contexts/StorageContext';

const storage = new Storage();

const App = () => (
  <NativeRouter>
    <StorageContext.Provider value={storage} >
      <Main />
    </StorageContext.Provider>
  </NativeRouter>
);

export default App;
