const userRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const userService = require("../service/userService");
const serviceHelper = require("../service/serviceHelpers");
const BadRequestError = require("../models/errors/badRequestError");
const NotFoundError = require("../models/errors/notFoundError");

const { toJson } = require("../service/serviceHelpers");

userRouter.get("/", asyncHandler(async (_req, res) => {
	const users = await userService.getAllUsers();
	res.status(200).json(toJson(users));
}));

userRouter.post("/", asyncHandler(async (req, res) => {
	const user = userService.validateUser(req.body, req.id);
	const savedUser = await userService.saveUser(user);
	res.status(201).json(toJson(savedUser));
}));

userRouter.get("/:id", asyncHandler(async (req, res) => {
	const id = serviceHelper.getRequestId(req);
	if (!id) throw new BadRequestError(getNoIdGivenMessage());
	const user = await userService.findUserById(id);
	if (!user) throw new NotFoundError(getUserNotFoundMessage(id));
	res.status(200).json(toJson(user));
}));

userRouter.get("/:id/messages", asyncHandler(async (req, res) => {
	const id = serviceHelper.getRequestId(req);
	if (!id) throw new BadRequestError(getNoIdGivenMessage());
	const messages = await userService.getUsersMessages(id);
	if (!messages) throw new NotFoundError(getUserNotFoundMessage(id));
	res.status(200).json(toJson(messages));
}));

userRouter.get("/:id/liked", asyncHandler(async (req, res) => {
	const id = serviceHelper.getRequestId(req);
	if (!id) throw new BadRequestError(getNoIdGivenMessage());
	const messages = await userService.getUsersLikedMessages(id);
	if (!messages) throw new NotFoundError(getUserNotFoundMessage(id));
	res.status(200).json(toJson(messages));
}));

const getNoIdGivenMessage = () => "No id given";

const getUserNotFoundMessage = (id) => `User with id: ${id} not found`;

module.exports = userRouter;
