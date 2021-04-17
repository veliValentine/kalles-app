const express = require('express');
const messageRouter = require('./controllers/messageController');
const utilController = require('./controllers/utilController');

const app = express();

app.use(express.json());

const V1_ROUTE = '/api/v1';

app.use(`${V1_ROUTE}`, utilController);
app.use(`${V1_ROUTE}/messages`, messageRouter);

module.exports = app;
