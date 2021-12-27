const authorizationService = require("./authorizationService");
const firebaseService = require("./firebaseService");
const userService = require("./userService");

const UnauthorizedError = require("../models/errors/unauthorizedError");
const ForbiddenError = require("../models/errors/forbiddenError");

const getLoggedUser = async (req) => {
	const { authorization } = req.headers;
	if (!authorization) return null;
	const jwtToken = await authorizationService.getJwtToken(authorization);
	if (!jwtToken) return null;
	const userId = await firebaseService.getUserUid(jwtToken);
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
