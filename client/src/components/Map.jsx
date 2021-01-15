import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import useCurrentLocation from '../hooks/useCurrentLocation';

import Constants from 'expo-constants';
import LoadingScreen from './LoadingScreen';

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
const Map = ({ messages }) => {
  const [location] = useCurrentLocation();

  if (!location) {
    return <LoadingScreen />;
  }

  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  //Colors aqua for own location, yellow for close one and green for available one
  console.log(messages);
  let markers = [<Marker coordinate={location} pinColor="aqua" key="own" />];
  markers = markers.concat(
    messages.map(message => ({
      ...message,
      pinColor: message.distance < 0.2 ? "green" : "yellow",
      id: message.id,
    }))
      .map(({ location, pinColor, key }) => <Marker coordinate={location} pinColor={pinColor} key={key} />)
  );

  return (
    <View>
      <View style={styles.header} />
      <MapView style={styles.map}
        //minZoomLevel={13}
        initialRegion={initialRegion}
      >
        {markers}
      </MapView>
      <View style={styles.footer} />
    </View>
  );
};

export default Map;
