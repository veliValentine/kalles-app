import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useHistory } from 'react-router-native';
import { isReadable } from '../utils';
import LoadingScreen from './LoadingScreen';

const MessageList = ({ messages }) => {
  const history = useHistory();
  const redirect = (url) => history.push(url);
  if (!messages) {
    return <LoadingScreen message={'Loading messages...'} />;
  }
  if (messages.length < 1) {
    return <NoMessages redirect={redirect} />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => <ListItem message={item} redirect={redirect} />}
      />
    </View>
  );
};

const NoMessages = ({ redirect }) => {
  const handlePress = () => {
    redirect('/newMessage');
  };
  return (
    <View style={styles.missingContainer}>
      <TouchableOpacity onPress={handlePress}>
        <Text>Messages not found!</Text>
        <Text style={{ color: 'blue' }}>Add a new message!</Text>
      </TouchableOpacity>
    </View>
  );
};

const ItemSeparator = () => <View style={styles.separator} />;

const ListItem = ({ message, redirect }) => {
  const { distance, id, username } = message;
  const isClose = isReadable(distance);
  const handlePress = () => {
    if (isClose) {
      redirect(`/message/${id}`);
    } else {
      const { latitude, longitude } = message.location;
      redirect(`/map/${latitude}/${longitude}`);
    }
  };
  return (
    <View style={styles.messageContainer}>
      <TouchableOpacity onPress={handlePress}>
        {isClose ?
          <View>
            <Text>Click to see the message</Text>
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
