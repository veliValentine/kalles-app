import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const UserInfo = ({ user, logout }) => (
	<View style={styles.container}>
		<Text style={styles.text}>Username: {user.username}</Text>
		<Button onPress={logout()} title="logout" />
	</View>
);

const styles = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: 'white',
	},
	text: {
		padding: 10,
		color: 'black',
		marginRight: 20,
		fontWeight: 'bold',
	}
});

export default UserInfo;
