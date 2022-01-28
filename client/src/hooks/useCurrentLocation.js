import { useState, useEffect } from "react";
import { calculateDistance } from "../utils";
import * as Location from "expo-location";
import useLoading from "./useLoading";
import useError from "./useError";

const DISTANCE_THRESHOLD_KM = 0.001;

const useCurrentLocation = () => {
	const [location, setLocation] = useState();
	const [isLoading, startLoading, stopLoading] = useLoading();
	const [errorMessage, updateError] = useError(10);

	useEffect(() => {
		getInitialLocation();
		watchLocation();
	}, []);

	const getInitialLocation = async () => {
		startLoading();
		try {
			const expoLocation = await Location.getLastKnownPositionAsync();
			if (expoLocation && expoLocation.coords) {
				validateLocation(expoLocation.coords);
			}
		} catch (error) {
			updateError("Error getting initial location");
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
		try {
			await Location.watchPositionAsync(options, callBack);
		} catch (error) {
			if (error instanceof Error && error.message === "Location request failed due to unsatisfied device settings.") {
				updateError(error.message);
			} else {
				updateError("Unexpected exeption happened while updating location.");
			}
		}
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
		try {
			const newLocation = { latitude, longitude };
			const distance = calculateDistance(newLocation, location);
			if (longitude && latitude && distance > DISTANCE_THRESHOLD_KM) {
				setLocation(newLocation);
			}
		} catch (error) {
			updateError("Error updating location");
		}
	};

	return [isLoading, errorMessage, location, updateLocation];
};

export default useCurrentLocation;
