const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../main/app");
const NotFoundError = require("../main/models/errors/notFoundError");
const BadRequestError = require("../main/models/errors/badRequestError");
const User = require("../main/models/user");
const Message = require("../main/models/message");
const testHelper = require("./testHelper");

const api = supertest(app);

const USERS_ENDPOINT = "/api/v1/users";

const ID_IN_DB = "EHn26wZyB3NEeo6xIKH0rB5r9F03";

const INITIAL_USERS = [
	{
		id: ID_IN_DB,
		username: "testUsername1",
		isAdmin: true,
	},
	{
		id: "2",
		username: "testUsername2",
	},
];

let AUTH_HEADER;
beforeAll(async () => {
	AUTH_HEADER = await testHelper.getValidAuthorizationHeader();
});

const ID_NOT_IN_DB = "3";

describe("users", () => {
	beforeEach(async () => {
		await testHelper.initDb(User, INITIAL_USERS);
	});

	describe("GET users", () => {
		test("API returns users as correct type", async () => {
			const body = await getUsers(USERS_ENDPOINT);
			expect(Array.isArray(body)).toBe(true);
		});
		test("API returns correct amount of users", async () => {
			const body = await getUsers(USERS_ENDPOINT);
			expect(body).toHaveLength(INITIAL_USERS.length);
		});
		test("API returns valid users", async () => {
			const body = await getUsers(USERS_ENDPOINT);
			const firstUser = body[0];
			expect(firstUser).toMatchObject(INITIAL_USERS[0]);
			expect(firstUser.isAdmin).toBe(true);
			expect(firstUser.liked).toEqual([]);
			expect(firstUser.messages).toEqual([]);

			const secondUser = body[1];
			expect(secondUser).toMatchObject(INITIAL_USERS[1]);
			expect(secondUser.isAdmin).toBeUndefined();
			expect(secondUser.liked).toEqual([]);
			expect(secondUser.messages).toEqual([]);
		});

		const getUsers = async (url, status = 200) => {
			const { body } = await api
				.get(url)
				.set(AUTH_HEADER)
				.expect(status)
				.expect("Content-type", /application\/json/);
			return body;
		};
	});
	describe("GET user", () => {
		let userInDb;
		beforeEach(async () => {
			const usersInDb = await testHelper.contentInDb(User);
			userInDb = usersInDb[0];
		});

		test("Returned user is correct type", async () => {
			await getUser(`${USERS_ENDPOINT}/${userInDb.id}`);
		});
		test("Returned user is correct", async () => {
			const body = await getUser(`${USERS_ENDPOINT}/${userInDb.id}`);
			expect(body).toEqual(userInDb);
		});
		test("fail with 404", async () => {
			const body = await getUser(`${USERS_ENDPOINT}/${ID_NOT_IN_DB}`, 404);
			expect(body).toEqual(userNotFoundErrorObject(ID_NOT_IN_DB));
		});

		const getUser = async (url, status = 200) => {
			const { body } = await api
				.get(url)
				.set(AUTH_HEADER)
				.expect(status)
				.expect("Content-type", /application\/json/);
			return body;
		};
	});
	describe("GET user contents", () => {
		let userMessage;
		let likedMessage;
		let userInDb;
		beforeEach(async () => {
			userInDb = await User.findOne({ id: ID_IN_DB });
			const newMessage = new Message({
				username: "testMessageUsername1",
				message: "testMessage",
				location: {
					latitude: 0,
					longitude: 0,
				},
				user: userInDb._id, // eslint-disable-line no-underscore-dangle
			});
			const newLikedMessage = new Message({
				username: "testMessageUsername2",
				message: "testMessage2",
				location: {
					latitude: 1,
					longitude: 1,
				},
				user: userInDb._id, // eslint-disable-line no-underscore-dangle
			});
			userMessage = await newMessage.save();
			likedMessage = await newLikedMessage.save();

			userInDb.messages = userInDb.messages.concat(userMessage);
			userInDb.liked = userInDb.liked.concat(likedMessage);
			await userInDb.save();
		});
		test("GET user own messages", async () => {
			const body = await get(`${USERS_ENDPOINT}/${ID_IN_DB}/messages`);
			expect(body).toHaveLength(1);
			const message = body[0];
			expect(message).toEqual(userMessage.toJSON());
		});
		test("GET user liked messages", async () => {
			const body = await get(`${USERS_ENDPOINT}/${ID_IN_DB}/liked`);
			expect(body).toHaveLength(1);
			const message = body[0];
			expect(message).toEqual(likedMessage.toJSON());
		});

		const get = async (url, status = 200) => {
			const { body } = await api
				.get(url)
				.set(AUTH_HEADER)
				.expect(status)
				.expect("Content-type", /application\/json/);
			return body;
		};
	});
	describe("POST user", () => {
		test("missing username returns 400", async () => {
			const initialUserCount = await testHelper.contentCountInDb(User);
			const body = await postRequest(USERS_ENDPOINT, 400, {}, AUTH_HEADER);

			const userCount = await testHelper.contentCountInDb(User);
			expect(userCount).toBe(initialUserCount);

			expect(body).toEqual(badRequestErrorObject());
		});
	});
});

describe("users clear db", () => {
	beforeEach(async () => {
		await testHelper.initDb(User);
	});
	test("valid new user", async () => {
		const initialUserCount = await testHelper.contentCountInDb(User);
		const INPUT_USERNAME = "testUsername3";
		const requestBody = {
			username: INPUT_USERNAME,
		};
		const body = await postRequest(USERS_ENDPOINT, 201, requestBody, AUTH_HEADER);

		const {
			id,
			username,
			messages,
			liked,
		} = body;

		const userCount = await testHelper.contentCountInDb(User);
		expect(userCount).toBe(initialUserCount + 1);

		expect(id).toBeDefined();
		expect(username).toBe(INPUT_USERNAME);
		expect(messages).toEqual([]);
		expect(liked).toEqual([]);

		expect(body).toEqual({
			id,
			username,
			messages,
			liked,
		});
	});
});

const postRequest = async (endpoint, status, requestBody, headers) => {
	const { body } = await api
		.post(endpoint)
		.set("Accept", "application/json")
		.set(headers)
		.send(requestBody)
		.expect(status)
		.expect("Content-type", /application\/json/);
	return body;
};

const userNotFoundErrorObject = (id) => testHelper.errorResponse(new NotFoundError(`User with id: ${id} not found`).message);
const badRequestErrorObject = () => testHelper.errorResponse(new BadRequestError("No username given").message);

afterAll(() => {
	mongoose.connection.close();
});
