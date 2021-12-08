const messageRouter = require("express").Router();
const asyncHandler = require("express-async-handler");

messageRouter.get("/", asyncHandler(async (req, res) => (
	res.status(518).json({ message: "hello" })
)));

module.exports = messageRouter;
