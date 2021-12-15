const NotFoundError = require("../models/errors/notFoundError");
const Message = require("../models/message");
const userService = require("./userService");
const serviceHelpers = require("./serviceHelpers");

const getAllMessages = (req) => {
	if (!serviceHelpers.requestContainsValidLocation(req)) {
		return getAllMongoMessages();
	}
	return getAllMongoMessagesDistance(req);
};

const getAllMongoMessages = async () => {
	const messages = await Message.find({});
	return messages;
};

const getAllMongoMessagesDistance = async (req) => {
	const messages = await getAllMongoMessages();
	const location = serviceHelpers.getQueryLocation(req);
	const messagesWithDistance = messages.map((message) => (
		serviceHelpers.addDistance(message, location)));
	return messagesWithDistance;
};

const findMessageById = async (req) => {
	const id = serviceHelpers.getRequestId(req);
	const message = await Message.findById(id);
	if (!message) {
		throw new NotFoundError(`Message with id: ${id} not found`);
	}
	if (!serviceHelpers.requestContainsValidLocation(req)) {
		return message;
	}
	return serviceHelpers.addDistance(message, serviceHelpers.getQueryLocation(req));
};

const saveMessage = async (req) => {
	const userId = serviceHelpers.getLoggedUserId(req);
	const userMongoId = await userService.getLoggedUserMongoId(userId);
	const requestMessage = serviceHelpers.getRequestMessage(req);
	const newMessage = new Message({ ...requestMessage, user: userMongoId });
	const savedMessage = await newMessage.save();
	userService.saveMessageToUser(userId, savedMessage);
	savedMessage.distance = 0;
	return savedMessage;
};

const deleteMessageById = async (req) => {
	const id = serviceHelpers.getRequestId(req);
	const message = await findMessageById(req);
	if (!message) throw new NotFoundError(`Message with id:${id} not found`);
	userService.deleteMessageFromUser(message);
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
	const likedMessage = {
		...message,
		likes: message.likes.concat(userMongoId),
	};
	const savedMessage = await Message.findByIdAndUpdate(messageId, likedMessage, { new: true });
	userService.addLikedMessageToUser(userId, savedMessage);
	if (!serviceHelpers.requestContainsValidLocation(req)) {
		return savedMessage;
	}
	const location = serviceHelpers.getQueryLocation(req);
	return serviceHelpers.addDistance(savedMessage, location);
};

const getMessageMongoId = ({ _id: messageId }) => messageId;

module.exports = {
	getAllMessages,
	findMessageById,
	saveMessage,
	deleteMessageById,
	messageWithIdExists,
	likeMessage,
	getMessageMongoId,
};
