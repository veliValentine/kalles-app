const User = require("../models/user");
const BadRequestError = require("../models/errors/badRequestError");
const NotFoundError = require("../models/errors/notFoundError");
const { isString } = require("../utils/validators");
const serviceHelpers = require("./serviceHelpers");

const getAllUsers = async () => {
	const users = await User.find({});
	return users || [];
};

const findUserById = async (id) => {
	const user = await User.findOne({ id });
	return user || null;
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
	return savedUser;
};

const saveMessageToUser = async (userId, message) => {
	const messageId = serviceHelpers.getModelId(message);
	const user = await findUserById(userId);
	user.messages = user.messages.concat(messageId);
	const savedUser = await user.save();
	return savedUser;
};

const deleteMessageFromUser = async (message, userId) => {
	const messageId = serviceHelpers.getModelId(message);
	const user = await findUserById(userId);
	user.messages = user.messages.filter((userMessageId) => userMessageId !== messageId);
	const savedUser = await user.save();
	return savedUser;
};

const addLikedMessageToUser = async (userId, message) => {
	const messageId = serviceHelpers.getModelId(message);
	const user = await findUserById(userId);
	user.liked = user.liked.concat(messageId);
	const savedUser = await user.save();
	return savedUser;
};

const getLoggedUserMongoId = async (userId) => {
	const { _id: mongoId } = await findUserById(userId);
	if (!mongoId) throw NotFoundError(`Ùser with ${userId} not found.`);
	return mongoId;
};

module.exports = {
	getAllUsers,
	findUserById,
	getUsersMessages,
	getUsersLikedMessages,
	validateUser,
	saveUser,
	getLoggedUserMongoId,
	saveMessageToUser,
	deleteMessageFromUser,
	addLikedMessageToUser,
};
