import { parseLocation } from '../utils';
import { handleError } from '../utils/errors';
import { SERVER_URL_BASE } from '../utils/URL';

const MESSAGE_URL = `${SERVER_URL_BASE}/messages`;

const HTTP_OK = 200;
const HTTP_CREATED = 201;

export const fetchMessages = async (location) => {
  try {
    const query = coordinateQuery(location);
    const URL = `${MESSAGE_URL}?${query}`;
    const response = await fetch(URL);
    const responseStatus = response.status;
    if (responseStatus !== HTTP_OK) {
      throw new Error(`Server responded with status: ${responseStatus}`);
    }
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

export const addMessage = async (message) => {
  const response = await fetch(MESSAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  });
  const responseJSON = await response.json();
  const responseStatus = response.status;
  if (responseStatus !== HTTP_CREATED) {
    throw new Error(`Server responded with status: ${responseStatus}`, responseJSON);
  }
  return responseJSON;
};
