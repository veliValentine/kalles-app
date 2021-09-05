export const handleError = (e, message = 'no error hanler message given') => {
	console.log(message);
	if (e instanceof Error) {
		console.log(e.message);
		return e.message;
	}
	console.log('Error thrown');
	throw e;
};
