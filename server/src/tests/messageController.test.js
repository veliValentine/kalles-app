const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../main/app");
const BadRequestError = require("../main/models/errors/badRequestError");
const NotFoundError = require("../main/models/errors/notFoundError");
const Message = require("../main/models/message");
const User = require("../main/models/user");

const testHelper = require("./testHelper");
const {
	initDb, contentInDb, contentCountInDb, errorResponse, findContentById, EPSILON,
} = require("./testHelper");

const api = supertest(app);

const MESSAGES_ENDPOINT = "/api/v1/messages";

const VALID_TEST_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";

const INVALID_TEST_ID = "testId";

const LATITUDE_AND_LONGITUDE_PARAMS = "latitude=60&longitude=25";
const DEFAULT_DISTANCE = 22.96;

const USER_ID_IN_DB = "EHn26wZyB3NEeo6xIKH0rB5r9F03";

const INITIAL_USER = [
	{
		id: USER_ID_IN_DB,
		username: "testUser",
	},
];

const INITIAL_MESSAGES = [
	{
		username: "testUser1",
		message: "testMessage1",
		location: {
			latitude: 60.205636,
			longitude: 24.96295,
		},
	},
	{
		username: "testUser2",
		message: "testMessage2",
		location: {
			latitude: 60.216411,
			longitude: 24.980939,
		},
	},
];

beforeEach(async () => {
	await initDb(User, INITIAL_USER);
	const { _id: userMongoId } = await User.findOne({ id: USER_ID_IN_DB });
	const initialMessagesWithUser = INITIAL_MESSAGES.map((message) => (
		{
			...message,
			user: userMongoId,
		}
	));
	await initDb(Message, initialMessagesWithUser);
});

