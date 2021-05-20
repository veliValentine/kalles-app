import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useHistory } from 'react-router-native';
import { isReadable } from '../utils';
import LoadingScreen from './LoadingScreen';

const MessageList = ({ messages }) => {
  if (!messages) {
    return <LoadingScreen message={'Loading messages...'} />;
  }
  if (messages.length < 1) {
    return <NoMessages />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => <ListMessage message={item} />}
      />
    </View>
  );
};

const NoMessages = () => {
  const history = useHistory();
  const handlePress = (event) => {
    event.preventDefault();
    history.push('/newMessage');
  };
  return (
    <View style={styles.missingContainer}>
      <TouchableOpacity onPress={handlePress}>
        <Text>Messages not found!</Text>
        <Text style={{ color: 'blue' }}>Add new message!</Text>
      </TouchableOpacity>
    </View>
  );
};


const ItemSeparator = () => <View style={styles.separator} />;

const ListMessage = ({ message }) => {
  const history = useHistory();
  const { distance, id, username } = message;
  const isClose = isReadable(distance);
  const handlePress = () => {
    if (isClose) {
      history.push(`/message/${id}`);
    } else {
      const { latitude, longitude } = message.coordinate;
      history.push(`/map/${latitude}/${longitude}`);
    }
  };
  return (
    <View style={styles.messageContainer}>
      <TouchableOpacity onPress={handlePress}>
        {isClose ?
          <View>
            <Text>Click to see message</Text>
            <Text>By: {username}</Text>
          </View>
          : <Text>Move closer to see the message</Text>
        }
        <Text>Distance: {distance} km</Text>
      </TouchableOpacity>
    </View>
  );
};


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
  missingContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default MessageList;
