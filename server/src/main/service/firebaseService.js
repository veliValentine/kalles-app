const admin = require("firebase-admin");
const firebaseAuth = require("firebase/auth");
const firebaseApp = require("firebase/app");
const logger = require("../utils/logger");
const { isTestEnvironment } = require("../utils/environment");

const initFirebase = () => {
	const cert = {
		project_id: process.env.PROJECT_ID,
		private_key: process.env.PRIVATE_KEY,
		client_email: process.env.CLIENT_EMAIL,
	};
	admin.initializeApp({
		credential: admin.credential.cert(cert),
	});

	if (isTestEnvironment) {
		const firebaseConfig = {
			apiKey: process.env.FIREBASE_APP_API_KEY,
		};
		firebaseApp.initializeApp(firebaseConfig);
	}
};

const decodeToken = (token) => (
	admin.app()
		.auth()
		.verifyIdToken(token)
);

const getUserUid = async (jwtToken) => {
	const { uid } = await decodeToken(jwtToken);
	return uid;
};

const getAccessToken = async (email, password) => {
	if (!isTestEnvironment) throw new Error("Function unavailable");
	const { accessToken } = await login(email, password);
	return accessToken;
};

const login = async (email, password) => {
	if (!isTestEnvironment) throw new Error("Function unavailable");
	try {
		const { user } = await firebaseAuth.signInWithEmailAndPassword(
			firebaseAuth.getAuth(),
			email,
			password,
		);
		return user;
	} catch (error) {
		return logger.errorConsole(error);
	}
};

module.exports = {
	initFirebase,
	getUserUid,
	getAccessToken,
};
