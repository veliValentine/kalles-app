import React from "react";
import { StyleSheet, View } from "react-native";
import { Redirect, Route, Switch } from "react-router-native";
import Constants from "expo-constants";

import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import AppBar from "./components/AppBar";
import Message from "./components/Message";
import MapPage from "./components/MapPage";
import LoadingScreen from "./components/LoadingScreen";
import UserInfoPage from "./components/UserInfoPage";
import ErrorScreen from "./components/ErrorScreen";
import Authentication from "./components/authentication";

import useMessages from "./hooks/useMessages";
import useCurrentLocation from "./hooks/useCurrentLocation";
import useUser from "./hooks/useUser";
import { MAP_PAGE } from "./service/navigationService";

const Main = () => {
	const [loadingUser, userError, user, fetchUser, login, register, logout] = useUser();
	const [location, changeLocation, loadingLocation] = useCurrentLocation();
	const [loadingMessages, messageError, messages, getMessages, addMessage, likeMessage, deleteMessage] = useMessages(location, fetchUser, user);

	const noLocation = !location;

	const errorMessage = userError || messageError || null;

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

const Router = ({
	user,
	logout,
	messages,
	likeMessage,
	deleteMessage,
	loadingMessages,
	getMessages,
	addMessage,
	location,
	changeLocation
}) => (
	<Switch>
		<Route path="/userinfo" exact>
			<UserInfoPage user={user} logout={logout} />
		</Route>
		<Route path="/message/:id" exact>
			<Message messages={messages} likeMessage={likeMessage} deleteMessage={deleteMessage} user={user} />
		</Route>
		<Route path="/messages" exact>
			<MessageList messages={messages} loadingMessages={loadingMessages} getMessages={getMessages} />
		</Route>
		<Route path="/newMessage">
			<MessageForm addMessage={addMessage} currentLocation={location} />
		</Route>
		<Route path={[MAP_PAGE, "/map/:latitude/:longitude"]} exact key="default-map">
			<MapPage
				messages={messages}
				reloadMessages={getMessages}
				location={location}
				changeLocation={changeLocation}
			/>
		</Route>
		<Redirect to={MAP_PAGE} />
	</Switch>
);

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
