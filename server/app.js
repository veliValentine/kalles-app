const express = require('express');
const messageRouter = require('./controllers/messageController');
const app = express();

const V1_ROUTE = '/api/v1'

app.get(`${V1_ROUTE}/health`, (_req, res) => {
  res.send('ok')
});

app.use(`${V1_ROUTE}/messages`, messageRouter)

module.exports = app;
