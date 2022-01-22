const timeStamp = (hourOffset = 0) => {
	const date = new Date();
	date.setHours(date.getHours() + hourOffset);
	date.setMilliseconds(0);
	return date;
};

module.exports = {
	timeStamp,
};
