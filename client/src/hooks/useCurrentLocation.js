import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils';
import * as Location from 'expo-location';

const DISTANCE_THRESHOLD = 0.01;

const useCurrentLocation = () => {
  const [location, setLocation] = useState();

  useEffect(() => {
    (fetchCurrentLocation)();
  }, []);

  const fetchCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location access denied');
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    validateLocation(currentLocation.coords);
  };

  const validateLocation = ({ latitude, longitude }) => {
    if (!longitude || !latitude) {
      return;
    }
    const newLocation = { latitude, longitude };
    if (!location) {
      return setLocation(newLocation);
    }
    const distance = calculateDistance(newLocation, location);
    if (distance > DISTANCE_THRESHOLD) {
      setLocation(newLocation);
    }
  };

  const updateLocation = ({ latitude, longitude }) => {
    const newLocation = { latitude, longitude };
    const distance = calculateDistance(newLocation, location);
    if (longitude && latitude && distance > DISTANCE_THRESHOLD) {
      setLocation(newLocation);
    }
  };

  return [location, fetchCurrentLocation, updateLocation];
};

export default useCurrentLocation;
