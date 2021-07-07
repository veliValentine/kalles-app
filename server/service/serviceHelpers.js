const { calculateDistance } = require('../utils/distance');
const { isLocationObject } = require('../utils/validators');

const requestContainsValidLocation = (req) => {
  const location = getQueryLocation(req);
  return isLocationObject(location);
};

const getQueryLocation = (req) => {
  const { latitude, longitude } = req.query;
  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };
};

const addDistance = (message, location) => ({
  ...message,
  distance: calculateDistance(location, message.location),
});

module.exports = {
  requestContainsValidLocation,
  getQueryLocation,
  addDistance,
};
