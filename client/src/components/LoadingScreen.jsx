import React from "react";
import { Text, View } from "react-native";

const LoadingScreen = ({ message = "Loading...", styles = {} }) => (
	<View style={styles.container ? styles.container : {}}>
		<Text style={
			styles.text ? styles.text : {
				padding: 10,
				margin: 10,
				marginTop: 200,
				textAlign: "center"
			}}>{message}</Text>
	</View>
);

export default LoadingScreen;
