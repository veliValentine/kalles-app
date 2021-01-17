import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useParams, useHistory } from 'react-router-native';

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

const Message = ({ messages }) => {
  const { id } = useParams();
  const history = useHistory();
  const message = messages.find(item => item.id === id);

  if (!message) {
    console.log(`Error getting message --- Message.jsx --- Message not found. ID: ${id}`);

    const handlePress = () => {
      history.push('/');
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePress}>
          <Text>Message not found!</Text>
          <Text style={{ color: 'blue' }}>Go to main menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { text, username } = message;

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.text}>Created @ ...</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Message;
