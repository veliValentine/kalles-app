const firebaseService = require("../service/firebaseService");

const authorizationTokenMiddleware = async (req, _res, next) => {
	const { authorization } = req.headers;
	if (isBearerToken(authorization)) {
		const token = authorization.substr(7);
		req.token = token;
		try {
			const uid = await firebaseService.getUserUid(token);
			req.id = uid;
		} catch (error) {
			handleFirebaseError(error, req);
		}
	}
	next();
};

const isBearerToken = (token) => token && token.startsWith("Bearer ");

const handleFirebaseError = (error, req) => {
	if (error instanceof Error) {
		const { message } = error;
		if (message.includes("Firebase ID token has expired.")) {
			req.token = null;
		}
	}
};

module.exports = authorizationTokenMiddleware;
