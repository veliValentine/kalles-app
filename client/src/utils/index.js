import LocationError from "../models/error/LocationError";

export const YELLOW_MESSAGE_THRESHOLD = 15;
export const READABLE_TRESHOLD = 0.01;
export const isReadable = (distance = READABLE_TRESHOLD) => distance < READABLE_TRESHOLD;

export const parseLocation = (location, fileLocation = "no file location given") => {
	if (!location) {
		throw new LocationError(`No location available - ${fileLocation}`);
	}
	const { latitude, longitude } = location;
	if (!latitude || !longitude) {
		throw new LocationError(`Invalid location - ${fileLocation}`);
	}
	return { latitude, longitude };
};

export const readableDistance = (distance) => {
	if (distance >= 1.0) return `${distance}km`;
	return `${Math.round(distance * 1000)} meters`;
};

export const readableTime = (time = new Date()) => {
	const timeStamp = new Date(time);
	const date = timeStamp.toDateString();
	const hours = timeStamp.getHours();
	const minutes = timeStamp.getMinutes();
	return `${date} ${hours}:${doubleDigits(minutes)}`;
};

export const calculateDistance = (coor1, coor2) => {
	const { latitude: lat1, longitude: long1 } = coor1;
	const { latitude: lat2, longitude: long2 } = coor2;
	const dLat = deg2rad(lat1 - lat2);
	const dLong = deg2rad(long1 - long2);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = 6371 * c;
	return round100(d);
};

const deg2rad = (deg) => deg * (Math.PI / 180);

const round100 = (number) => Math.round(number * 100) / 100;

export const doubleDigits = (value) => {
	if (typeof value !== "number") throw new TypeError("Not a number");
	if (value >= 0) {
		if (value < 10) {
			return `0${value}`;
		}
		return value;
	}
	throw new Error(`Value less than 0. Value: ${value}`);
};
