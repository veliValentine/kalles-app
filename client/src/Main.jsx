import React from "react";
import { StyleSheet, View } from "react-native";
import Constants from "expo-constants";

import AppBar from "./components/AppBar";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import Authentication from "./components/authentication";

import useMessages from "./hooks/useMessages";
import useCurrentLocation from "./hooks/useCurrentLocation";
import useUser from "./hooks/useUser";
import Router from "./components/Router";

const Main = () => {
	const [loadingUser, userError, user, fetchUser, login, register, logout] = useUser();
	const [loadingLocation, locationError, location, changeLocation] = useCurrentLocation();
	const [loadingMessages, messageError, messages, getMessages, addMessage, likeMessage, deleteMessage] = useMessages(location, fetchUser, user);

	const noLocation = !location;

	const errorMessage = userError || locationError || messageError || null;

	if (loadingLocation || noLocation) {
		return (
			<MainPage user={user} errorMessage={errorMessage} >
				<LoadingScreen message={"Loading location..."} />
			</MainPage>
		);
	}
	if (noLocation) {
		return (
			<MainPage user={user} errorMessage={errorMessage} >
				<LoadingScreen message={"No location available"} />
			</MainPage>
		);
	}
	if (!user) {
		return (
			<MainPage user={user} errorMessage={errorMessage} >
				<Authentication containerStyle={styles.container} userLogin={login} userRegisteration={register} loading={loadingUser} />
			</MainPage>
		);
	}
	return (
		<MainPage user={user} errorMessage={errorMessage} >
			<Router
				user={user}
				logout={logout}
				messages={messages}
				likeMessage={likeMessage}
				deleteMessage={deleteMessage}
				loadingMessages={loadingMessages}
				getMessages={getMessages}
				addMessage={addMessage}
				location={location}
				changeLocation={changeLocation}
				errorMessage
			/>
		</MainPage>
	);
};

const MainPage = ({ user, errorMessage, children }) => (
	<View style={styles.container}>
		<Header user={user} errorMessage={errorMessage} />
		{children}
	</View>
);

const Header = ({ user, errorMessage }) => (
	<View>
		<AppBar user={user} />
		<ErrorScreen errorMessage={errorMessage} />
	</View>
);

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		flexGrow: 1,
		flexShrink: 1,
		backgroundColor: "#F0EAD6"
	},
});

export default Main;
