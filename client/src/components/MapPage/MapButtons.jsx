import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ReloadButton = ({ onPress }) => (
	<MapButton
		onPress={onPress}
		containerStyle={{ ...styles.container, ...styles.reloadContainer }}
		buttonStyle={{ ...styles.button }}
		textStyle={{ ...styles.text }}
		buttonText="Reload"
	/>
);

export const UserLocationButton = ({ onPress }) => (
	<MapButton
		onPress={onPress}
		containerStyle={{ ...styles.container, ...styles.userLocationContainer }}
		buttonStyle={{ ...styles.button }}
		textStyle={{ ...styles.text }}
		buttonText="My location"
	/>
);

export const NewMessageButton = ({ onPress }) => (
	<MapButton
		onPress={onPress}
		containerStyle={styles.newMessageContainer}
		buttonStyle={styles.newMessageButton}
		textStyle={styles.newMessageText}
		buttonText={"\uFF0B"}
	/>
);

export const MapButton = ({ onPress, containerStyle = {}, buttonStyle = {}, textStyle = {}, buttonText = "" }) => (
	<TouchableOpacity onPress={onPress} style={containerStyle}>
		<View style={buttonStyle}>
			<Text style={textStyle}>{buttonText}</Text>
		</View>
	</TouchableOpacity >
);

const styles = StyleSheet.create({
	reloadContainer: {
		alignSelf: "center",
	},
	userLocationContainer: {
		alignSelf: "flex-end"
	},
	newMessageContainer: {
		position: "absolute",
		right: 0,
		bottom: 0,
		marginRight: 30,
		marginBottom: 40,
	},
	newMessageButton: {
		backgroundColor: "white",
		borderRadius: 100,
		height: 50,
		width: 50,
		borderWidth: 1,
		margin: 4,
		display: "flex",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
	},
	newMessageText: {
		fontSize: 35,
		color: "black",
		position: "absolute",
	},
	container: {
		position: "absolute",
		padding: 20,
	},
	button: {
		backgroundColor: "white",
		borderRadius: 50,
		padding: 5,
		borderStyle: "solid",
		borderColor: "black",
		borderWidth: 1,
	},
	text: {
		padding: 1
	},
});
