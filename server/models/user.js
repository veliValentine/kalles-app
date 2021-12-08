/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		index: true,
		minlength: 1,
	},
	username: {
		type: String,
		required: true,
		trim: true,
		minlength: [3, "Username too short. {VALUE} is too short"],
		maxlength: [30, "Username too long. {VALUE} is too long."],
		match: [/[a-zA-Z0-9]*/, "Username must contain characters and numbers. {VALUE} is not supported."],
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	liked: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

userSchema.set("toJSON", {
	transform: (_document, returnedObject) => {
		delete returnedObject._id;
		delete returnedObject.__v;
		if (!returnedObject.isAdmin) {
			delete returnedObject.isAdmin;
		}
	},
});

module.exports = mongoose.model("User", userSchema);
