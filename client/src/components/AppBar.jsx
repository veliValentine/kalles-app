import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flexDirection: 'row',
    padding: 10,
  },
  text: {
    padding: 10,
    color: 'white',
    marginRight: 20,
    fontWeight: 'bold',
  },
});

const AppBarTab = ({ to, children }) => (
  <Link to={to}>
    <Text style={styles.text}>{children}</Text>
  </Link>
);

const AppBar = () => (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab to="/map">Map</AppBarTab>
        <AppBarTab to="/messages">Messages</AppBarTab>
        <AppBarTab to="/newMessage">New message</AppBarTab>
      </ScrollView>
    </View>
  );

export default AppBar;
