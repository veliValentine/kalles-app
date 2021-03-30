const messageRouter = require('express').Router();
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

messageRouter.get('/', (_req, res) => {
  res.json(MESSAGES_DATA);
});

messageRouter.post('/', (req, res) => {
  const { body } = req;
  if (!body) {
    return res.status(400).json('Error: Missing request body');
  }
  const { message, username, location } = body;
  if (!isString(message)) {
    return res.status(400).json('Error: Invalid message');
  }
  if (!isString(username)) {
    return res.status(400).json('Error: Invalid username');
  }
  if (!isLocationObject(location)) {
    return res.status(400).json('Error: Invalid location');
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
  };
  MESSAGES_DATA = MESSAGES_DATA.concat(newMessage);
  return res.status(201).json(newMessage);
});

module.exports = messageRouter;
