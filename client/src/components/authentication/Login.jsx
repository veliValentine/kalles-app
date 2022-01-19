import React from "react";
import { Button, Text, View } from "react-native";
import { useState } from "react/cjs/react.development";
import Error from "../common/Error";
import { Input, styles } from "./commonAuth";

const Login = ({ login, error }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	return (
		<View style={styles.container}>
			<Text style={styles.header}>Login</Text>
			<Input text="Enter your email: "
				value={email}
				handleTextChange={setEmail}
			/>
			<Input text="Enter your password: "
				value={password}
				handleTextChange={setPassword}
				isPassword={true}
			/>
			<Error errorMessage={error} />
			<Button
				onPress={() => login(email, password)}
				title="login"
			/>
		</View>
	);
};

export default Login;
