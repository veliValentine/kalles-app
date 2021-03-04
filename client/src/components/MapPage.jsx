import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker as MapMarker } from 'react-native-maps';

import Constants from 'expo-constants';

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
      <Text style={styles.text}>Reload</Text>
    </View>
  </TouchableOpacity >
);

const UserLocationButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.ownLocationContainer}>
    <View style={styles.ownLocationButton}>
      <Text style={styles.text}>My location</Text>
    </View>
  </TouchableOpacity >
);

let mapRef;
const Map = ({ markers, initialRegion, handleLocationChange }) => (
  <MapView style={styles.map}
    ref={(map) => { mapRef = map; }}
    showsUserLocation={true}
    showsMyLocationButton={false}//minZoomLevel={13}
    showsBuildings={false}
    showsTraffic={false}
    toolbarEnabled={false}
    initialRegion={initialRegion}
    onUserLocationChange={handleLocationChange}
  >
    {markers}
  </MapView>
);

// https://github.com/react-native-maps/react-native-maps
const MapPage = ({ messages, reloadMessages, location, changeLocation }) => {
  const userRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const { latitude, longitude } = useParams();
  const [region, setRegion] = useState(userRegion);
  useEffect(() => {
    if (latitude && longitude) {
      const messageRegion = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(messageRegion);
    }
  }, []);

  const markers = messages.map((message) => <Marker message={message} key={message.id} />);
  const handleLocationChange = (event) => {
    if (event && event.nativeEvent && event.nativeEvent.coordinate) {
      changeLocation(event.nativeEvent.coordinate);
    } else {
      console.log('No location available');
    }
  };
  const moveToUserLocation = () => {
    mapRef.animateToRegion(userRegion, 1 * 1000);
  };

  return (
    <View>
      <Map
        markers={markers}
        initialRegion={region}
        handleLocationChange={handleLocationChange}
      />
      <ReloadButton onPress={reloadMessages} />
      <UserLocationButton onPress={moveToUserLocation} />
    </View >
  );
};

export default MapPage;
