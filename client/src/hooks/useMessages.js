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
import { handleApiErrors } from "../utils/errors";

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
				handleApiErrors(error, updateError);
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
			handleApiErrors(error, updateError);
		}
	};

	const likeMessage = async (messageId) => {
		try {
			const likedMessage = await serviceLikeMessage(token, messageId, currentLocation);
			const newMessages = messages.map((message) => (message.id === likedMessage.id ? likedMessage : message));
			setMessages(newMessages);
			fetchUser();
		} catch (error) {
			handleApiErrors(error, updateError);
		}
	};

	const deleteMessage = async (messageId) => {
		try {
			await deleteServerMessage(token, messageId);
			const newMessages = messages.filter(({ id }) => id !== messageId);
			setMessages(newMessages);
			fetchUser();
		} catch (error) {
			handleApiErrors(error, updateError);
		}
	};

	return [isLoading, error, messages, getMessages, addMessage, likeMessage, deleteMessage];
};

export default useMessages;
