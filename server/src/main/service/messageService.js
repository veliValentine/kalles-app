const NotFoundError = require("../models/errors/notFoundError");
const Message = require("../models/message");
const userService = require("./userService");
const serviceHelpers = require("./serviceHelpers");
const BadRequestError = require("../models/errors/badRequestError");

const getAllMessages = async () => {
	const messages = await Message.find({});
	return messages;
};

const findMessageById = async (req) => {
	const id = serviceHelpers.getRequestId(req);
	const message = await Message.findById(id);
	if (!message) {
		throw new NotFoundError(`Message with id: ${id} not found`);
	}
	return message;
};

const saveMessage = async (req) => {
	const userId = serviceHelpers.getLoggedUserId(req);
	const userMongoId = await userService.getLoggedUserMongoId(userId);
	const requestMessage = serviceHelpers.getRequestMessage(req);
	const newMessage = new Message({ ...requestMessage, user: userMongoId });
	const savedMessage = await newMessage.save();
	await userService.saveMessageToUser(userId, savedMessage);
	return savedMessage;
};

const deleteMessageById = async (req) => {
	const id = serviceHelpers.getRequestId(req);
	const message = await findMessageById(req);
	if (!message) throw new NotFoundError(`Message with id:${id} not found`);
	const userId = serviceHelpers.getLoggedUserId(req);
	userService.deleteMessageFromUser(message, userId);
	await Message.findByIdAndDelete(id);
};

const messageWithIdExists = async (req) => {
	const message = await findMessageById(req);
	if (message) return true;
	return false;
};

const likeMessage = async (req) => {
	const messageId = serviceHelpers.getRequestId(req);
	const message = await findMessageById(req);
	const userId = serviceHelpers.getLoggedUserId(req);
	const userMongoId = await userService.getLoggedUserMongoId(userId);
	const { likes } = message;
	if (likes.includes(userMongoId)) {
		throw new BadRequestError("User already liked this message");
	}
	likes.push(userMongoId);
	message.likes = likes;
	const savedMessage = await Message.findByIdAndUpdate(messageId, message, { new: true });
	await userService.addLikedMessageToUser(userId, savedMessage);
	return savedMessage;
};

const isUsersMesssage = (user, message) => {
	const { _id: userIdObject } = user;
	const userId = userIdObject.toString();
	const { user: messageUserIdObject } = message;
	const messageUserId = messageUserIdObject.toString();
	if (!userId || !messageUserId) return null;
	return userId === messageUserId;
};

module.exports = {
	getAllMessages,
	findMessageById,
	saveMessage,
	deleteMessageById,
	messageWithIdExists,
	likeMessage,
	isUsersMesssage,
};
