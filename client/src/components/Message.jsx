import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useParams } from 'react-router-native';

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
  const message = messages.find(item => item.id === id);
  console.log('messages', messages);
  console.log('id', id);
  console.log('message', message);
  const { text, username } = message;
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Message;
