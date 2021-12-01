const { calculateDistance } = require("../utils/distance");
const { round100 } = require("../utils/utils");

describe("testing distance", () => {
	const zeroCoordinates = {
		latitude: 0.00,
		longitude: 0.00,
	};

	const northPole = {
		latitude: 90.00,
		longitude: 0.00,
	};

	const southPole = {
		latitude: -90.00,
		longitude: 0.00,
	};

	const earthCircumference = 2 * Math.PI * 6371;

	test("same coordinates", () => {
		expect(calculateDistance(zeroCoordinates, zeroCoordinates)).toBe(0);
	});

	test("distance from equator to poles", () => {
		const distanceFromEquatorToPole = round100(earthCircumference / 4);
		expect(calculateDistance(northPole, zeroCoordinates)).toBe(distanceFromEquatorToPole);
		expect(calculateDistance(southPole, zeroCoordinates)).toBe(distanceFromEquatorToPole);
	});

	test("from other end of the word", () => {
		const coor1 = {
			latitude: 0,
			longitude: 180,
		};
		const halfCircumference = round100(earthCircumference / 2);
		expect(calculateDistance(coor1, zeroCoordinates)).toBe(halfCircumference);
		expect(calculateDistance(northPole, southPole)).toBe(halfCircumference);
	});

	test("shortest path at poles", () => {
		const coor1 = {
			latitude: 90,
			longitude: 0,
		};
		const coor2 = {
			latitude: 90,
			longitude: 180,
		};
		expect(calculateDistance(coor1, coor2)).toBe(0);
	});

	test("gives correct distance", () => {
		const coor1 = {
			latitude: 0,
			longitude: 1,
		};
		const coor2 = {
			latitude: 1,
			longitude: 0,
		};
		const coor3 = {
			latitude: -1,
			longitude: 0,
		};
		const oneDegree = round100(earthCircumference / 360);
		expect(calculateDistance(coor1, zeroCoordinates)).toBe(oneDegree);
		expect(calculateDistance(coor2, zeroCoordinates)).toBe(oneDegree);
		expect(calculateDistance(coor2, coor3)).toBe(round100(earthCircumference / 180));
	});
});
