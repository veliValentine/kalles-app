const User = require("../models/user");
const BadRequestError = require("../models/errors/badRequestError");
const { toJson } = require("./serviceHelpers");
const { isString } = require("../utils/validators");

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

const getUsersLikedMessages = async (id) => {
	const user = await findUserById(id);
	if (!user) return null;
	const { liked } = await User
		.findOne({ id })
		.populate("liked");
	return liked || [];
};

const validateUser = (user = {}, id = null) => {
	const { username } = user;
	validateUsername(username);
	validateId(id);
	return { username, id };
};

const validateUsername = (username) => {
	if (!username) throw new BadRequestError("No username given");
	if (!isString(username)) throw new BadRequestError("Username must be a string");
	if (username.length < 3) throw new BadRequestError("Username is too short");
	if (username.length > 30) throw new BadRequestError("Username is too long");
};

const validateId = (id) => {
	if (!id) throw new BadRequestError("No id given");
	if (!isString(id)) throw new BadRequestError("Id must be a string");
};

const saveUser = async (inputUser) => {
	const user = new User(inputUser);
	const savedUser = await user.save();
	return toJson(savedUser);
};

module.exports = {
	getAllUsers,
	findUserById,
	getUsersMessages,
	getUsersLikedMessages,
	validateUser,
	saveUser,
};
