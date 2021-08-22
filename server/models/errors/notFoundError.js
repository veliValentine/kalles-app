const RestError = require('./restError');

class NotFoundError extends RestError {
  constructor(message) {
    super(404, `NotFound: ${message}`);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
