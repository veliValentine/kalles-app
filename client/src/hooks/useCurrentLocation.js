import { useState, useEffect } from "react";
import { calculateDistance } from "../utils";
import * as Location from "expo-location";
import useLoading from "./useLoading";

const DISTANCE_THRESHOLD_KM = 0.001;

const useCurrentLocation = () => {
	const [location, setLocation] = useState();
	const [isLoading, startLoading, stopLoading] = useLoading();

	useEffect(() => {
		watchLocation();
	}, []);

	const watchLocation = async () => {
		log("Watch location")
		startLoading();
		const callBack = (expoLocation) => {
			log("callback")
			validateLocation(expoLocation.coords);
			stopLoading();
		};
		const options = {
			timeInterval: 1000,
			distanceInterval: DISTANCE_THRESHOLD_KM * 1000,
			accuracy: Location.Accuracy.High
		};
		await Location.watchPositionAsync(options, callBack);
	};

	const validateLocation = ({ latitude, longitude }) => {
		log("validate location")
		if (!longitude || !latitude) {
			return;
		}
		const newLocation = { latitude, longitude };
		if (!location) {
			return setLocation(newLocation);
		}
		updateLocation(newLocation);
	};

	const updateLocation = ({ latitude, longitude }) => {
		log("update location")
		const newLocation = { latitude, longitude };
		const distance = calculateDistance(newLocation, location);
		log({ distance, bool: distance > DISTANCE_THRESHOLD_KM})
		if (longitude && latitude && distance > DISTANCE_THRESHOLD_KM) {
			setLocation(newLocation);
		}
	};

	return [location, updateLocation, isLoading];
};

const log = (...logs) => {
	if (false) {
		console.log(...logs);
	}
}

export default useCurrentLocation;
