import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker as MapMarker } from 'react-native-maps';

import Constants from 'expo-constants';

import LoadingScreen from './LoadingScreen';
import { useHistory, useParams } from 'react-router-native';

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width - 1,
    height: Dimensions.get('window').height - Constants.statusBarHeight - 60,
  },
  header: {
    padding: 10,
    backgroundColor: 'white',
  },
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
  reloadText: {
    padding: 1
  },
});

const Marker = ({ message }) => {
  const history = useHistory();
  const { coordinate, close, id, username, distance } = message;

  const redirectToMessageView = () => {
    if (close) {
      history.push(`/message/${id}`);
    }
  };

  return (
    <MapMarker
      coordinate={coordinate}
      pinColor={close ? 'green' : distance < 15 ? 'yellow' : 'red'}
      key={id}
      title={close ? 'View message' : 'Move closer to see the message'}
      description={`By ${username}`}
      onCalloutPress={redirectToMessageView}
    />
  );
};

const ReloadButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.reloadContainer}>
    <View style={styles.reloadButton}>
      <Text style={styles.reloadText}>Reload</Text>
    </View>
  </TouchableOpacity >
);

// https://github.com/react-native-maps/react-native-maps

const Map = ({ messages, reloadMessages, location, changeLocation }) => {
  const { id } = useParams();
  if (!location) {
    return <LoadingScreen />;
  }
  const messageCoordinates = id ? messages.find((message) => message.id === id).coordinate : null;
  const initialRegion = messageCoordinates
    ? {
      latitude: messageCoordinates.latitude,
      longitude: messageCoordinates.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    } : {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  const markers = messages.map((message) => <Marker message={message} key={message.id} />);

  const handleLocationChange = (event) => {
    if (event && event.nativeEvent && event.nativeEvent.coordinate) {
      changeLocation(event.nativeEvent.coordinate);
    } else {
      console.log('No location available');
    }
  };
  return (
    <View>
      <MapView style={styles.map}
        //minZoomLevel={13}
        initialRegion={initialRegion}
        showsBuildings={false}
        showsTraffic={false}
        toolbarEnabled={false}
        onUserLocationChange={handleLocationChange}
      >
        {markers}
      </MapView>
      <ReloadButton onPress={reloadMessages} />
    </View >
  );
};

export default Map;
