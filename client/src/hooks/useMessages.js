import { useState, useEffect } from 'react';
import { fetchMessages, postLike, postMessage } from '../service/messageService';
import { addLikeToUser, getUserLikedMessages, userAlreadyLikesMessage } from '../service/userService';
import { sortByDistances } from '../utils/arrayHelpers';
import { handleError } from '../utils/errors';

const useMessages = (currentLocation, user, updateUser) => {
	const [messages, setMessages] = useState();

	useEffect(() => {
		getMessages();
	}, [currentLocation]);

	const getMessages = async () => {
		const messages = await fetchMessages(currentLocation);
		setMessages(messages.sort(sortByDistances));
	};

	const addMessage = async (message) => {
		if (currentLocation && user && user.username) {
			const newMessage = {
				...message,
				location: currentLocation,
				username: user.username,
			};
			try {
				const addedMessage = await postMessage(newMessage);
				setMessages(messages
					.concat(addedMessage)
					.sort(sortByDistances));
			} catch (e) {
				const errorMessage = handleError(e);
				console.warn(errorMessage);
			}
		}
	};

	const likeMessage = async (messageId) => {
		if (userAlreadyLikesMessage(user, messageId)) return;
		const message = messages.find((message) => message.id === messageId);
		if (!message) return;
		const newLike = await postLike(messageId);
		const likedMessage = {
			...message,
			likes: newLike
		};
		const newMessages = messages.map((message) => (message.id === messageId ? likedMessage : message));
		setMessages(newMessages);
		addUserLike(messageId);
	};

	const addUserLike = (messageId) => {
		const newUser = addLikeToUser(user, messageId);
		updateUser(newUser);
	};

	const deleteMessage = (messageId) => {
		console.log(`deleted message with id ${messageId}`);
	};

	return [messages, getMessages, addMessage, likeMessage, deleteMessage];
};

export default useMessages;
