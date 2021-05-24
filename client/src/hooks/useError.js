import { useEffect, useState } from 'react';

let timeoutId;
const useError = () => {
  const [error, setError] = useState(null);

  useEffect(() => () => clearTimeout(timeoutId), []);

  const updateError = (errorMessage, seconds = 3) => {
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
