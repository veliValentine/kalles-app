import { useState, useEffect } from "react";
import { calculateDistance } from "../utils";
import * as Location from "expo-location";
import useLoading from "./useLoading";

const DISTANCE_THRESHOLD_KM = 0.001;

const useCurrentLocation = () => {
	const [location, setLocation] = useState();
	const [isLoading, startLoading, stopLoading] = useLoading();

	useEffect(() => {
		getInitialLocation();
		watchLocation();
	}, []);

	const getInitialLocation = async () => {
		startLoading();
		const expoLocation = await Location.getLastKnownPositionAsync();
		if (expoLocation && expoLocation.coords) {
			validateLocation(expoLocation.coords);
		}
		stopLoading();
	};

	const watchLocation = async () => {
		startLoading();
		const callBack = (expoLocation) => {
			if (expoLocation && expoLocation.coords) {
				validateLocation(expoLocation.coords);
			}
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
		const newLocation = { latitude, longitude };
		const distance = calculateDistance(newLocation, location);
		if (longitude && latitude && distance > DISTANCE_THRESHOLD_KM) {
			setLocation(newLocation);
		}
	};

	return [location, updateLocation, isLoading];
};

export default useCurrentLocation;
