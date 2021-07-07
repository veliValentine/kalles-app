const Message = require('../models/message');
const { getQueryLocation, addDistance, requestContainsValidLocation } = require('./serviceHelpers');

const getAllMessages = (req) => {
  if (!requestContainsValidLocation(req)) {
    return getAllMongoMessages();
  }
  return getAllMongoMessagesDistance(req);
};

const findMessageById = async (req) => {
  const { id } = req.params;
  if (!id) {
    throw new Error('No id given');
  }
  const messages = await getAllMessages(req);
  return messages.find((message) => message.id === id);
};

const getAllMongoMessages = async () => {
  const mongoMessages = await Message.find({});
  return mongoMessages.map((message) => message.toJSON());
};

const getAllMongoMessagesDistance = async (req) => {
  const messages = await getAllMongoMessages();
  const location = getQueryLocation(req);
  const messagesWithDistance = messages.map((message) => (
    addDistance(message, location)));
  return messagesWithDistance;
};

module.exports = {
  getAllMessages,
  findMessageById,
};