describe("messages", () => {
	describe("GET messages", () => {
		test("API returns messages as correct type", async () => {
			const { body } = await api
				.get(MESSAGES_ENDPOINT)
				.expect(200)
				.expect("Content-type", /application\/json/);

			expect(Array.isArray(body)).toBe(true);
		});
		test("API returns correct amount of messages", async () => {
			const { body } = await api.get(MESSAGES_ENDPOINT);
			expect(body).toHaveLength(INITIAL_MESSAGES.length);
		});
		test("API returns valid messages(no distance)", async () => {
			const { body } = await api.get(MESSAGES_ENDPOINT);
			const firstMessage = body[0];
			expect(firstMessage).toMatchObject(INITIAL_MESSAGES[0]);
			expect(firstMessage.distance).toBeUndefined();
			expect(firstMessage.likes).toBe(0);
			expect(firstMessage.created).toBeDefined();
			expect(firstMessage.id).toBeDefined();
		});
		test("API returns valid messages(with distance)", async () => {
			const { body } = await api.get(`${MESSAGES_ENDPOINT}?${LATITUDE_AND_LONGITUDE_PARAMS}`);
			const firstMessage = body[0];
			expect(firstMessage).toMatchObject(INITIAL_MESSAGES[0]);
			expect(firstMessage.distance).toBe(DEFAULT_DISTANCE);
		});
	});

	describe("POST message", () => {
		const validMessage = {
			username: "testUsername",
			message: "testMessage",
			location: {
				latitude: 0.00,
				longitude: 0.00,
			},
		};
		describe("Valid messages", () => {
			test("API returns new message as json with status 201", async () => {
				await postMessageWithValidAuthHeader(MESSAGES_ENDPOINT, validMessage, 201);
			});

			test("Message is added to db", async () => {
				const initialMessageCount = await contentCountInDb(Message);

				const body = await postMessageWithValidAuthHeader(MESSAGES_ENDPOINT, validMessage, 201);

				const messageCount = await contentCountInDb(Message);
				expect(messageCount).toBe(initialMessageCount + 1);

				const addedMessage = await findContentById(Message, body.id);
				addedMessage.distance = 0;
				expect(body).toEqual(addedMessage);
			});

			test("Extra properties not saved to new message", async () => {
				const extraAttributesMessage = {
					...validMessage,
					id: "42",
					location: {
						...validMessage.location,
						message: "42 again",
					},
				};
				const initialMessageCount = await contentCountInDb(Message);

				const body = await postMessageWithValidAuthHeader(
					MESSAGES_ENDPOINT,
					extraAttributesMessage,
					201,
				);

				const messageCount = await contentCountInDb(Message);
				expect(messageCount).toBe(initialMessageCount + 1);

				const addedMessage = await findContentById(Message, body.id);
				addedMessage.distance = 0;
				expect(body).toEqual(addedMessage);
				expect(body.message).toBe(validMessage.message);
			});
		});

		describe("Invalid messages", () => {
			test("Message missing username not added to db", async () => {
				const invalidMessage = { ...validMessage };
				invalidMessage.username = undefined;
				await missingContentTest(invalidMessage, badRequestErrorObject("Invalid username"));
			});
			test("Message missing message(text) not added to db", async () => {
				const invalidMessage = { ...validMessage };
				invalidMessage.message = undefined;
				await missingContentTest(invalidMessage, badRequestErrorObject("Invalid message"));
			});
			describe("invalid location", () => {
				test("Message missing location not added to db", async () => {
					const invalidMessage = { ...validMessage };
					invalidMessage.location = undefined;
					await missingContentTest(invalidMessage, badRequestErrorObject("Invalid location"));
				});
				test("Message missing latitude not added to db", async () => {
					const invalidMessage = { ...validMessage };
					invalidMessage.location.latitude = undefined;
					await missingContentTest(invalidMessage, badRequestErrorObject("Invalid location"));
				});
				test("Message missing longitude not added to db", async () => {
					const invalidMessage = { ...validMessage };
					invalidMessage.location.longitude = undefined;
					await missingContentTest(invalidMessage, badRequestErrorObject("Invalid location"));
				});
				test("Message invalid location not added to db", async () => {
					const invalidMessage = { ...validMessage };
					const invalidLocation = {
						latitude: "String",
						longitude: [],
					};
					invalidMessage.location = invalidLocation;
					await missingContentTest(invalidMessage, badRequestErrorObject("Invalid location"));
				});
				test("Message invalid location not added to db - values out of range - negative", async () => {
					const invalidMessage = { ...validMessage };
					const invalidLocation = {
						latitude: -90 - EPSILON,
						longitude: -180 - EPSILON,
					};
					invalidMessage.location = invalidLocation;
					await missingContentTest(
						invalidMessage,
						badRequestErrorObject("Invalid location"),
					);
				});
				test("Message invalid location not added to db - values out of range - positive", async () => {
					const invalidMessage = { ...validMessage };
					const invalidLocation = {
						latitude: 90 + EPSILON,
						longitude: 180 + EPSILON,
					};
					invalidMessage.location = invalidLocation;
					await missingContentTest(
						invalidMessage,
						badRequestErrorObject("Invalid location"),
					);
				});
			});

			const missingContentTest = async (invalidMessage, errorMessage) => {
				const initialMessageCount = await contentCountInDb(Message);
				const body = await postMessageWithValidAuthHeader(
					MESSAGES_ENDPOINT,
					invalidMessage,
					400,
				);

				const messageCount = await contentCountInDb(Message);
				expect(messageCount).toBe(initialMessageCount);

				expect(body).toEqual(errorMessage);
			};
		});

		const postMessageWithValidAuthHeader = async (endpoint, requestBody, status) => {
			const authHeader = await testHelper.getValidAuthorizationHeader();
			const { body } = await api
				.post(endpoint)
				.send(requestBody)
				.set("Accept", "application/json")
				.set(authHeader)
				.expect(status)
				.expect("Content-type", /application\/json/);
			return body;
		};
	});

	describe("GET message", () => {
		describe("valid request", () => {
			let messageInDb;
			beforeEach(async () => {
				const messagesInDb = await contentInDb(Message);
				messageInDb = messagesInDb[0];
			});

			test("Returned message is correct type", async () => {
				await api.get(`${MESSAGES_ENDPOINT}/${messageInDb.id}`)
					.expect(200)
					.expect("Content-type", /application\/json/);
			});
			test("Returns correct message(no distance)", async () => {
				const { body } = await api.get(`${MESSAGES_ENDPOINT}/${messageInDb.id}`)
					.expect(200);
				expect(body).toEqual(messageInDb);
			});
			test("Returns correct message(with distance)", async () => {
				const { body } = await api.get(`${MESSAGES_ENDPOINT}/${messageInDb.id}?${LATITUDE_AND_LONGITUDE_PARAMS}`);
				const messageInDbWithDistance = { ...messageInDb, distance: DEFAULT_DISTANCE };
				expect(body).toEqual(messageInDbWithDistance);
			});
		});
		describe("invalid request", () => {
			test("fail with 404 ", async () => {
				const { body } = await api.get(`${MESSAGES_ENDPOINT}/${VALID_TEST_ID}`)
					.expect(404)
					.expect("Content-type", /application\/json/);
				expect(body).toEqual(messageNotFoundErrorObject(VALID_TEST_ID));
			});
			test("fail with 400 ", async () => {
				const { body } = await api.get(`${MESSAGES_ENDPOINT}/${INVALID_TEST_ID}`)
					.expect(400)
					.expect("Content-type", /application\/json/);
				expect(body).toEqual(invalidIdErrorObject(INVALID_TEST_ID));
			});
			test("Request with invalid location does not return distance", async () => {
				const { body } = await api.get(`${MESSAGES_ENDPOINT}/${VALID_TEST_ID}?latitude=200&longitude=300`);
				expect(body.distance).toBeUndefined();
			});
		});
	});

	describe("DELETE message", () => {
		let messageInDb;
		beforeEach(async () => {
			const messagesInDb = await contentInDb(Message);
			messageInDb = messagesInDb[0];
		});

		test("Removing valid message deletes it from db", async () => {
			const initialMessageCount = await contentCountInDb(Message);
			await deleteMessageWithValidAuthHeader(MESSAGES_ENDPOINT, messageInDb.id, 204);
			const messagesInDb = await contentInDb(Message);
			expect(messagesInDb).toHaveLength(initialMessageCount - 1);
			const deletedMessageFoundInDb = messagesInDb.find(({ id }) => id === messageInDb.id);
			expect(deletedMessageFoundInDb).toBeUndefined();
		});
		test("Removing same message twice returns 404", async () => {
			const initialMessageCount = await contentCountInDb(Message);
			await deleteMessageWithValidAuthHeader(MESSAGES_ENDPOINT, messageInDb.id, 204);
			const body = await deleteMessageWithValidAuthHeaderJson(
				MESSAGES_ENDPOINT,
				messageInDb.id,
				404,
			);
			expect(body).toEqual(messageNotFoundErrorObject(messageInDb.id));
			const messagesInDb = await contentInDb(Message);
			expect(messagesInDb).toHaveLength(initialMessageCount - 1);
		});
		test("Removing message with non existing id returns 404", async () => {
			const initialMessageCount = await contentCountInDb(Message);
			const body = await deleteMessageWithValidAuthHeaderJson(
				MESSAGES_ENDPOINT,
				VALID_TEST_ID,
				404,
			);
			expect(body).toEqual(messageNotFoundErrorObject(VALID_TEST_ID));
			const messageCount = await contentCountInDb(Message);
			expect(initialMessageCount).toBe(messageCount);
		});
		test("Removing message with invalid id returns 400", async () => {
			const initialMessageCount = await contentCountInDb(Message);
			const body = await deleteMessageWithValidAuthHeaderJson(
				MESSAGES_ENDPOINT,
				INVALID_TEST_ID,
				400,
			);
			expect(body).toEqual(invalidIdErrorObject(INVALID_TEST_ID));
			const messageCount = await contentCountInDb(Message);
			expect(initialMessageCount).toBe(messageCount);
		});
		const deleteMessageWithValidAuthHeader = async (endpoint, id, status) => {
			const authHeader = await testHelper.getValidAuthorizationHeader();
			const { body } = await api.delete(`${endpoint}/${id}`)
				.set(authHeader)
				.expect(status);
			return body;
		};
		const deleteMessageWithValidAuthHeaderJson = async (endpoint, id, status) => {
			const authHeader = await testHelper.getValidAuthorizationHeader();
			const { body } = await api.delete(`${endpoint}/${id}`)
				.set(authHeader)
				.expect(status)
				.expect("Content-type", /application\/json/);
			return body;
		};
	});

	describe("Like message", () => {
		let messageInDb;
		beforeEach(async () => {
			const messagesInDb = await contentInDb(Message);
			messageInDb = messagesInDb[0];
		});

		test("Liking message returns status 200 and liked message", async () => {
			const { id, likes: initialLikes } = messageInDb;
			const body = await postNoBodyWithvalidAuthHeader(`${MESSAGES_ENDPOINT}/${id}/like`, 200);
			const newMessage = { ...messageInDb, likes: initialLikes + 1 };
			expect(body).toEqual(newMessage);
		});
		test("Liking message with coordinates returns 200 and liked message with distance", async () => {
			const { id, likes: initialLikes } = messageInDb;
			const body = await postNoBodyWithvalidAuthHeader(`${MESSAGES_ENDPOINT}/${id}/like?${LATITUDE_AND_LONGITUDE_PARAMS}`, 200);
			const newMessage = { ...messageInDb, likes: initialLikes + 1, distance: DEFAULT_DISTANCE };
			expect(body).toEqual(newMessage);
		});
		test("Liking message adds likes", async () => {
			const likesBefore = await totalMessageLikes();
			const { id } = messageInDb;
			await postNoBodyWithvalidAuthHeader(`${MESSAGES_ENDPOINT}/${id}/like`, 200);
			await postNoBodyWithvalidAuthHeader(`${MESSAGES_ENDPOINT}/${id}/like`, 200);
			const likesAfter = await totalMessageLikes();
			expect(likesAfter).toBe(likesBefore + 2);
		});
		test("Liking non existing message return message not found error", async () => {
			const body = await postNoBodyWithvalidAuthHeader(`${MESSAGES_ENDPOINT}/${VALID_TEST_ID}/like`, 404);
			expect(body).toEqual(messageNotFoundErrorObject(VALID_TEST_ID));
		});
		test("Liking with invalid id returns bad request", async () => {
			const body = await postNoBodyWithvalidAuthHeader(`${MESSAGES_ENDPOINT}/${INVALID_TEST_ID}/like`, 400);
			expect(body).toEqual(invalidIdErrorObject(INVALID_TEST_ID));
		});
		test("Liking non existing message has no effect on likes amount", async () => {
			const likesBefore = await totalMessageLikes();
			await postNoBodyWithvalidAuthHeader(`${MESSAGES_ENDPOINT}/${VALID_TEST_ID}/like`, 404);
			await postNoBodyWithvalidAuthHeader(`${MESSAGES_ENDPOINT}/${INVALID_TEST_ID}/like`, 400);
			const likesAfter = await totalMessageLikes();
			expect(likesAfter).toBe(likesBefore);
		});

		const postNoBodyWithvalidAuthHeader = async (endpoint, status) => {
			const authHeader = await testHelper.getValidAuthorizationHeader();
			const { body } = await api.post(endpoint)
				.set(authHeader)
				.expect(status)
				.expect("Content-type", /application\/json/);
			return body;
		};
	});
});

const totalMessageLikes = async () => {
	const messagesInDb = await contentInDb(Message);
	const totalLikes = messagesInDb.reduce(likesSumReducer, 0);
	return totalLikes;
};

const badRequestErrorObject = (message) => errorResponse(new BadRequestError(message).message);

const messageNotFoundErrorObject = (id) => errorResponse(new NotFoundError(`Message with id: ${id} not found`).message);

const invalidIdErrorObject = (id) => errorResponse(`Cast to ObjectId failed for value "${id}" (type string) at path "_id" for model "Message"`);

const likesSumReducer = (acc, curr) => acc + curr.likes;

afterAll(() => {
	mongoose.connection.close();
});
