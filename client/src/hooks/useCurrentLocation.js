import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils';

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

  const updateLocation = ({ longitude, latitude }) => {
    const newLocation = { longitude, latitude };
    const distance = calculateDistance(newLocation, currentLocation);
    if (longitude && latitude && distance > 0.01) {
      setCurrentLocation(newLocation);
    }
  };

  return [currentLocation, fetchCurrentLocation, updateLocation];
};

export default useCurrentLocation;
