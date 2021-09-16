import React from 'react';
import { StyleSheet, Text } from 'react-native';

const Error = ({ errorMessage }) => (
	<Text style={styles.error}>{errorMessage}</Text>
);

const styles = StyleSheet.create({
	error: {
		color: 'red',
		padding: 5,
	}
});

export default Error;
