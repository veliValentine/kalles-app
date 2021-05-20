export const sortByDistances = (item1, item2) => item1.distance - item2.distance;

export const filterByDistances = (arr, dist) => arr.filter((item) => item.distance < dist);
