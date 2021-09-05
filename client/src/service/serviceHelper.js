export const HTTP_OK = 200;

export const HTTP_CREATED = 201;

export const throwInvalidresponse = (response, status = HTTP_OK) => {
	const { status: responseStatus } = response;
	if (responseStatus !== status) {
		throw new Error(`Server responded with status: ${responseStatus}`);
	}
};

export const postJsonOption = (requestBody) => ({
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(requestBody)
});
