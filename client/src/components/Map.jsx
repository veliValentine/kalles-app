import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import useCurrentLocation from '../hooks/useCurrentLocation';

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

//https://github.com/react-native-maps/react-native-maps
const Map = () => {
  const [location] = useCurrentLocation();
  if (!location) {
    return <Text>loading</Text>;
  }
  return (
    <View>
      <View style={styles.header} />
      <MapView style={styles.map}
        minZoomLevel={13}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={location} pinColor="blue"/>{/* Own location */}
        <Marker
          coordinate={{
            latitude: location.latitude+0.005,
            longitude: location.longitude
          }}
        />
      </MapView>
      <View style={styles.footer} />
    </View>
  );
};

export default Map;
