import { useState, useEffect } from 'react';

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { longitude, latitude } = coords;
      setCurrentLocation({
        longitude,
        latitude
      });
    });
  };

  return [currentLocation, fetchCurrentLocation];

};

export default useCurrentLocation;
