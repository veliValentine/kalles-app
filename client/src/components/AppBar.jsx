import React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Link } from "react-router-native";

import Constants from "expo-constants";

const AppBar = ({ user }) => {
	if (!user) {
		return (
			<View horizontal style={styles.container}>
				<Text style={styles.text}>Welcome to Kalles studio!</Text>
				<Text style={styles.text}>{Constants.manifest.version}</Text>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<ScrollView horizontal>
				<AppBarTab to="/map">Map</AppBarTab>
				<AppBarTab to="/messages">Messages</AppBarTab>
				<AppBarTab to="/newMessage">New message</AppBarTab>
				<AppBarTab to="/userinfo">{user.username}</AppBarTab>
				<AppBarTab>{Constants.manifest.version}</AppBarTab>
			</ScrollView>
		</View>
	);
};

const AppBarTab = ({ to, children }) => (
	<Link to={to}>
		<Text style={styles.text}>{children}</Text>
	</Link>
);

const styles = StyleSheet.create({
	container: {
		backgroundColor: "black",
		flexDirection: "row",
		padding: 10,
		height: 55
	},
	text: {
		padding: 10,
		color: "white",
		marginRight: 20,
		fontWeight: "bold",
	},
});

export default AppBar;
