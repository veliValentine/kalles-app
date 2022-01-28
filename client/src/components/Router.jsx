import React from "react";
import { Redirect, Route, Switch } from "react-router-native";
import { MAP_PAGE } from "../service/navigationService";
import MapPage from "./MapPage";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";
import UserInfoPage from "./UserInfoPage";

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

export default Router;
