const mongoose = require("mongoose");
const { MESSAGE_EXPIRES_TIME_MINUTES } = require("../utils/config");
const { timeStamp } = require("../utils/time");

const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
	createDay: {
		type: Date,
		default: timeStamp(),
		required: true,
	},
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	message: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	location: {
		latitude: {
			type: Number,
			required: true,
			min: -90,
			max: 90,
		},
		longitude: {
			type: Number,
			required: true,
			min: -180,
			max: 180,
		},
	},
});

messageSchema.index({ createDay: 1 }, { expireAfterSeconds: MESSAGE_EXPIRES_TIME_MINUTES });

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
messageSchema.set("toJSON", {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		returnedObject.createDay = returnedObject.createDay.toString();
		returnedObject.likes = returnedObject.likes.length;

		delete returnedObject.user;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Message", messageSchema);
