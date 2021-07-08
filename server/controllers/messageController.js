const messageRouter = require('express').Router();
const { timeStamp } = require('../utils/time');
const { biggestId } = require('../utils/utils');
const { isString, isLocationObject } = require('../utils/validators');

const { getAllMessages, findMessageById } = require('../service/messageService');
const { handleError400, handleError404 } = require('./controllerHelpers');

/*
const messages = Message.find({}).then((r) => console.log(r));
console.log({ messages });

const m = new Message({
  username: 'testUser1',
  message: 'im a message',
  location: {
    latitude: 60.171712519065174,
    longitude: 24.94059522394236,
  },
});
m.save().then((r) => console.log(`message saved: ${r.toJSON()}`))
  .catch((r) => console.log(`error saving message: ${r}`));
*/
let MESSAGES_DATA = [];

messageRouter.get('/', async (req, res) => {
  const messages = await getAllMessages(req);
  return res.status(200).json(messages);
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
  const id = `${biggestId(MESSAGES_DATA.map((m) => m.id)) + 1}`;
  const baseMessage = {
    id,
    message,
    username,
    location: {
      latitude,
      longitude,
    },
    created: timeStamp(),
    expires: timeStamp(24),
    likes: 0,
  };
  MESSAGES_DATA = MESSAGES_DATA.concat(baseMessage);
  const newMessage = {
    ...baseMessage,
    distance: 0,
  };
  return res.status(201).json(newMessage);
});

messageRouter.get('/:id', async (req, res) => {
  try {
    const message = await findMessageById(req);
    return res.status(200).json(message);
  } catch (error) {
    if (error instanceof Error) {
      return handleError404(res, error.message);
    }
    throw error;
  }
});

module.exports = messageRouter;
