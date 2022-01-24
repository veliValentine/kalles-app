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

	if (loadingLocation || !location) return <LoadingScreen message={"Loading location..."} />;
	if (loadingMessages && !messages) return <LoadingScreen message={"Loading messages..."} />;

	if (!location) return <LoadingScreen message={"No location available"} />;

	const errorMessage = userError || messageError || null;

	return (
		<View style={styles.container}>
			<AppBar user={user} />
			<ErrorScreen errorMessage={errorMessage} />
			{!user ?
				<Authentication containerStyle={styles.container} userLogin={login} userRegisteration={register} loading={loadingUser} /> :
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
			}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		flexGrow: 1,
		flexShrink: 1,
		backgroundColor: "#F0EAD6"
	},
});

export default Main;
