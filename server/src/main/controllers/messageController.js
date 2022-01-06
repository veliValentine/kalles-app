const messageRouter = require("express").Router();
const asyncHandler = require("express-async-handler");

const messageService = require("../service/messageService");
const serviceHelpers = require("../service/serviceHelpers");
const authenticationService = require("../service/authenticationService");

messageRouter.get("/", asyncHandler(async (req, res) => {
	const loggedUser = await authenticationService.getLoggedUser(req);
	authenticationService.userIsAuthenticated(loggedUser);

	const requestContainsValidLocation = serviceHelpers.requestContainsValidLocation(req);
	if (!requestContainsValidLocation) {
		authenticationService.userIsAdmin(loggedUser);
	}

	const messages = await messageService.getAllMessages();
	const returnMessages = serviceHelpers.toJson(messages);
	if (requestContainsValidLocation) {
		const location = serviceHelpers.getQueryLocation(req);
		const returnMessagesWithDistance = returnMessages.map((message) => (
			serviceHelpers.addDistance(message, location)));
		return res.status(200).json(returnMessagesWithDistance);
	}
	return res.status(200).json(returnMessages);
}));

messageRouter.post("/", asyncHandler(async (req, res) => {
	const loggedUser = await authenticationService.getLoggedUser(req);
	authenticationService.userIsAuthenticated(loggedUser);

	const savedMessage = await messageService.saveMessage(req);
	const returnMessage = serviceHelpers.toJson(savedMessage);
	returnMessage.distance = 0;
	return res.status(201).json(returnMessage);
}));

messageRouter.get("/:id", asyncHandler(async (req, res) => {
	const loggedUser = await authenticationService.getLoggedUser(req);
	authenticationService.userIsAuthenticated(loggedUser);

	const requestContainsValidLocation = serviceHelpers.requestContainsValidLocation(req);
	if (!requestContainsValidLocation) {
		authenticationService.userIsAdmin(loggedUser);
	}

	const message = await messageService.findMessageById(req);
	const returnMessage = serviceHelpers.toJson(message);
	if (serviceHelpers.requestContainsValidLocation(req)) {
		const location = serviceHelpers.getQueryLocation(req);
		const returnedMessageWithDistance = serviceHelpers.addDistance(returnMessage, location);
		return res.status(200).json(returnedMessageWithDistance);
	}
	return res.status(200).json(returnMessage);
}));

messageRouter.delete("/:id", asyncHandler(async (req, res) => {
	const loggedUser = await authenticationService.getLoggedUser(req);
	authenticationService.userIsAuthenticated(loggedUser);

	const message = await messageService.findMessageById(req);

	const isLoggedUsersMessage = messageService.isUsersMesssage(loggedUser, message);
	if (!isLoggedUsersMessage) {
		authenticationService.userIsAdmin(loggedUser);
	}

	await messageService.deleteMessageById(req);
	return res.status(204).end();
}));

messageRouter.post("/:id/like", asyncHandler(async (req, res) => {
	const likedMessage = await messageService.likeMessage(req);
	const returnMessage = serviceHelpers.toJson(likedMessage);
	if (!serviceHelpers.requestContainsValidLocation(req)) {
		return res.status(200).json(returnMessage);
	}
	const location = serviceHelpers.getQueryLocation(req);
	const returnMessageWithDistance = serviceHelpers.addDistance(returnMessage, location);
	return res.status(200).json(returnMessageWithDistance);
}));

module.exports = messageRouter;
