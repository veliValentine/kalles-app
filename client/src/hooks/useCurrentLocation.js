import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils';
import * as Location from 'expo-location';

const DISTANCE_THRESHOLD_KM = 0.01;

const useCurrentLocation = () => {
  const [location, setLocation] = useState();

  useEffect(() => {
    watchLocation();
  }, []);

  const watchLocation = async () => {
    const callBack = (expoLocation) => validateLocation(expoLocation.coords);
    const options = {
      timeInterval: 1000,
      distanceInterval: DISTANCE_THRESHOLD_KM * 1000,
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

  return [location, updateLocation];
};

export default useCurrentLocation;
