import React from 'react';
import { StyleSheet, TextInput as NativeTextInput } from 'react-native';

const TextInput = ({ handleTextChange, placeholder = '', value = '', multiline = false }) => (
	<NativeTextInput
		onChangeText={handleTextChange}
		placeholder={placeholder}
		style={styles.textInput}
		blurOnSubmit
		value={value}
		multiline={multiline}
	/>
);

const styles = StyleSheet.create({
	textInput: {
		padding: 10,
		marginBottom: 10,
	},
});

export default TextInput;