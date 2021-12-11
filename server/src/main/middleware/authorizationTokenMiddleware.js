const firebaseService = require("../service/firebaseService");

const authorizationTokenMiddleware = async (req, _res, next) => {
	const { authorization } = req.headers;
	if (isBearerToken(authorization)) {
		const token = authorization.substr(7);
		req.token = token;
		const uid = await firebaseService.getUserUid(token);
		req.id = uid;
	}
	next();
};

const isBearerToken = (token) => token && token.startsWith("Bearer ");

module.exports = authorizationTokenMiddleware;
