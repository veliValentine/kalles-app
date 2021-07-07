const { calculateDistance } = require('../utils/distance');
const { isLocationObject } = require('../utils/validators');

const Message = require('../models/message');

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

const requestContainsValidLocation = (req) => {
  const location = getQueryLocation(req);
  return isLocationObject(location);
};

const getQueryLocation = (req) => {
  const { latitude, longitude } = req.query;
  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };
};

const addDistance = (message, location) => ({
  ...message,
  distance: calculateDistance(location, message.location),
});

module.exports = {
  getAllMessages,
};
