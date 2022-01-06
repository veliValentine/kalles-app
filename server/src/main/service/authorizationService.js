const getJwtToken = (authorizationHeader) => {
	if (isBearerToken(authorizationHeader)) {
		const token = getBearerToken(authorizationHeader);
		return token;
	}
	return null;
};

const isBearerToken = (token) => token && token.startsWith("Bearer ");

const getBearerToken = (token) => token.substr(7);

module.exports = {
	getJwtToken,
};
