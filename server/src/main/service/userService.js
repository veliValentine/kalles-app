const User = require("../models/user");
const { toJson } = require("./serviceHelpers");

const findUserById = async (id) => {
	const user = await User.findOne({ id });
	if (user) return toJson(user);
	return null;
};

module.exports = {
	findUserById,
};
