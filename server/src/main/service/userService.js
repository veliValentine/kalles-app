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

const getUsersMessages = async (id) => {
	const user = await findUserById(id);
	if (!user) return null;
	const { messages } = await User
		.findOne({ id })
		.populate("messages");
	return messages || [];
};

module.exports = {
	getAllUsers,
	findUserById,
	getUsersMessages,
};
