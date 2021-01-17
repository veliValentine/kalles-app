import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useHistory, useParams } from 'react-router-native';
import { redirectToMain } from '../utils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
  },
  username: {
    padding: 5,
    fontWeight: 'bold',
  },
  text: {
    padding: 5,
  },
});

const Message = ({ messages }) => {
  const { id } = useParams();
  const history = useHistory();
  const message = messages.find(item => item.id === id);

  if (!message) {
    redirectToMain(5, history);
    console.log(`Error getting message --- Message.jsx --- Message not found. ID: ${id}`);
    return (
      <View style={styles.container}>
        <Text>Message not found!</Text>
      </View>
    );
  }

  const { text, username } = message;

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Message;
