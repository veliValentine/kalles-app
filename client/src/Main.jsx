import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, Route, Switch } from 'react-router-native';

import Constants from 'expo-constants';

import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import AppBar from './components/AppBar';
import Message from './components/Message';
import Map from './components/Map';

import useMessages from './hooks/useMessages';
import useCurrentLocation from './hooks/useCurrentLocation';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#F0EAD6'
  },
});

const Main = () => {
  const [, setCurrentLocation] = useCurrentLocation();
  const [messages, getMessages, addMessage] = useMessages();
  console.log(`${messages.length} messages`);

  const reloadMessages = () => {
    setCurrentLocation();
    getMessages();
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
          <Map messages={messages} reloadMessages={reloadMessages}/>
        </Route>
        <Redirect to="/map" />
      </Switch>
    </View>
  );
};

export default Main;
