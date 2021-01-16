import React, { useEffect } from 'react';
import Main from './src/Main';

import { NativeRouter } from 'react-router-native';
import Storage from './src/storage';
import StorageContext from './src/contexts/StorageContext';

const storage = new Storage();

const App = () => {
  useEffect(() => {
    const initStorage = async () => {
      await storage.initMessages();
    };
    //initStorage();
  }, []);
  return (
    <NativeRouter>
      <StorageContext.Provider value={storage} >
        <Main />
      </StorageContext.Provider>
    </NativeRouter>
  );
};

export default App;
