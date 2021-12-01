const deg2rad = (deg) => deg * (Math.PI / 180);

const round100 = (number) => Math.round(number * 100) / 100;

const biggestId = (array = []) => {
	if (array.length === 0) {
		return 0;
	}
	return Math.max(...array);
};

module.exports = {
	deg2rad,
	round100,
	biggestId,
};
