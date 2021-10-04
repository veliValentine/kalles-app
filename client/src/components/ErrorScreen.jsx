import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ErrorScreen = ({ errorMessage }) => {
	if (!errorMessage) return null;
	return <ErrorView errorMessage={errorMessage} />;
};

const ErrorView = ({ errorMessage = 'An unexpected error occured' }) => (
	<View style={styles.container}>
		<Text style={styles.text}>{errorMessage}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: 'red',
	},
	text: {
		color: 'black',
		textAlign: 'center'
	}
});

export default ErrorScreen;
