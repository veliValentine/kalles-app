import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput as NativeTextInput, Button } from 'react-native';
import { useHistory } from 'react-router-native';
import useError from '../hooks/useError';

import LoadingScreen from './LoadingScreen';

const MessageForm = ({ addMessage, currentLocation }) => {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [error, updateError] = useError();

  const history = useHistory();

  if (!currentLocation) {
    return <LoadingScreen />;
  }

  const newMessage = () => {
    const messageData = message.trim();
    const usernameData = username.trim();
    if (!messageData) return updateError('Message required');
    if (!usernameData) return updateError('Username required');

    addMessage({
      message: messageData,
      username: usernameData,
    });
    setMessage('');
    setUsername('');
    history.push('/map');
  };

  return (
    <View style={styles.container}>
      <Text style={{ padding: 5 }}>Create message</Text>
      <TextInput
        handleTextChange={(text) => setMessage(text)}
        placeholder="Message"
        value={message}
        multiline
      />
      <TextInput
        handleTextChange={(text) => setUsername(text)}
        placeholder="Username"
        value={username}
      />
      <Error errorMessage={error} />
      <Button
        onPress={newMessage}
        title="Add message"
        style={styles.button}
      />
    </View>
  );
};

const TextInput = ({ handleTextChange, placeholder = '', value = '', multiline = false }) => (
  <NativeTextInput
    onChangeText={handleTextChange}
    placeholder={placeholder}
    style={styles.textInput}
    blurOnSubmit
    value={value}
    multiline={multiline}
  />
);

const Error = ({ errorMessage }) => (
  <Text style={styles.error}>{errorMessage}</Text>
);

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

export default MessageForm;
