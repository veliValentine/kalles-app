const admin = require("firebase-admin");

const initFirebase = () => {
	const cert = {
		project_id: process.env.PROJECT_ID,
		private_key: process.env.PRIVATE_KEY,
		client_email: process.env.CLIENT_EMAIL,
	};
	admin.initializeApp({
		credential: admin.credential.cert(cert),
	});
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

module.exports = {
	initFirebase,
	getUserUid,
};
