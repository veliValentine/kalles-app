const MESSAGES_ENDPOINT = '/api/v1/messages';

const getMessages = async (api) => {
  const { body: messages } = await api
    .get(MESSAGES_ENDPOINT);
  return messages;
};

const initDb = async (model = throwModelNotGiven(), initialContent = []) => {
  await model.deleteMany({});
  await model.insertMany(initialContent);
};

const contentInDb = async (model = throwModelNotGiven()) => {
  const content = await model.find({});
  return content.map((c) => c.toJSON());
};

const contentCountInDb = async (model = throwModelNotGiven()) => {
  const content = await contentInDb(model);
  return content.length;
};

const findContentById = async (model = throwModelNotGiven(), id) => {
  const content = await model.findById(id);
  return content.toJSON();
};

const errorResponse = (message = '') => ({ error: message });

const throwModelNotGiven = () => { throw new Error('No model given'); };

module.exports = {
  getMessages,
  initDb,
  contentInDb,
  contentCountInDb,
  errorResponse,
  findContentById,
};
