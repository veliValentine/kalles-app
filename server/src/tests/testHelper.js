const EPSILON = 0.000000000001;

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

const errorResponse = (message = "") => ({ error: message });

const throwModelNotGiven = () => { throw new Error("No model given"); };

module.exports = {
	EPSILON,
	initDb,
	contentInDb,
	contentCountInDb,
	errorResponse,
	findContentById,
};
