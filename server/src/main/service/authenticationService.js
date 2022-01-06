const userService = require("./userService");

const UnauthorizedError = require("../models/errors/unauthorizedError");
const ForbiddenError = require("../models/errors/forbiddenError");

const getLoggedUser = async (req) => {
	const userId = req.id;
	if (!userId) return null;
	const user = await userService.findUserById(userId);
	return user;
};

const userIsAuthenticated = (user) => {
	if (!user) {
		throw new UnauthorizedError();
	}
};

const userIsAdmin = (user) => {
	if (!user || !user.isAdmin) {
		throw new ForbiddenError();
	}
};

const userOwnsMessage = (user, message) => {
	const { user: messageUser } = message;
	return user.id === messageUser.id;
};

module.exports = {
	getLoggedUser,
	userIsAdmin,
	userOwnsMessage,
	userIsAuthenticated,
};
