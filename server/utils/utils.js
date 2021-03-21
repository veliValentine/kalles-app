const deg2rad = (deg) => deg * (Math.PI / 180);

const round100 = (number) => Math.round(number * 100) / 100;

module.exports = {
  deg2rad,
  round100,
};
