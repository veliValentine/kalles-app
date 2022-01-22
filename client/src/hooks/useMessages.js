import { useState, useEffect } from "react";
import useError from "./useError";
import useLoading from "./useLoading";
import {
	deleteMessage as deleteServerMessage,
	getMessages as serviceGetMessages,
	addMessage as serviceAddMessages,
	likeMessage as serviceLikeMessage
} from "../service/messageService";
import { sortByDistances } from "../utils/arrayHelpers";
import LocationError from "../models/error/LocationError";
import ServerError from "../models/error/ServerError";

const useMessages = (currentLocation, fetchUser, user) => {
	const token = user && user.token;
	const [messages, setMessages] = useState([]);
	const [isLoading, startLoading, stopLoading] = useLoading();
	const [error, updateError] = useError();

	useEffect(() => {
		getMessages();
	}, [currentLocation]);

	const getMessages = async () => {
		if (token) {
			startLoading();
			try {
				const messages = await serviceGetMessages(token, currentLocation);
				setMessages(messages.sort(sortByDistances));
			} catch (error) {
				handleError(error);
			}
			stopLoading();
		}
	};

	const addMessage = async (message) => {
		const invalidUser = !user || !user.username || !token;
		if (!currentLocation || invalidUser) return;
		const newMessage = {
			...message,
			location: currentLocation,
			username: user.username,
		};
		try {
			const addedMessage = await serviceAddMessages(token, newMessage);
			setMessages(messages
				.concat(addedMessage)
				.sort(sortByDistances));
			fetchUser();
		} catch (error) {
			handleError(error);
		}
	};

	const likeMessage = async (messageId) => {
		try {
			const likedMessage = await serviceLikeMessage(token, messageId, currentLocation);
			const newMessages = messages.map((message) => (message.id === likedMessage.id ? likedMessage : message));
			setMessages(newMessages);
			fetchUser();
		} catch (error) {
			handleError(error);
		}
	};

	const deleteMessage = async (messageId) => {
		try {
			await deleteServerMessage(token, messageId);
			const newMessages = messages.filter(({ id }) => id !== messageId);
			setMessages(newMessages);
			fetchUser();
		} catch (error) {
			handleError(error);
		}
	};

	const handleError = (error) => {
		if (error instanceof ServerError) {
			return updateError("There was an error with the server");
		}
		if (error instanceof LocationError) {
			return updateError("There was an error with the location");
		}
		console.log(JSON.stringify({
			error: error.name,
			message: error.message,
		}));
		updateError("An unexpected error happened!");
	};

	return [isLoading, error, messages, getMessages, addMessage, likeMessage, deleteMessage];
};

export default useMessages;
