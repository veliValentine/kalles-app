import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MapButton = ({ onPress, containerStyle, buttonStyle, textStyle, buttonText }) => (
  <TouchableOpacity onPress={onPress} style={{ ...styles.container, ...containerStyle }}>
    <View style={{ ...styles.button, ...buttonStyle }}>
      <Text style={{ ...styles.text, ...textStyle }}>{buttonText}</Text>
    </View>
  </TouchableOpacity >
);

export const ReloadButton = ({ onPress }) => (
  <MapButton
    onPress={onPress}
    containerStyle={styles.reloadContainer}
    buttonText={'Reload messages'}
  />
);

export const UserLocationButton = ({ onPress }) => (
  <MapButton
    onPress={onPress}
    containerStyle={styles.userLocationContainer}
    buttonText={'My location'}
  />
);

const styles = StyleSheet.create({
  reloadContainer: {
    alignSelf: 'center',
  },
  userLocationContainer: {
    alignSelf: 'flex-end'
  },
  container: {
    position: 'absolute',
    padding: 20,
  },
  button: {
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
});
