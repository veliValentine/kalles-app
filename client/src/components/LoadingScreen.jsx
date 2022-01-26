import { useBackHandler } from "@react-native-community/hooks";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { exitApplication } from "../service/navigationService";

const LoadingScreen = ({ message = "Loading...", styles = {} }) => {
	useBackHandler(exitApplication);
	return (
		<View style={styles.container ? styles.container : {}}>
			<Text style={
				styles.text ? styles.text : {
					padding: 10,
					margin: 10,
					marginTop: 200,
					textAlign: "center"
				}}>{message}</Text>
			<ActivityIndicator size="large" color="black" />
		</View>
	);
};

export default LoadingScreen;
