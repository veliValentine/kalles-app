const messageRouter = require('express').Router();
const { isTestEnvironment } = require('../utils/environment');
const { currentTimeStamp } = require('../utils/time');

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
  const { body = {} } = req;
  const id = Math.max(...MESSAGES_DATA.map((message) => message.id)) + 1;
  const now = currentTimeStamp();
  const message = {
    id,
    ...body,
    created: now,
    likes: 0,
  };
  MESSAGES_DATA = MESSAGES_DATA.concat(message);
  res.status(201).json(message);
});

messageRouter.delete('/test', (_req, res) => {
  if (isTestEnvironment) {
    MESSAGES_DATA = [];
    res.status(204);
  }
});

module.exports = messageRouter;
