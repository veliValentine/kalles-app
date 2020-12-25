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
  const { text, dist, username } = message;
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText} >{text}</Text>
      <Text>Distance: {dist}km</Text>
      <Text>By: {username}</Text>
    </View>
  );
};

const MessageList = ({ messages }) => {
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
