const messageRouter = require('express').Router();
const asyncHandler = require('express-async-handler');

const { getAllMessages, findMessageById, saveMessage } = require('../service/messageService');

messageRouter.get('/', asyncHandler(async (req, res) => {
  const messages = await getAllMessages(req);
  return res.status(200).json(messages);
}));

messageRouter.post('/', asyncHandler(async (req, res) => {
  const savedMessage = await saveMessage(req);
  return res.status(201).json(savedMessage);
}));

messageRouter.get('/:id', asyncHandler(async (req, res) => {
  const message = await findMessageById(req);
  return res.status(200).json(message);
}));

module.exports = messageRouter;
