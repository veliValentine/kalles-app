import React from "react";
import { StyleSheet, TextInput as NativeTextInput } from "react-native";

const TextInput = ({
	handleTextChange,
	placeholder = "",
	value = "",
	multiline = false,
	secureTextEntry = false,
	autoCapitalize = "sentences",
	keyboardType = "default"
}) => (
	<NativeTextInput
		onChangeText={handleTextChange}
		placeholder={placeholder}
		style={styles.textInput}
		blurOnSubmit
		value={value}
		multiline={multiline}
		secureTextEntry={secureTextEntry}
		autoCapitalize={autoCapitalize}
		keyboardType={keyboardType}
	/>
);

const styles = StyleSheet.create({
	textInput: {
		padding: 10,
		marginBottom: 10,
	},
});

export default TextInput;