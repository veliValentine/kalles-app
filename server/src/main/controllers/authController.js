const authController = require("express").Router();
const asyncHandler = require("express-async-handler");
const BadRequestError = require("../models/errors/badRequestError");
const NotFoundError = require("../models/errors/notFoundError");
const firebaseService = require("../service/firebaseService");

authController.post("/login", asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) throw new BadRequestError("Missing email or password");
	const token = await firebaseService.getAccessToken(email, password);
	if (!token) throw new NotFoundError(`User with email ${email} not found!`);
	const bearer = `Bearer ${token}`;
	res.status(200).json({ token, bearer });
}));

module.exports = authController;
