import React from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
});

const MessageForm = ({ addMessage }) => {
  //console.log('getCurrentPosition', getCurrentPosition());
  /*
  location: {
        lat: 60.171712519065174,
        long: 24.94059522394236
      }
  */
  const newMessage = () => {
    navigator.geolocation.getCurrentPosition((response) => {
      const { latitude, longitude } = response.coords;
      addMessage({
        text: 'This is new message',
        location: {
          lat: latitude,
          long: longitude,
        },
        dist: 0.0,
        username: 'new message user',
      });
    });
  };

  return (
    <TouchableWithoutFeedback onPress={newMessage}>
      <View style={styles.container}>
        <Text style={{ padding: 5 }}>Message form</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MessageForm;
