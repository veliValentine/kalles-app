import { useState, useEffect } from 'react';

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      updateLocation(coords);
    });
  };

  const updateLocation = ({ longitude, latitude }) => {
    if (longitude && latitude) {
      setCurrentLocation({ longitude, latitude });
    }
  };

  return [currentLocation, fetchCurrentLocation, updateLocation];
};

export default useCurrentLocation;
