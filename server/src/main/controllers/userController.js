const messageRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const userService = require("../service/userService");

messageRouter.get("/", asyncHandler(async (_req, res) => {
	const users = await userService.getAllUsers();
	res.status(200).json(users);
}));

module.exports = messageRouter;
