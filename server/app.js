const express = require('express');
const morgan = require('morgan');
const messageRouter = require('./controllers/messageController');
const utilController = require('./controllers/utilController');

const app = express();

app.use(express.json());
morgan.token('request-body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :request-body'));

const V1_ROUTE = '/api/v1';

app.use(`${V1_ROUTE}`, utilController);
app.use(`${V1_ROUTE}/messages`, messageRouter);

module.exports = app;
