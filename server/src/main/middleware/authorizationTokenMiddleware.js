const authorizationTokenMiddleware = (req, _res, next) => {
	const { authorization } = req.headers;
	if (isBearerToken(authorization)) {
		const token = authorization.substr(7);
		req.token = token;
	}
	next();
};

const isBearerToken = (token) => token.startsWith("Bearer ");

module.exports = authorizationTokenMiddleware;
