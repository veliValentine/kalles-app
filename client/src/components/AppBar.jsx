import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flexDirection: 'row',
    padding: 5,
  },
  text: {
    color: 'white',
    marginLeft: 5
  },
});

const AppBarTab = ({ children }) => {
  return (
    <Text style={styles.text}>{children}</Text>
  );
};

const AppBar = () => {
  return (
    <View style={styles.container}>
      <AppBarTab>Moi</AppBarTab>
      <AppBarTab>Hoi</AppBarTab>
    </View>
  );
};

export default AppBar;
