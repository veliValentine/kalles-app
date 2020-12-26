import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, Route, Switch } from 'react-router-native';

import Constants from 'expo-constants';

import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import AppBar from './components/AppBar';
import Message from './components/Message';
import Map from './components/Map';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#F0EAD6'
  },
});

const data = [
  {
    id: '0',
    text: 'This is first message',
    location: {
      latitude: 60.171712519065174,
      longitude: 24.94059522394236
    },
    distance: 0.1,
    username: 'Test user 1',
  },
  {
    id: '1',
    text: 'This is second message',
    location: {
      latitude: 60.2058235648218,
      longitude: 24.963834277842142
    },
    distance: 20,
    username: 'Test user 2',
  },
  {
    id: '2',
    text: 'This is third message',
    location: {
      latitude: 60.227737337935544,
      longitude: 25.014474383948446
    },
    distance: 2,
    username: 'Test user 3',
  }
];

const Main = () => {
  const [messages, setMessages] = useState(data);

  const addMessage = (message) => {
    setMessages(messages.concat({
      ...message,
      id: (messages.length + 1).toString()
    }));
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <Switch>
        <Route path="/message/:id" exact>
          <Message messages={messages} />
        </Route>
        <Route path="/messages" exact>
          <MessageList messages={messages} />
        </Route>
        <Route path="/newMessage">
          <MessageForm addMessage={addMessage} />
        </Route>
        <Route path="/map">
          <Map />
        </Route>
        <Redirect to="/messages" />
      </Switch>
    </View>
  );
};

export default Main;
