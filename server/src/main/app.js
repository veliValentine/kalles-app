const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

morgan.token("request-body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - :request-body"));

require("./mongo");

const firebaseService = require("./service/firebaseService");

firebaseService.initFirebase();

const messageRouter = require("./controllers/messageController");
const utilController = require("./controllers/utilController");

const authorizationTokenMiddleware = require("./middleware/authorizationTokenMiddleware");
const getLoggedUserMiddleware = require("./middleware/getLoggedUserMiddleware");
const endpointNotFound = require("./middleware/endpointNotFound");
const errorMiddleware = require("./middleware/errorMiddleware");

const V1_ROUTE = "/api/v1";

app.use(authorizationTokenMiddleware);
app.use(getLoggedUserMiddleware);

app.use(`${V1_ROUTE}`, utilController);
app.use(`${V1_ROUTE}/messages`, messageRouter);

app.use(endpointNotFound);

app.use(errorMiddleware);

module.exports = app;