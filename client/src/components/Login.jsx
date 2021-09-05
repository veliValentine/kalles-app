import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useHistory } from 'react-router';
import useError from '../hooks/useError';
import Error from './common/Error';
import TextInput from './common/TextInput';

const Login = ({ updateUser, containerStyle }) => (
	<View style={containerStyle}>
		<LoginContainer updateUser={updateUser} />
	</View>
);

const LoginContainer = ({ updateUser }) => {
	const [username, setUsername] = useState('');
	const [error, updateError] = useError();
	const history = useHistory();

	const handleUpdate = () => {
		if (username < 3) return updateError('Username too short');
		updateUser({ username });
		history.push('/map');
	};
	return (
		<View style={styles.container}>
			<Text>Enter your username: </Text>
			<TextInput
				handleTextChange={(text) => setUsername(text)}
				placeholder="Username"
				value={username}
			/>
			<Error errorMessage={error} />
			<Button
				onPress={handleUpdate}
				title="login"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		marginTop: 10,
		padding: 10,
		backgroundColor: 'white'
	},
	text: {
		padding: 10,
		color: 'white',
		marginRight: 20,
		fontWeight: 'bold',
	},
});

export default Login;
