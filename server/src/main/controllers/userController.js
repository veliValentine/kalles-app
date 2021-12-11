const messageRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const userService = require("../service/userService");
const serviceHelper = require("../service/serviceHelpers");
const BadRequestError = require("../models/errors/badRequestError");
const NotFoundError = require("../models/errors/notFoundError");

messageRouter.get("/", asyncHandler(async (_req, res) => {
	const users = await userService.getAllUsers();
	res.status(200).json(users);
}));

messageRouter.get("/:id", asyncHandler(async (req, res) => {
	const id = serviceHelper.getRequestId(req);
	if (!id) throw new BadRequestError("No id given");
	const user = await userService.findUserById(id);
	if (!user) throw new NotFoundError(`User with id: ${id} not found`);
	res.status(200).json(user);
}));

module.exports = messageRouter;
