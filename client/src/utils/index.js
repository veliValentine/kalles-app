export const YELLOW_MESSAGE_THRESHOLD = 15;
export const READABLE_TRESHOLD = 0.1;
export const isReadable = (distance = READABLE_TRESHOLD) => distance < READABLE_TRESHOLD;

export const parseLocation = (location, fileLocation = 'no file location given') => {
  if (!location) {
    throw new Error(`No location available - ${fileLocation}`);
  }
  const { latitude, longitude } = location;
  if (!latitude || !longitude) {
    throw new Error(`Invalid location - ${fileLocation}`);
  }
  return { latitude, longitude };
};

export const calculateDistance = (coor1, coor2) => {
  const { latitude: lat1, longitude: long1 } = coor1;
  const { latitude: lat2, longitude: long2 } = coor2;
  const dLat = deg2rad(lat1 - lat2);
  const dLong = deg2rad(long1 - long2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = 6371 * c;
  return round100(d);
};

const deg2rad = (deg) => deg * (Math.PI / 180);

const round100 = (number) => Math.round(number * 100) / 100;
