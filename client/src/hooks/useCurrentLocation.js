import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils';

const DISTANCE_THRESHOLD = 0.01;

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLocation(coords);
    });
  };

  const setLocation = ({ latitude, longitude }) => {
    if (latitude && longitude) {
      setCurrentLocation({ latitude, longitude });
    }
  };

  const updateLocation = ({ latitude, longitude }) => {
    const newLocation = { latitude, longitude };
    const distance = calculateDistance(newLocation, currentLocation);
    if (longitude && latitude && distance > DISTANCE_THRESHOLD) {
      setCurrentLocation(newLocation);
    }
  };

  return [currentLocation, fetchCurrentLocation, updateLocation];
};

export default useCurrentLocation;
