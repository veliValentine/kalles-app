import React from "react";
import { View } from "react-native";
import useError from "../../hooks/useError";
import { createUser, signIn } from "../../service/firebaseService";
import Login from "./Login";
import Register from "./Register";

const Authentication = ({ containerStyle, userLogin, userRegisteration }) => {
	const [error, updateError] = useError();

	const login = (email, password) => {
		handleForms(
			signIn(email, password),
			userLogin,
			updateError
		);
	};

	const register = (email, password) => {
		handleForms(
			createUser(email, password),
			userRegisteration,
			updateError
		);
	};

	const handleForms = async (promise, callBack, errorCallBack) => {
		try {
			const userInfo = await promise;
			callBack(userInfo);
		} catch (error) {
			errorCallBack(error.message);
		}
	};
	return (
		<View style={containerStyle}>
			<Login login={login} error={error} />
			<Register register={register} error={error} />
		</View>
	);
};

export default Authentication;
