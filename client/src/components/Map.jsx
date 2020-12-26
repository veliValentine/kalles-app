import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

import Constants from 'expo-constants';

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - Constants.statusBarHeight,
  },
  header: {
    padding: 10,
    backgroundColor: 'white',
  },
  footer: {
    padding: 10,
    backgroundColor: 'white',
  }
});

const Map = () => {
  return (
    <View>
      <View style={styles.header} />
      <MapView style={styles.map}
        initialRegion={{
          latitude: 60.78825,
          longitude: 25.4324,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      />
      <View style={styles.footer} />
    </View>
  );
};

export default Map;
