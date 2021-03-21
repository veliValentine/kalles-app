const messageRouter = require('express').Router();

const messages = [
  {
    id: '0',
    text: 'Hello Helsinki',
    location: {
      latitude: 60.171712519065174,
      longitude: 24.94059522394236
    },
    username: 'Helsinki',
  },
  {
    id: '1',
    text: 'Hello Kumpula',
    location: {
      latitude: 60.2058235648218,
      longitude: 24.963834277842142
    },
    username: 'Kumpula',
  },
  {
    id: '2',
    text: 'Hello Viikki',
    location: {
      latitude: 60.22773733793554,
      longitude: 25.014474383948446
    },
    username: 'Testuser 3',
  },
];

messageRouter.get('/', (_req, res) => {
  res.json(messages);
});

module.exports = messageRouter;
