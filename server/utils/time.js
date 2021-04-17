const currentTimeStamp = () => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = date.getMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getMinutes();
  return `${year}/${month}/${day}-${hours}:${minutes}`;
};

module.exports = {
  currentTimeStamp,
};
