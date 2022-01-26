import { useBackHandler } from "@react-native-community/hooks";
import React from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHistory } from "react-router-native";
import useUserContent from "../hooks/useUserContent";
import { MAP_PAGE } from "../service/navigationService";
import ItemSeparator from "./common/ItemSeparator";
import LoadingScreen from "./LoadingScreen";

const UserInfoPage = ({ user, logout }) => {
	const [loading, , usersMessages, likedMessages] = useUserContent(user);
	const history = useHistory();

	useBackHandler(() => {
		history.push(MAP_PAGE);
		return true;
	});

	const loadingMessageStyles = {
		container: styles.container,
		text: {}
	};
	return (
		<View>
			<UserInfo user={user} />
			{loading ?
				<LoadingScreen message={"Loading messages..."} styles={loadingMessageStyles} /> :
				<View>
					<ListMessages messages={usersMessages} text="My messages:" />
					<ListMessages messages={likedMessages} text="Liked messages:" />
				</View>
			}
			<Button onPress={() => logout()} title="logout" />
		</View>
	);
};

const UserInfo = ({ user }) => (
	<View style={styles.container}>
		<Text style={styles.text}>My information:</Text>
		<Text style={styles.text}>	Username: {user.username}</Text>
	</View>
);

const ListMessages = ({ messages = [], text = "" }) => {
	if (messages.length < 1) return null;
	return (
		<View style={styles.userMessagesContainer}>
			<Text style={styles.textMyMessages}>{text}</Text>
			<FlatList
				data={messages}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={ItemSeparator}
				renderItem={({ item }) => <UserMessage message={item} />}
			/>
		</View>
	);
};

const UserMessage = ({ message: messageObject }) => {
	const history = useHistory();
	const { id, likes } = messageObject;

	const handlePress = () => history.push(`/message/${id}`);

	return (
		<View style={styles.messageContainer}>
			<TouchableOpacity onPress={handlePress}>
				<View>
					<Text>Likes: {likes}</Text>
					<Text>Click to see more</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		margin: 10,
		backgroundColor: "white",
		borderRadius: 10
	},
	userMessagesContainer: {
		padding: 10,
	},
	text: {
		padding: 10,
		color: "black",
		marginRight: 20,
	},
	textMyMessages: {
		backgroundColor: "white",
		padding: 5,
		borderRadius: 5,
		marginBottom: 5,
		fontWeight: "bold"
	},
	messageContainer: {
		backgroundColor: "white",
		padding: 5,
		borderRadius: 5
	},
});

export default UserInfoPage;
