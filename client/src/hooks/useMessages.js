import { useState, useEffect } from 'react';
import { fetchMessages, postMessage } from '../service/messageService';
import { sortByDistances } from '../utils/arrayHelpers';
import { handleError } from '../utils/errors';

const useMessages = (currentLocation, user) => {
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

	return [messages, getMessages, addMessage];
};

export default useMessages;
