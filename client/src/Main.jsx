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
  const [location, fetchCurrentLocation] = useCurrentLocation();
  const [messages, getMessages, addMessage] = useMessages();
  //console.log(`${messages.length} messages`);
  if (messages && messages.length > 0) {
    console.log(messages[0].distance);
    console.log(location);
  }
  const reloadMessages = () => {
    fetchCurrentLocation();
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
          <MessageForm addMessage={addMessage} currentLocation={location} />
        </Route>
        <Route path="/map" exact>
          <Map messages={messages} reloadMessages={reloadMessages} location={location} />
        </Route>
        <Route path="/map/:id">
          <Map messages={messages} reloadMessages={reloadMessages} location={location} />
        </Route>
        <Redirect to="/map" />
      </Switch>
    </View>
  );
};

export default Main;
