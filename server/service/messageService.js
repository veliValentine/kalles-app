const Message = require('../models/message');
const { getQueryLocation, addDistance, requestContainsValidLocation } = require('./serviceHelpers');

const getAllMessages = (req) => {
  if (!requestContainsValidLocation(req)) {
    return getAllMongoMessages();
  }
  return getAllMongoMessagesDistance(req);
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
};
