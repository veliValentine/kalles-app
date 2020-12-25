import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { filterByDistances, sortByDistances } from '../utils';

const styles = StyleSheet.create({
  separator: {
    height: 10
  },
  container: {
    padding: 5
  },
  messageContainer: {
    backgroundColor: 'white',
    padding: 5,
  },
  messageText: {

  }
});

const ItemSeparator = () => <View style={styles.separator} />;

const Message = ({ message }) => {
  const { text, distance, username } = message;
  if (distance > 0.1) {
    return (
      <View style={styles.messageContainer}>
        <Text>Move closer to see the message</Text>
        <Text>Distance: {distance} km</Text>
        <Text>By: {username}</Text>
      </View>
    );
  }
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText} >Message: {text}</Text>
      <Text>Distance: {distance} km</Text>
      <Text>By: {username}</Text>
    </View>
  );
};

const MessageList = ({ messages, }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={filterByDistances(messages, 15).sort(sortByDistances)}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => <Message message={item} />}
      />
    </View>
  );
};

export default MessageList;
