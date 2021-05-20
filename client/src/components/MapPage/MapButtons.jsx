import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ReloadButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.reloadContainer}>
    <View style={styles.reloadButton}>
      <Text style={styles.text}>Reload messages</Text>
    </View>
  </TouchableOpacity >
);

export const UserLocationButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.ownLocationContainer}>
    <View style={styles.ownLocationButton}>
      <Text style={styles.text}>My location</Text>
    </View>
  </TouchableOpacity >
);

const styles = StyleSheet.create({
  reloadContainer: {
    position: 'absolute',
    alignSelf: 'center',
    padding: 20,
  },
  reloadButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
  },
  text: {
    padding: 1
  },
  ownLocationContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 20,
  },
  ownLocationButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
  },
});
