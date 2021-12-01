const NotFoundError = require("../models/errors/notFoundError");
const Message = require("../models/message");
const {
	getQueryLocation,
	addDistance,
	requestContainsValidLocation,
	toJson,
	getRequestMessage,
	getRequestId,
} = require("./serviceHelpers");

const getAllMessages = (req) => {
	if (!requestContainsValidLocation(req)) {
		return getAllMongoMessages();
	}
	return getAllMongoMessagesDistance(req);
};

const getAllMongoMessages = async () => {
	const mongoMessages = await Message.find({});
	return mongoMessages.map(toJson);
};

const getAllMongoMessagesDistance = async (req) => {
	const messages = await getAllMongoMessages();
	const location = getQueryLocation(req);
	const messagesWithDistance = messages.map((message) => (
		addDistance(message, location)));
	return messagesWithDistance;
};

const findMessageById = async (req) => {
	const id = getRequestId(req);
	const mongoMessage = await Message.findById(id);
	if (!mongoMessage) {
		throw new NotFoundError(`Message with id: ${id} not found`);
	}
	const message = toJson(mongoMessage);
	if (!requestContainsValidLocation(req)) {
		return message;
	}
	return addDistance(message, getQueryLocation(req));
};

const saveMessage = async (req) => {
	const newMessage = new Message(getRequestMessage(req));
	const savedMessage = await newMessage.save();
	return toJson(savedMessage);
};

const deleteMessageById = async (req) => {
	const id = getRequestId(req);
	const messageFound = await messageWithIdExists(req);
	if (!messageFound) throw new NotFoundError(`Message with id:${id} not found`);
	await Message.findByIdAndDelete(id);
};

const messageWithIdExists = async (req) => {
	const message = await findMessageById(req);
	if (message) return true;
	return false;
};

const likeMessage = async (req) => {
	const id = getRequestId(req);
	const message = await findMessageById(req);
	const likedMessage = { ...message, likes: message.likes + 1 };
	const savedMessage = await Message.findByIdAndUpdate(id, likedMessage, { new: true });
	return savedMessage;
};

module.exports = {
	getAllMessages,
	findMessageById,
	saveMessage,
	deleteMessageById,
	messageWithIdExists,
	likeMessage,
};
