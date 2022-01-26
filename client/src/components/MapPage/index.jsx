import React, { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import MapView from "react-native-maps";

import { APP_BAR_HEIGHT } from "../AppBar";

import { useParams } from "react-router-native";
import { NewMessageButton, ReloadButton, UserLocationButton } from "./MapButtons";
import Marker from "./Marker";
import { useHistory } from "react-router-native";

// https://github.com/react-native-maps/react-native-maps
const MapPage = ({ messages, reloadMessages, location, changeLocation }) => {
	const history = useHistory();
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
			console.log("No location available - MapPage.jsx");
		}
	};
	const moveToUserLocation = () => {
		const seconds = 1 * 1000;
		mapRef.animateToRegion(userRegion, seconds);
	};

	const addMessage = () => history.push("/newMessage");

	return (
		<View>
			<Map
				markers={markers}
				region={region}
				handleLocationChange={handleLocationChange}
			/>
			<ReloadButton onPress={reloadMessages} />
			<UserLocationButton onPress={moveToUserLocation} />
			<NewMessageButton onPress={addMessage} />
		</View >
	);
};

let mapRef;
const Map = ({ region, handleLocationChange, markers }) => {
	const windowWidth = useWindowDimensions().width;
	const windowHeight = useWindowDimensions().height;
	const mapStyles = {
		width: windowWidth - 1,
		height: windowHeight - APP_BAR_HEIGHT + 1,
	};
	return (
		<MapView
			style={mapStyles}
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
};

export default MapPage;
