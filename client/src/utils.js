export const sortByDistances = (item1, item2) => item1.dist - item2.dist;

export const filterByDistances = (arr, dist) => arr.filter(item => item.dist < dist);
