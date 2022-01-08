const firebaseService = require("../service/firebaseService");
const authorizationService = require("../service/authorizationService");

const authorizationTokenMiddleware = async (req, _res, next) => {
	const { authorization } = req.headers;
	const jwtToken = authorizationService.getJwtToken(authorization);
	if (jwtToken) {
		req.token = jwtToken;
		try {
			const uid = await firebaseService.getUserUid(jwtToken);
			req.id = uid;
		} catch (error) {
			handleFirebaseError(error, req);
		}
	}
	next();
};

const handleFirebaseError = (error, req) => {
	if (error instanceof Error) {
		const { message } = error;
		if (message.includes("Firebase ID token has expired.")) {
			req.token = null;
		}
	}
};

module.exports = authorizationTokenMiddleware;
