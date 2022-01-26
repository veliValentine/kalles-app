import { useBackHandler } from "@react-native-community/hooks";
import React, { useState } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import { useHistory } from "react-router-native";
import useError from "../hooks/useError";
import { MAP_PAGE } from "../service/navigationService";
import Error from "./common/Error";
import TextInput from "./common/TextInput";

const MessageForm = ({ addMessage }) => {
	const [message, setMessage] = useState("");
	const [error, updateError] = useError();
	const history = useHistory();

	useBackHandler(() => {
		history.push(MAP_PAGE);
		return true;
	});

	const newMessage = () => {
		const messageData = message.trim();
		if (!messageData) return updateError("Message required");

		addMessage({
			message: messageData,
		});

		setMessage("");
		history.push("/map");
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
		backgroundColor: "white",
		padding: 15,
	},
	button: {
		padding: 10,
		backgroundColor: "blue",
	}
});

export default MessageForm;
