import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useHistory } from 'react-router-native';
import { isReadable, readableDistance } from '../utils';
import ItemSeparator from './common/ItemSeparator';
import LoadingScreen from './LoadingScreen';

const MessageList = ({ messages, loadingMessages }) => {
	const history = useHistory();
	const redirect = (url) => history.push(url);
	if (loadingMessages) {
		const loadingStyles = {
			container: styles.missingContainer,
			text: {}
		};
		return <LoadingScreen message={'Loading messages...'} styles={loadingStyles} />;
	}
	if (messages.length < 1) {
		return <NoMessages redirect={redirect} />;
	}
	return (
		<View style={styles.container}>
			<FlatList
				data={messages}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={ItemSeparator}
				renderItem={({ item }) => <ListItem message={item} redirect={redirect} />}
			/>
		</View>
	);
};

const NoMessages = ({ redirect }) => {
	const handlePress = () => {
		redirect('/newMessage');
	};
	return (
		<View style={styles.missingContainer}>
			<TouchableOpacity onPress={handlePress}>
				<Text>Messages not found!</Text>
				<Text style={{ color: 'blue' }}>Add a new message!</Text>
			</TouchableOpacity>
		</View>
	);
};

const ListItem = ({ message, redirect }) => {
	const { distance, id, username } = message;
	const isClose = isReadable(distance);
	const handlePress = () => {
		if (isClose) {
			redirect(`/message/${id}`);
		} else {
			const { latitude, longitude } = message.location;
			redirect(`/map/${latitude}/${longitude}`);
		}
	};
	return (
		<View style={styles.messageContainer}>
			<TouchableOpacity onPress={handlePress}>
				{isClose ?
					<View>
						<Text>Click to see the message</Text>
						<Text>By: {username}</Text>
					</View>
					: <Text>Move closer to see the message</Text>
				}
				<Text>Distance: {readableDistance(distance)}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 5
	},
	messageContainer: {
		backgroundColor: 'white',
		padding: 5,
	},
	missingContainer: {
		marginTop: 5,
		padding: 10,
		backgroundColor: 'white',
	},
});

export default MessageList;
