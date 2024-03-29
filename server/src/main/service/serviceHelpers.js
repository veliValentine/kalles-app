const BadRequestError = require("../models/errors/badRequestError");
const { calculateDistance } = require("../utils/distance");
const { isLocationObject, isString } = require("../utils/validators");
const validators = require("../utils/validators");

const requestContainsValidLocation = (req) => {
	const location = getQueryLocation(req);
	return isLocationObject(location);
};

const getQueryLocation = (req) => {
	const { latitude, longitude } = req.query;
	return {
		latitude: parseFloat(latitude),
		longitude: parseFloat(longitude),
	};
};

const addDistance = (message, location) => ({
	...message,
	distance: calculateDistance(location, message.location),
});

const getRequestMessage = (req) => {
	const { body } = req;
	const { message, username, location } = body;
	if (!isString(message)) {
		throw new BadRequestError("Invalid message");
	}
	if (!isString(username)) {
		throw new BadRequestError("Invalid username");
	}
	if (!isLocationObject(location)) {
		throw new BadRequestError("Invalid location");
	}
	const { latitude, longitude } = location;
	return {
		message,
		username,
		location: {
			latitude,
			longitude,
		},
	};
};

const getRequestId = (req) => {
	const { id } = req.params;
	if (!id) {
		throw new BadRequestError("No id given");
	}
	return id;
};

const toJson = (model) => {
	if (validators.isArray(model)) {
		return model.map((object) => object.toJSON());
	}
	return model.toJSON();
};

const getLoggedUserId = (req) => req.id;

const getModelId = ({ _id: modelId }) => modelId;

module.exports = {
	requestContainsValidLocation,
	getQueryLocation,
	addDistance,
	getRequestMessage,
	toJson,
	getRequestId,
	getLoggedUserId,
	getModelId,
};
