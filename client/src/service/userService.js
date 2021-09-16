export const addLikeToUser = (user = throwUndefined(), messageId = throwUndefined()) => {
	const likedMessages = getUserLikedMessages(user);
	likedMessages.push(messageId);
	return {
		...user,
		likedMessages
	};
};

export const userAlreadyLikesMessage = (user = throwUndefined(), messageId = throwUndefined()) => {
	const likedMessages = getUserLikedMessages(user);
	return likedMessages.includes(messageId);
};

export const getUserLikedMessages = (user = throwUndefined()) => (user.likedMessages ? user.likedMessages : []);

const throwUndefined = () => { throw new Error('Undefined'); };