import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useParams, useHistory } from 'react-router-native';
import { readableTime } from '../utils';

import LoadingScreen from './LoadingScreen';

const Message = ({ messages }) => {
  const { id } = useParams();
  if (!messages) {
    return <LoadingScreen message={'getting messages'} />;
  }
  const message = messages.find((item) => item.id === id);
  if (!message) {
    return <MessageNotFound id={id} />;
  }
  return <MessageFound message={message} />;
};

const MessageNotFound = ({ id }) => {
  console.log(`Error getting message --- Message.jsx --- Message not found. ID: ${id}`);
  const history = useHistory();
  const handlePress = () => history.push('/');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Text>Message not found!</Text>
        <Text style={{ color: 'blue' }}>Go to main menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const MessageFound = ({ message }) => {
  const { message: text, username, likes, created } = message;
  const dateString = readableTime(created);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.username}>By: {username}</Text>
      <Text style={styles.text}>Created: {dateString}</Text>
      <Text style={styles.text}>Likes: {likes}</Text>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 5,
  },
  username: {
    padding: 5,
    fontWeight: 'bold',
  },
  text: {
    padding: 5,
  },
});

export default Message;
