const User = require("../models/user");
const { toJson } = require("./serviceHelpers");

const getAllUsers = async () => {
	const users = await User.find({});
	if (users) return users.map((user) => toJson(user));
	return [];
};

const findUserById = async (id) => {
	const user = await User.findOne({ id });
	if (user) return toJson(user);
	return null;
};

module.exports = {
	getAllUsers,
	findUserById,
};
