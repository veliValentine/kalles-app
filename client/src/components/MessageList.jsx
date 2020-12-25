import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useHistory } from 'react-router-native';

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
  const history = useHistory();
  const { distance, username, id } = message;

  if (distance > 0.1) {
    return (
      <View style={styles.messageContainer}>
        <Text>Move closer to see the message</Text>
        <Text>Distance: {distance} km</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => history.push(`/message/${id}`)}
    >
      <View style={styles.messageContainer}>
        <Text style={styles.messageText} >Click to see message</Text>
        <Text>By: {username}</Text>
        <Text>Distance: {distance} km</Text>
      </View>
    </TouchableOpacity>
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
