const MESSAGES_ENDPOINT = '/api/v1/messages';

const getMessages = async (api) => {
  const { body: messages } = await api
    .get(MESSAGES_ENDPOINT);
  return messages;
};

const initDb = async (model, initialContent = []) => {
  if (!model) throw new Error('No model given');
  await model.deleteMany({});
  await model.insertMany(initialContent);
};

const contentInDb = async (model) => {
  if (!model) throw new Error('No model given');
  const content = await model.find({});
  return content.map((c) => c.toJSON());
};

const contentCountInDb = async (model) => {
  if (!model) throw new Error('No model given');
  const content = await contentInDb(model);
  return content.length;
};

const errorResponse = (message = '') => ({ error: message });

module.exports = {
  getMessages,
  initDb,
  contentInDb,
  contentCountInDb,
  errorResponse,
};
