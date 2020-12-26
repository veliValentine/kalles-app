import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Button } from 'react-native';
import { useHistory } from 'react-router-native';

import useCurrentLocation from '../hooks/useCurrentLocation';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  textInput: {
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
  },
  error: {
    color: 'red',
    padding: 5,
  }
});

let timeoutID;

const MessageForm = ({ addMessage }) => {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const history = useHistory();
  const [currentLocation] = useCurrentLocation();

  if (!currentLocation) {
    return <Text>loading</Text>;
  }

  const newError = (errorMessage) => {
    setError(errorMessage);
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      setError(null);
    }, 1000 * 3);
  };

  const newMessage = () => {
    const messageData = message.trim();
    const usernameData = username.trim();
    if (!messageData && !usernameData) {
      newError('Message and username required');
      return;
    }
    if (!messageData) {
      newError('Message required');
      return;
    }
    if (!usernameData) {
      newError('Username required');
      return;
    }

    addMessage({
      text: messageData,
      location: currentLocation,
      distance: 0,
      username: usernameData,
    });
    setMessage('');
    setUsername('');
    history.push('/messages');
  };

  return (
    <View style={styles.container}>
      <Text style={{ padding: 5 }}>Create message</Text>
      <TextInput
        onChangeText={(text) => setMessage(text)}
        placeholder="Message"
        multiline
        style={styles.textInput}
        blurOnSubmit
        value={message}
      />
      <TextInput
        onChangeText={(text) => setUsername(text)}
        placeholder="Username"
        style={styles.textInput}
        blurOnSubmit
        value={username}
        autoCapitalize="none"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        onPress={newMessage}
        title="Add message"
        style={styles.button}
      />
    </View>
  );
};

export default MessageForm;
