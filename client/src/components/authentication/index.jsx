import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import useError from "../../hooks/useError";
import { createUser, signIn } from "../../service/firebaseService";
import Login from "./Login";
import Register from "./Register";

const Authentication = ({ containerStyle, userLogin, userRegisteration, loading }) => {
	const [showRegister, setShowRegister] = useState(false);
	const [error, updateError] = useError();

	const switchForm = () => setShowRegister(!showRegister);

	const login = (email, password) => {
		handleForms(
			signIn(email, password),
			userLogin,
			updateError
		);
	};
	const register = (username, email, password) => {
		const callBack = (userInfo) => {
			const newUserInfo = {
				...userInfo,
				username,
			};
			userRegisteration(newUserInfo);
		};
		handleForms(
			createUser(email, password),
			callBack,
			updateError
		);
	};
	const handleForms = async (promise, callBack, errorCallBack) => {
		if (loading) return;
		try {
			const userInfo = await promise;
			callBack(userInfo);
		} catch (error) {
			errorCallBack(error.message);
		}
	};
	return (
		<View style={containerStyle}>
			{showRegister ?
				<Register register={register} error={error} loading={loading} /> :
				<Login login={login} error={error} loading={loading} />
			}
			<View style={styles.switchButtonContainer}>
				<Button
					style={styles.switchButton}
					onPress={() => switchForm()}
					disabled={!showRegister}
					title="Login form"
					color="#40A4F5"
				/>
				<Button
					style={styles.switchButton}
					onPress={() => switchForm()}
					disabled={showRegister}
					title="Register form"
					color="#40A4F5"
				/>
			</View>
		</View>
	);
};

export const styles = StyleSheet.create({
	switchButtonContainer: {
		paddingHorizontal: 40,
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	switchButton: {
		padding: 10,
		borderRadius: 50,
		margin: 20
	}
});

export default Authentication;
