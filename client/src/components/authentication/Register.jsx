import React from "react";
import { Button, Text, View } from "react-native";
import { useState } from "react/cjs/react.development";
import useError from "../../hooks/useError";
import Error from "../common/Error";
import { Input, styles } from "./commonAuth";

const Register = ({ register, error }) => {
	const [email, setEmail] = useState("");
	const [emailAgain, setEmailAgain] = useState("");
	const [password, setPassword] = useState("");
	const [passwordAgain, setPasswordAgain] = useState("");
	const [validationError, setValidationError] = useError();

	const handleRegister = () => {
		if (!email || !emailAgain) {
			return setValidationError("Missing email");
		}
		if (!password || !passwordAgain) {
			return setValidationError("Missing password");
		}
		if (email !== emailAgain) {
			return setValidationError("Email mismatch");
		}
		if (password !== passwordAgain) {
			return setValidationError("Password mismatch");
		}
		register(email, password);
	};
	return (
		<View style={styles.container}>
			<Text style={styles.header}>Register</Text>
			<Input text="Enter your email: "
				value={email}
				handleTextChange={setEmail}
			/>
			<Input text="Enter your email again: "
				value={emailAgain}
				handleTextChange={setEmailAgain}
			/>
			<Input text="Enter your password: "
				value={password}
				handleTextChange={setPassword}
				isPassword={true}
			/>
			<Input text="Enter your password again: "
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

export default Register;
