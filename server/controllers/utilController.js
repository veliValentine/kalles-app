const utilController = require('express').Router();

utilController.get('/health', (_req, res) => {
  res.send('ok');
});

module.exports = utilController;
