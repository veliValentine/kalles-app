import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import { useParams, useHistory } from "react-router-native";
import { readableTime } from "../utils";

import LoadingScreen from "./LoadingScreen";

const Message = ({ messages, likeMessage, deleteMessage, user }) => {
	const { id } = useParams();
	if (!messages) {
		return <LoadingScreen message={"getting messages"} />;
	}
	const message = messages.find((item) => item.id === id);
	if (!message) {
		return <MessageNotFound id={id} />;
	}
	return <MessageFound message={message} likeMessage={likeMessage} deleteMessage={deleteMessage} user={user} />;
};

const MessageNotFound = ({ id }) => {
	console.log(`Error getting message --- Message.jsx --- Message not found. ID: ${id}`);
	const history = useHistory();
	const handlePress = () => history.push("/");
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePress}>
				<Text>Message not found!</Text>
				<Text style={{ color: "blue" }}>Go to main menu</Text>
			</TouchableOpacity>
		</View>
	);
};

const MessageFound = ({ message: messageObject, likeMessage, deleteMessage, user }) => {
	const history = useHistory();
	const { message, username, likes, createDay, id } = messageObject;
	const userAlreadyLikeMessage = (user && user.likedMessages && user.likedMessages.includes(id));
	const [disableLike, setDisableLike] = useState(userAlreadyLikeMessage);

	const handleLike = () => {
		likeMessage(id);
		setDisableLike(true);
	};
	const handleDelete = () => {
		history.goBack();
		deleteMessage(id);
	};

	const dateString = createDay ? readableTime(createDay) : null;
	const isUsersMessage = username === (user && user.username);

	return (
		<View style={styles.container}>
			<Text style={styles.message}>{message}</Text>
			<Text style={styles.username}>User: {username}</Text>
			{dateString && <Text style={styles.text}>Created: {dateString}</Text>}
			<Text style={styles.text}>Likes: {likes}</Text>
			{isUsersMessage ?
				<DeleteButton handleDelete={handleDelete} /> :
				<LikeButton handleLike={handleLike} disabled={disableLike} />
			}
		</View>
	);
};

const LikeButton = ({ handleLike, disabled = false }) => <Button title="Like" color="#33FFA4" onPress={handleLike} disabled={disabled} />;

const DeleteButton = ({ handleDelete }) => {
	const handlePress = () => Alert.alert(
		"Are you sure you want to delete this message?",
		"",
		[
			{
				text: "No"
			}, {
				text: "Yes",
				onPress: handleDelete,
			}
		],
		{
			cancelable: true
		}
	);
	return (
		<Button title="Delete" color="red" onPress={handlePress} />
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 10,
		marginTop: 5,
	},
	username: {
		padding: 5,
		fontWeight: "bold",
	},
	message: {
		padding: 5,
		backgroundColor: "rgb(240,240,240)",
		borderRadius: 5
	},
	text: {
		padding: 5,
	},
});

export default Message;
