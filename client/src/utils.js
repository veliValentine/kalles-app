export const sortByDistances = (item1, item2) => item1.dist - item2.dist;

export const filterByDistances = (arr, dist) => arr.filter(item => item.dist < dist);

export const getCurrentPosition = () => {
  const poo = navigator.geolocation.getCurrentPosition((response) => {
    console.log('response.coords', response.coords);
    const { latitude, longitude } = response.coords;
    return { latitude, longitude };
  });

  console.log('poo', poo);
};
