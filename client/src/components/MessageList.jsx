import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useHistory } from 'react-router-native';

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

  const tooFarAway = distance > 0.1;

  return (
    <View style={styles.messageContainer}>
      <TouchableOpacity
        onPress={() => history.push(`/message/${id}`)}
        disabled={tooFarAway}
      >
        {tooFarAway
          ? <Text>Move closer to see the message</Text>
          : <View>
            <Text style={styles.messageText} >Click to see message</Text>
            <Text>By: {username}</Text>
          </View>
        }
        <Text>Distance: {distance} km</Text>
      </TouchableOpacity>
    </View>
  );
};

const MessageList = ({ messages, }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => <Message message={item} />}
      />
    </View>
  );
};

export default MessageList;
