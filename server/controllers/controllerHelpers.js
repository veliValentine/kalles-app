const handleError400 = (res, message) => handleErrorStatus(400, res, message);

const handleError404 = (res, message) => handleErrorStatus(404, res, message);

const handleErrorStatus = (status, res, message) => res.status(status).json({ error: message });

module.exports = {
  handleError400,
  handleError404,
};
