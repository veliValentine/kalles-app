const express = require("express");
const morgan = require("morgan");
const { isProductionEnvironment } = require("./utils/environment");

const app = express();

app.use(express.json());

morgan.token("request-body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - :request-body"));

require("./mongo");

const firebaseService = require("./service/firebaseService");

const utilController = require("./controllers/utilController");
const messageController = require("./controllers/messageController");
const userController = require("./controllers/userController");
const authController = require("./controllers/authController");

const authorizationTokenMiddleware = require("./middleware/authorizationTokenMiddleware");
const getLoggedUserMiddleware = require("./middleware/getLoggedUserMiddleware");
const endpointNotFound = require("./middleware/endpointNotFound");
const errorMiddleware = require("./middleware/errorMiddleware");

firebaseService.initFirebase();

app.use(authorizationTokenMiddleware);
app.use(getLoggedUserMiddleware);

const V1_ROUTE = "/api/v1";

app.use(`${V1_ROUTE}`, utilController);
app.use(`${V1_ROUTE}/messages`, messageController);
app.use(`${V1_ROUTE}/users`, userController);

if (!isProductionEnvironment) {
	app.use(`${V1_ROUTE}/auth`, authController);
}

app.use(endpointNotFound);

app.use(errorMiddleware);

module.exports = app;
