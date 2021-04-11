const messageRouter = require('express').Router();
const { calculateDistance } = require('../utils/distance');
const { isTestEnvironment } = require('../utils/environment');
const { currentTimeStamp } = require('../utils/time');
const { biggestId } = require('../utils/utils');
const { isString, isLocationObject } = require('../utils/validators');

let MESSAGES_DATA = isTestEnvironment ? [] : [
  {
    id: '0',
    text: 'Hello Helsinki',
    location: {
      latitude: 60.171712519065174,
      longitude: 24.94059522394236,
    },
    username: 'Helsinki',
  },
  {
    id: '1',
    text: 'Hello Kumpula',
    location: {
      latitude: 60.2058235648218,
      longitude: 24.963834277842142,
    },
    username: 'Kumpula',
  },
  {
    id: '2',
    text: 'Hello Viikki',
    location: {
      latitude: 60.22773733793554,
      longitude: 25.014474383948446,
    },
    username: 'Testuser 3',
  },
];

messageRouter.get('/', (req, res) => {
  const { body = {} } = req;
  const { location = {} } = body;
  if (!isLocationObject(location)) {
    return res.status(200).json(MESSAGES_DATA);
  }
  const messagesWithDistance = MESSAGES_DATA.map((message) => ({
    ...message,
    distance: calculateDistance(location, message.location),
  }));
  return res.json(messagesWithDistance);
});

messageRouter.post('/', (req, res) => {
  const { body } = req;
  if (!body) {
    return handleError400(res, 'Missing request body');
  }
  const { message, username, location } = body;
  if (!isString(message)) {
    return handleError400(res, 'Invalid message');
  }
  if (!isString(username)) {
    return handleError400(res, 'Invalid username');
  }
  if (!isLocationObject(location)) {
    return handleError400(res, 'Invalid location');
  }
  const { latitude, longitude } = location;
  const id = biggestId(MESSAGES_DATA.map((m) => m.id)) + 1;
  const now = currentTimeStamp();
  const newMessage = {
    id,
    message,
    username,
    location: {
      latitude,
      longitude,
    },
    created: now,
    expires: 24,
    likes: 0,
    distance: 0,
  };
  MESSAGES_DATA = MESSAGES_DATA.concat(newMessage);
  return res.status(201).json(newMessage);
});

const handleError400 = (res, message) => res.status(400).json(`Error: ${message}`);

module.exports = messageRouter;
