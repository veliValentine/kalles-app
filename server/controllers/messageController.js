const messageRouter = require('express').Router();
const asyncHandler = require('express-async-handler');

const {
  getAllMessages,
  findMessageById,
  saveMessage,
  deleteMessageById,
  likeMessage,
} = require('../service/messageService');

messageRouter.get('/', asyncHandler(async (req, res) => {
  const messages = await getAllMessages(req);
  return res.status(200).json(messages);
}));

messageRouter.post('/', asyncHandler(async (req, res) => {
  const savedMessage = await saveMessage(req);
  return res.status(201).json({ ...savedMessage, distance: 0 });
}));

messageRouter.get('/:id', asyncHandler(async (req, res) => {
  const message = await findMessageById(req);
  return res.status(200).json(message);
}));

messageRouter.delete('/:id', asyncHandler(async (req, res) => {
  await deleteMessageById(req);
  return res.status(204).end();
}));

messageRouter.post('/:id/like', asyncHandler(async (req, res) => {
  const likedMessage = await likeMessage(req);
  return res.status(200).json(likedMessage);
}));

module.exports = messageRouter;
