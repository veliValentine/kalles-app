export const sortByDistances = (item1, item2) => item1.distance - item2.distance;

export const filterByDistances = (arr, dist) => arr.filter(item => item.distance < dist);

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

let timeoutID;
export const redirectToMain = (s, history) => {
  timeoutID = setTimeout(() => {
    clearTimeout(timeoutID);
    history.push('/');
  }, s * 1000);
};
