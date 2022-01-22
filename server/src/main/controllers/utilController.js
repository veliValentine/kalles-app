const utilController = require("express").Router();

utilController.get("/health", (_req, res) => {
	res.send("ok").status(200);
});

module.exports = utilController;
