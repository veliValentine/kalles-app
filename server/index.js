const http = require("http");
const app = require("./src/main/app");
const { PORT } = require("./src/main/utils/config");

const logger = require("./src/main/utils/logger");

const server = http.createServer(app);

server.listen(PORT, () => {
	logger.logConsole(`Server running on port: ${PORT}`);
});
