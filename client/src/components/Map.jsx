import React from 'react';
import { View, StyleSheet, Dimensions, Button } from 'react-native';
import MapView, { Marker as MapMarker } from 'react-native-maps';

import Constants from 'expo-constants';

import useCurrentLocation from '../hooks/useCurrentLocation';

import LoadingScreen from './LoadingScreen';
import { useHistory, useParams } from 'react-router-native';

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - Constants.statusBarHeight - 60,
  },
  header: {
    padding: 10,
    backgroundColor: 'white',
  },
  reloadButtonContainer: {
    borderRadius: 50,
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: 'grey',
  }
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

const ReloadButton = ({ onPress }) => {
  return (
    <View style={styles.reloadButtonContainer}>
      <Button
        title="reload map"
        onPress={onPress}
        color="transparent"
      />
    </View>
  );
};

//https://github.com/react-native-maps/react-native-maps

const Map = ({ messages, reloadMessages }) => {
  const [location] = useCurrentLocation();
  const { id } = useParams();

  if (!location) {
    return <LoadingScreen />;
  }

  const coordinateOfMessage = id ? messages.find(message => message.id === id).coordinate : null;

  const initialRegion = {
    latitude: coordinateOfMessage ? coordinateOfMessage.latitude : location.latitude,
    longitude: coordinateOfMessage ? coordinateOfMessage.longitude : location.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const markers = messages.map(message => <Marker message={message} key={message.id} />);

  return (
    <View>
      {/*<View style={styles.reloadContainer}>
        <Text>Reload</Text>
      </View>*/}
      <MapView style={styles.map}
        //minZoomLevel={13}
        initialRegion={initialRegion}
        showsUserLocation
        showsBuildings={false}
        showsTraffic={false}
      >
        {markers}
      </MapView>
      <ReloadButton onPress={reloadMessages} />
    </View>
  );
};

export default Map;
