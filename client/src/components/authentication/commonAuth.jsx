import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TextInput from "../common/TextInput";

export const Input = ({ text, placeholder, value, handleTextChange, isPassword = false }) => (
	<View>
		<Text>{text}</Text>
		<TextInput
			handleTextChange={(text) => handleTextChange(text)}
			placeholder={placeholder}
			value={value}
			secureTextEntry={isPassword}
			autoCapitalize="none"
		/>
	</View>
);

export const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		margin: 20,
		padding: 30,
		backgroundColor: "white"
	},
	header: {
		fontSize: 30
	},
	text: {
		padding: 10,
		color: "white",
		marginRight: 20,
		fontWeight: "bold",
	},
});