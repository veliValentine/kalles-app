import React, { useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import useError from "../../hooks/useError";
import ErrorComponent from "../common/Error";
import { Input, styles } from "./commonAuth";

const Register = ({ register, error, loading }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [emailAgain, setEmailAgain] = useState("");
	const [password, setPassword] = useState("");
	const [passwordAgain, setPasswordAgain] = useState("");
	const [validationError, setValidationError] = useError();

	const handleRegister = () => {
		try {
			validateUsername(username);
			validateEmail(email);
			validateEmail(emailAgain);
			validatePassword(password);
			validatePassword(passwordAgain);
			if (email !== emailAgain) {
				throw new Error("Email mismatch");
			}
			if (password !== passwordAgain) {
				throw new Error("Password mismatch");
			}
			register(username, email, password);
		} catch (error) {
			if (error instanceof Error) {
				setValidationError(error.message);
			}
		}
	};

	const errorMessage = error || validationError;

	return (
		<View style={styles.container}>
			<ScrollView>
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
					isEmail={true}
				/>
				<Input text="Enter your email again: "
					placeholder="Email again"
					value={emailAgain}
					handleTextChange={setEmailAgain}
					isEmail={true}
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
			</ScrollView>
			{errorMessage ?
				<ErrorComponent errorMessage={errorMessage} /> :
				null
			}
			<Button
				onPress={handleRegister}
				title="register"
				disabled={loading}
			/>
		</View>
	);
};

const validateUsername = (username) => {
	if (!username) {
		throw new Error("Missing username");
	}
	if (username.length < 3) {
		throw new Error("Username too short");
	}
	if (username.length > 30) {
		throw new Error("Username too long");
	}
};

const validateEmail = (email) => {
	if (!email) {
		throw new Error("Missing email");
	}
};

const validatePassword = (password) => {
	if (!password) {
		throw new Error("Missing password");
	}
};

export default Register;
