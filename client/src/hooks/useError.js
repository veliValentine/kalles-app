import { useEffect, useState } from 'react';

let timeoutId;
const useError = (defaultTimeoutTime = 5) => {
	const [error, setError] = useState(null);

	useEffect(() => () => clearTimeout(timeoutId), []);

	const updateError = (errorMessage, seconds = defaultTimeoutTime) => {
		setError(errorMessage);
		clearError(seconds);
	};

	const clearError = (seconds) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			setError(null);
		}, 1000 * seconds);
	};

	return [error, updateError];
};

export default useError;
