const authorizationService = require("./authorizationService");
const firebaseService = require("./firebaseService");
const userService = require("./userService");

const getLoggedUser = async (req) => {
	const { authorization } = req.headers;
	const jwtToken = await authorizationService.getJwtToken(authorization);
	if (!jwtToken) return null;
	const userId = await firebaseService.getUserUid(jwtToken);
	const user = await userService.findUserById(userId);
	return user;
};

const isAdmin = (user) => {
	const { isAdmin: userIsAdmin } = user;
	return userIsAdmin;
};

const userOwnsMessage = (user, message) => {
	const { user: messageUser } = message;
	return user.id === messageUser.id;
};

module.exports = {
	getLoggedUser,
	isAdmin,
	userOwnsMessage,
};
