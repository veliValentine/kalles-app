import { useState, useEffect } from 'react';
import { deleteMessage as deleteServerMessage, fetchMessages, postLike, postMessage } from '../service/messageService';
import { addLikeToUser, userAlreadyLikesMessage } from '../service/userService';
import { sortByDistances } from '../utils/arrayHelpers';
import { handleError } from '../utils/errors';
import ServerError from '../models/error/ServerError';
import useError from './useError';
import useLoading from './useLoading';

const useMessages = (currentLocation, user, updateUser) => {
	const [messages, setMessages] = useState([]);
	const [isLoading, startLoading, stopLoading] = useLoading();
	const [error, updateError] = useError();

	useEffect(() => {
		getMessages();
	}, [currentLocation]);

	const getMessages = async () => {
		startLoading();
		try {
			const messages = await fetchMessages(currentLocation);
			setMessages(messages.sort(sortByDistances));
		} catch (error) {
			if (error instanceof ServerError) {
				updateError('There was an error with the server');
			}
		}
		stopLoading();
	};

	const addMessage = async (message) => {
		if (!currentLocation || !user || !user.username) return;
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
		updateUser(addLikeToUser(user, messageId));
	};

	const deleteMessage = async (messageId) => {
		const message = messages.find((message) => message.id === messageId);
		if (!message || !messageId) return;
		if (message.username !== user.username) return;
		await deleteServerMessage(messageId);
		const newMessages = messages.filter(({ id }) => id !== messageId);
		setMessages(newMessages);
	};

	return [messages, getMessages, addMessage, likeMessage, deleteMessage, isLoading, error];
};

export default useMessages;
