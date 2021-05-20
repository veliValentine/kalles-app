export const handleError = (e, message) => {
  console.log(message);
  if (e instanceof Error) {
    console.log(e.message);
    return;
  }
  console.log('Error thrown');
  throw e;
};
