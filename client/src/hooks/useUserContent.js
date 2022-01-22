import { useEffect, useState } from "react";
import { getUsersLikedMessages, getUsersMessages } from "../service/userService";
import { handleApiErrors } from "../utils/errors";
import useError from "./useError";
import useLoading from "./useLoading";

const useUserContent = (user = null) => {
	const [error, updateError] = useError();
	const [messages, setMessages] = useState([]);
	const [liked, setLiked] = useState([]);
	const [isLoadingMessages, startLoadingMessages, stopLoadingMessages] = useLoading();
	const [isLoadingLikes, startLoadingLikes, stopLoadingLikes] = useLoading();
	const isLoading = isLoadingLikes || isLoadingMessages;

	let timeoutId;
	useEffect(() => {
		timeoutId = setTimeout(getData, 0);
		return () => {
			if (isLoading) {
				clearTimeout(timeoutId);
			}
		};
	}, [user]);

	const getData = () => {
		getUsersMessagesFromServer();
		getLikedMessagesFromServer();
	};

	const getUsersMessagesFromServer = async () => {
		if (isLoggedUser()) {
			startLoadingMessages();
			try {
				const data = await getUsersMessages(user.token, user.id);
				setMessages(data);
			} catch (error) {
				handleApiErrors(error, updateError);
			}
			stopLoadingMessages();
		}
	};

	const getLikedMessagesFromServer = async () => {
		if (isLoggedUser()) {
			startLoadingLikes();
			try {
				const data = await getUsersLikedMessages(user.token, user.id);
				setLiked(data);
			} catch (error) {
				handleApiErrors(error, updateError);
			}
			stopLoadingLikes();
		}
	};

	const isLoggedUser = () => user && user.id && user.token;

	return [isLoading, error, messages, liked, getData];
};

export default useUserContent;