const isLocationObject = (locationObject) => {
	if (!locationObject) {
		return false;
	}
	const { latitude, longitude } = locationObject;
	if (!(isNumber(latitude) && isNumber(longitude))) {
		return false;
	}
	if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) {
		return true;
	}
	return false;
};

const isNumber = (input = null) => {
	if (input === null || typeof input !== "number") {
		return false;
	}
	if (Number.isNaN(input)) {
		return false;
	}
	return true;
};

const isString = (input) => {
	if (!input || typeof input !== "string") {
		return false;
	}
	return true;
};

const isArray = (input) => {
	if (!input || !Array.isArray(input)) return false;
	return true;
};

module.exports = {
	isString,
	isNumber,
	isLocationObject,
	isArray,
};
