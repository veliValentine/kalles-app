import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker as MapMarker } from 'react-native-maps';

import Constants from 'expo-constants';

import useCurrentLocation from '../hooks/useCurrentLocation';

import LoadingScreen from './LoadingScreen';
import { useHistory } from 'react-router-native';

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

const ownLocationMarker = (location) => (
  <MapMarker
    coordinate={location}
    pinColor="aqua"
    key="own"
  />
);

const convertToMarkersArray = (messages) => messages.map((message) => (
  <Marker
    key={message.id}
    message={message}
  />
));

const Marker = ({ message }) => {
  const history = useHistory();
  const { coordinate, close, id, username } = message;

  const redirectToMessageView = () => {
    history.push(`/message/${id}`);
  };

  return <MapMarker
    coordinate={coordinate}
    pinColor={close ? 'green' : 'yellow'}
    key={id}
    title={close ? 'View message' : null}
    description={close ? `By ${username}` : null}
    onCalloutPress={redirectToMessageView}
  />;
};


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

  const markers = [ownLocationMarker(location)].concat(convertToMarkersArray(messages));

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
