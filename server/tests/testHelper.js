const MESSAGES_ENDPOINT = '/api/v1/messages';

const getMessages = async (api) => {
  const { body: messages } = await api
    .get(MESSAGES_ENDPOINT);
  return messages;
};

const initDb = async (model, initialContent = []) => {
  await model.deleteMany({});
  await model.insertMany(initialContent);
};

module.exports = {
  getMessages,
  initDb,
};
