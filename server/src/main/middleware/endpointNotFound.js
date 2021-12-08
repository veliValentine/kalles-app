const endpointNotFound = (req, res) => {
	const { originalUrl: requestedEndpoint } = req;
	return res.status(404).json({ error: `no endpoint found for request ${requestedEndpoint}` });
};

module.exports = endpointNotFound;
