import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Constants from 'expo-constants';

import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
//import AppBar from './components/AppBar';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#F0EAD6'
  },
});

const messages = [
  {
    id: '0',
    text: 'This is first message',
    location: {
      lat: 60.171712519065174,
      long: 24.94059522394236
    },
    dist: 0.1,
    username: 'Test user 1',
  },
  {
    id: '1',
    text: 'This is second message',
    location: {
      lat: 60.2058235648218,
      long: 24.963834277842142
    },
    dist: 20,
    username: 'Test user 2',
  },
  {
    id: '2',
    text: 'This is third message',
    location: {
      lat: 60.227737337935544,
      long: 25.014474383948446
    },
    dist: 2,
    username: 'Test user 3',
  }
];

const Main = () => {
  const [data, setData] = useState(messages);

  const addMessage = (message) => {
    setData(data.concat({
      ...message,
      id: (data.length + 1).toString()
    }));
  };

  return (
    <View style={styles.container}>
      {/*<AppBar />*/}
      <MessageList messages={data} />
      <MessageForm addMessage={addMessage} />
    </View>
  );
};

export default Main;
