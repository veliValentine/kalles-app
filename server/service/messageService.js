const BadRequestError = require('../models/errors/badRequestError');
const NotFoundError = require('../models/errors/notFoundError');
const Message = require('../models/message');
const {
  getQueryLocation,
  addDistance,
  requestContainsValidLocation,
  toJson,
  getRequestMessage,
} = require('./serviceHelpers');

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
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError('No id given');
  }
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
  const newMessage = getRequestMessage(req);
  const savedMessage = await newMessage.save();
  return toJson(savedMessage);
};

module.exports = {
  getAllMessages,
  findMessageById,
  saveMessage,
};
