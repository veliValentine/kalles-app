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

import useMessages from './hooks/useMessages';
import useCurrentLocation from './hooks/useCurrentLocation';
import useUser from './hooks/useUser';
import Login from './components/Login';
import UserInfo from './components/UserInfo';

const Main = () => {
	const [user, updateUser, removeUser] = useUser();
	const [location, changeLocation] = useCurrentLocation();
	const [messages, getMessages, addMessage] = useMessages(location, user);

	console.log('user: ', user);

	if (!user) return <Login containerStyle={styles.container} updateUser={updateUser} />;

	if (!location) return <LoadingScreen message={'No location available'} />;

	const reloadMessages = () => getMessages();

	const logout = () => removeUser();

	return (
		<View style={styles.container}>
			<AppBar user={user} />
			<Switch>
				<Route path="/userinfo" exact>
					<UserInfo user={user} logout={logout} />
				</Route>
				<Route path="/message/:id" exact>
					<Message messages={messages} />
				</Route>
				<Route path="/messages" exact>
					<MessageList messages={messages} />
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
