import { SERVER_URL_BASE } from '../utils/URL';

export const fetchMessages = async (location) => {
  try {
    const query = coordinateQuery(location);
    const URL = `${SERVER_URL_BASE}/messages?${query}`;
    const response = await fetch(URL);
    const messages = await parseServerResponse(response);
    return messages;
  } catch (e) {
    handleError(e);
    return [];
  }
};

const coordinateQuery = (location = {}) => {
  const { latitude, longitude } = location;
  if (!latitude || !longitude) {
    throw new Error('Invalid location');
  }
  return `latitude=${latitude}&longitude=${longitude}`;
};

const parseServerResponse = async (response) => {
  const messages = await response.json();
  if (!Array.isArray(messages)) {
    throw new Error('messages not an array');
  }
  return parseMessages(messages);
};

const parseMessages = (messages) => (
  messages.map((message) => ({
    ...message,
    coordinate: message.location
  }))
);

const handleError = (e) => {
  console.log('Error handling server request');
  if (e instanceof Error) {
    console.log(e.message);
  } else {
    console.log('Error thrown at messageService.js');
    throw e;
  }
};
