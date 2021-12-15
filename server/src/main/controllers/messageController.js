const messageRouter = require("express").Router();
const asyncHandler = require("express-async-handler");

const messageService = require("../service/messageService");

const { toJson } = require("../service/serviceHelpers");

messageRouter.get("/", asyncHandler(async (req, res) => {
	const messages = await messageService.getAllMessages(req);
	return res.status(200).json(toJson(messages));
}));

messageRouter.post("/", asyncHandler(async (req, res) => {
	const savedMessage = await messageService.saveMessage(req);
	return res.status(201).json(toJson(savedMessage));
}));

messageRouter.get("/:id", asyncHandler(async (req, res) => {
	const message = await messageService.findMessageById(req);
	return res.status(200).json(toJson(message));
}));

messageRouter.delete("/:id", asyncHandler(async (req, res) => {
	await messageService.deleteMessageById(req);
	return res.status(204).end();
}));

messageRouter.post("/:id/like", asyncHandler(async (req, res) => {
	const likedMessage = await messageService.likeMessage(req);
	return res.status(200).json(toJson(likedMessage));
}));

module.exports = messageRouter;
