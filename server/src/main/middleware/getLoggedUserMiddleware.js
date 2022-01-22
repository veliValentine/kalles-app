const { findUserById } = require("../service/userService");

const getLoggedUserMiddleware = async (req, _res, next) => {
	const { id } = req;
	if (id) {
		const loggedUser = await findUserById(id);
		req.user = loggedUser;
	}
	next();
};

module.exports = getLoggedUserMiddleware;
