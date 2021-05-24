import { parseLocation } from '../utils';
import { handleError } from '../utils/errors';
import { SERVER_URL_BASE } from '../utils/URL';

export const fetchMessages = async (location) => {
  try {
    const query = coordinateQuery(location);
    const URL = `${SERVER_URL_BASE}/messages?${query}`;
    const response = await fetch(URL);
    const messages = await parseServerResponse(response);
    return messages;
  } catch (e) {
    handleError(e, 'Error handling server request');
    return [];
  }
};

const coordinateQuery = (location) => {
  const { latitude, longitude } = parseLocation(location, 'messageService.js');
  return `latitude=${latitude}&longitude=${longitude}`;
};

const parseServerResponse = async (response) => {
  const messages = await response.json();
  if (!Array.isArray(messages)) {
    throw new Error('messages not an array');
  }
  return messages;
};

