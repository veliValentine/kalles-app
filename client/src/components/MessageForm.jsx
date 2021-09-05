import React, { useState } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { useHistory } from 'react-router-native';
import useError from '../hooks/useError';
import Error from './common/Error';
import TextInput from './common/TextInput';

import LoadingScreen from './LoadingScreen';

const MessageForm = ({ addMessage, currentLocation }) => {
	const [message, setMessage] = useState('');
	const [username, setUsername] = useState('');
	const [error, updateError] = useError();

	const history = useHistory();

	if (!currentLocation) {
		return <LoadingScreen message="location not available" />;
	}

	const newMessage = () => {
		const messageData = message.trim();
		const usernameData = username.trim();
		if (!messageData) return updateError('Message required');
		if (!usernameData) return updateError('Username required');

		addMessage({
			message: messageData,
			username: usernameData,
		});
		setMessage('');
		setUsername('');
		history.push('/map');
	};

	return (
		<View style={styles.container}>
			<Text style={{ padding: 5 }}>Create message</Text>
			<TextInput
				handleTextChange={(text) => setMessage(text)}
				placeholder="Message"
				value={message}
				multiline
			/>
			<TextInput
				handleTextChange={(text) => setUsername(text)}
				placeholder="Username"
				value={username}
			/>
			<Error errorMessage={error} />
			<Button
				onPress={newMessage}
				title="Add message"
				style={styles.button}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		padding: 15,
	},
	button: {
		padding: 10,
		backgroundColor: 'blue',
	}
});

export default MessageForm;
