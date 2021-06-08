import React from 'react';
import { Text, View } from 'react-native';

const LoadingScreen = ({ message = 'Loading...' }) => (
  <View>
    <Text style={{
      padding: 10,
      margin: 10,
      marginTop: 200,
      textAlign: 'center'
      }}>{message}</Text>
  </View>
);

export default LoadingScreen;
