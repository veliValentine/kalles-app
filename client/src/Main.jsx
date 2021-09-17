import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, Route, Switch } from 'react-router-native';
import Constants from 'expo-constants';

import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import AppBar from './components/AppBar';
import Message from './components/Message';
import MapPage from './components/MapPage';
import LoadingScreen from './components/LoadingScreen';
import Login from './components/Login';
import UserInfoPage from './components/UserInfoPage';

import useMessages from './hooks/useMessages';
import useCurrentLocation from './hooks/useCurrentLocation';
import useUser from './hooks/useUser';

const Main = () => {
	const [user, updateUser, removeUser] = useUser();
	const [location, changeLocation, loadingLocation] = useCurrentLocation();
	const [messages, getMessages, addMessage, likeMessage, deleteMessage, loadingMessages] = useMessages(location, user, updateUser);

	if (!user) return <Login containerStyle={styles.container} updateUser={updateUser} />;

	if (loadingLocation || !location) return <LoadingScreen message={'Loading location...'} />;

	if (!location) return <LoadingScreen message={'No location available'} />;

	const reloadMessages = () => getMessages();

	const logout = () => removeUser();

	return (
		<View style={styles.container}>
			<AppBar user={user} />
			<Switch>
				<Route path="/userinfo" exact>
					<UserInfoPage user={user} logout={logout} messages={messages} loadingMessages={loadingMessages} />
				</Route>
				<Route path="/message/:id" exact>
					<Message messages={messages} likeMessage={likeMessage} deleteMessage={deleteMessage} user={user} />
				</Route>
				<Route path="/messages" exact>
					<MessageList messages={messages} loadingMessages={loadingMessages} />
				</Route>
				<Route path="/newMessage">
					<MessageForm addMessage={addMessage} currentLocation={location} />
				</Route>
				<Route path={['/map', '/map/:latitude/:longitude']} exact key="default-map">
					<MapPage
						messages={messages}
						reloadMessages={reloadMessages}
						location={location}
						changeLocation={changeLocation}
					/>
				</Route>
				<Redirect to="/map" />
			</Switch>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		flexGrow: 1,
		flexShrink: 1,
		backgroundColor: '#F0EAD6'
	},
});

export default Main;
