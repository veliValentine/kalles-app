import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

import Constants from 'expo-constants';

import { useParams } from 'react-router-native';
import { ReloadButton, UserLocationButton } from './MapButtons';
import Marker from './Marker';

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
			console.log('No location available - MapPage.jsx');
		}
	};
	const moveToUserLocation = () => {
		const seconds = 1 * 1000;
		mapRef.animateToRegion(userRegion, seconds);
	};
	return (
		<View>
			<Map
				markers={markers}
				region={region}
				handleLocationChange={handleLocationChange}
			/>
			<ReloadButton onPress={reloadMessages} />
			<UserLocationButton onPress={moveToUserLocation} />
		</View >
	);
};

let mapRef;
const Map = ({ region, handleLocationChange, markers }) => (
	<MapView
		style={styles.map}
		ref={(map) => { mapRef = map; }}
		showsUserLocation={true}
		showsMyLocationButton={false}//minZoomLevel={13}
		showsBuildings={false}
		showsTraffic={false}
		toolbarEnabled={false}
		initialRegion={region}
		onUserLocationChange={handleLocationChange}
	>
		{markers}
	</MapView>
);

const styles = StyleSheet.create({
	map: {
		width: Dimensions.get('window').width - 1,
		height: Dimensions.get('window').height - Constants.statusBarHeight - 60,
	},
});

export default MapPage;
