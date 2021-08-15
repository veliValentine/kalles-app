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

const contentInDb = async (model) => {
  const content = await model.find({});
  return content.map((c) => c.toJSON());
};

module.exports = {
  getMessages,
  initDb,
  contentInDb,
};
