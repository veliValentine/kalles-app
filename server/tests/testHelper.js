const MESSAGES_ENDPOINT = '/api/v1/messages';

const getMessages = async (api) => {
  const { body: messages } = await api
    .get(MESSAGES_ENDPOINT);
  return messages;
};

module.exports = {
  getMessages,
};
