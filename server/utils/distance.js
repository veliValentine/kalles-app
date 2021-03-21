const { deg2rad, round100 } = require('./utils');

const calculateDistance = (coor1, coor2) => {
  const { latitude: lat1, longitude: long1 } = coor1;
  const { latitude: lat2, longitude: long2 } = coor2;
  const dLat = deg2rad(lat1 - lat2);
  const dLong = deg2rad(long1 - long2);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
    * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = 6371 * c;
  return round100(d);
};

module.exports = {
  calculateDistance,
};
