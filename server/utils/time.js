const currentTimeStamp = (hourOffset = 0) => {
  const date = new Date();
  date.setHours(date.getHours() + hourOffset);
  return date;
};

module.exports = {
  currentTimeStamp,
};
