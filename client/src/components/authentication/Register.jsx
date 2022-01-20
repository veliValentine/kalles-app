import React from "react";
import { Button, Text, View } from "react-native";
import { useState } from "react/cjs/react.development";
import useError from "../../hooks/useError";
import Error from "../common/Error";
import { Input, styles } from "./commonAuth";

const Register = ({ register, error }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [emailAgain, setEmailAgain] = useState("");
	const [password, setPassword] = useState("");
	const [passwordAgain, setPasswordAgain] = useState("");
	const [validationError, setValidationError] = useError();

	const handleRegister = () => {
		validateUsername(username, setValidationError);
		validateEmail(email, setValidationError);
		validateEmail(emailAgain, setValidationError);
		validatePassword(password, setValidationError);
		validatePassword(passwordAgain, setValidationError);
		if (email !== emailAgain) {
			return setValidationError("Email mismatch");
		}
		if (password !== passwordAgain) {
			return setValidationError("Password mismatch");
		}
		register(username, email, password);
	};
	return (
		<View style={styles.container}>
			<Text style={styles.header}>Register</Text>
			<Input text="Enter your username: "
				placeholder="Username"
				value={username}
				handleTextChange={setUsername}
			/>
			<Input text="Enter your email: "
				placeholder="Email"
				value={email}
				handleTextChange={setEmail}
			/>
			<Input text="Enter your email again: "
				placeholder="Email again"
				value={emailAgain}
				handleTextChange={setEmailAgain}
			/>
			<Input text="Enter your password: "
				placeholder="Password"
				value={password}
				handleTextChange={setPassword}
				isPassword={true}
			/>
			<Input text="Enter your password again: "
				placeholder="Password again"
				value={passwordAgain}
				handleTextChange={setPasswordAgain}
				isPassword={true}
			/>
			<Error errorMessage={error || validationError} />
			<Button
				onPress={handleRegister}
				title="register"
			/>
		</View>
	);
};

const validateUsername = (username, setError) => {
	if (!username) {
		return setError("Missing username");
	}
	if (username.length < 3) {
		return setError("Username too short");
	}
	if (username.length > 30) {
		return setError("Username too long");
	}
};

const validateEmail = (email, setError) => {
	if (!email) {
		return setError("Missing email");
	}
};

const validatePassword = (password, setError) => {
	if (!password) {
		return setError("Missing password");
	}
};

export default Register;
