const { deg2rad, round100 } = require('./utils');

const calculateDistance = (coordinate1, coordinate2) => {
  const {
    latitude: latitude1,
    longitude: longitude1,
  } = coordinate1;
  const {
    latitude: latitude2,
    longitude: longitude2,
  } = coordinate2;
  const latitudeDifference = deg2rad(latitude1 - latitude2);
  const longitudeDifference = deg2rad(longitude1 - longitude2);
  const a = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2))
    * Math.sin(longitudeDifference / 2) ** 2;
  const circumference = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = RADIUS * circumference;
  return round100(distance);
};

const RADIUS = 6371;

module.exports = {
  calculateDistance,
};
