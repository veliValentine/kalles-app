const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../main/app");
const NotFoundError = require("../main/models/errors/notFoundError");
const User = require("../main/models/user");
const Message = require("../main/models/message");
const { initDb, contentInDb, errorResponse } = require("./testHelper");

const api = supertest(app);

const USERS_ENDPOINT = "/api/v1/users";

const ID_IN_DB = "1";

const INITIAL_USERS = [
	{
		id: ID_IN_DB,
		username: "testUsername1",
		messages: [],
		liked: [],
	},
	{
		id: "2",
		username: "testUsername2",
		isAdmin: true,
		messages: [],
		liked: [],
	},
];

beforeEach(async () => {
	await initDb(User, INITIAL_USERS);
});

const ID_NOT_IN_DB = "3";

describe("users", () => {
	describe("GET users", () => {
		test("API returns users as correct type", async () => {
			const { body } = await api
				.get(USERS_ENDPOINT)
				.expect(200)
				.expect("Content-type", /application\/json/);

			expect(Array.isArray(body)).toBe(true);
		});
		test("API returns correct amount of users", async () => {
			const { body } = await api.get(USERS_ENDPOINT);
			expect(body).toHaveLength(INITIAL_USERS.length);
		});
		test("API returns valid users", async () => {
			const { body } = await api.get(USERS_ENDPOINT);
			const firstUser = body[0];
			expect(firstUser).toMatchObject(INITIAL_USERS[0]);
			expect(firstUser.isAdmin).toBeUndefined();
			expect(firstUser.liked).toEqual([]);
			expect(firstUser.messages).toEqual([]);

			const secondUser = body[1];
			expect(secondUser).toMatchObject(INITIAL_USERS[1]);
			expect(secondUser.isAdmin).toBe(true);
			expect(secondUser.liked).toEqual([]);
			expect(secondUser.messages).toEqual([]);
		});
	});
	describe("GET user", () => {
		let userInDb;
		beforeEach(async () => {
			const usersInDb = await contentInDb(User);
			userInDb = usersInDb[0];
		});

		test("Returned user is correct type", async () => {
			await api.get(`${USERS_ENDPOINT}/${userInDb.id}`)
				.expect(200)
				.expect("Content-type", /application\/json/);
		});
		test("Returned user is correct", async () => {
			const { body } = await api.get(`${USERS_ENDPOINT}/${userInDb.id}`)
				.expect(200)
				.expect("Content-type", /application\/json/);
			expect(body).toEqual(userInDb);
		});
		test("fail with 404", async () => {
			const { body } = await api.get(`${USERS_ENDPOINT}/${ID_NOT_IN_DB}`)
				.expect(404)
				.expect("Content-type", /application\/json/);
			expect(body).toEqual(userNotFoundErrorObject(ID_NOT_IN_DB));
		});
	});
	describe("GET user contents", () => {
		let userMessage;
		let likedMessage;
		let userInDb;
		beforeEach(async () => {
			const newMessage = new Message({
				username: "testMessageUsername1",
				message: "testMessage",
				location: {
					latitude: 0,
					longitude: 0,
				},
			});
			const newLikedMessage = new Message({
				username: "testMessageUsername2",
				message: "testMessage2",
				location: {
					latitude: 1,
					longitude: 1,
				},
			});
			userMessage = await newMessage.save();
			likedMessage = await newLikedMessage.save();
			userInDb = await User.findOne({ id: ID_IN_DB });
			userInDb.messages = userInDb.messages.concat(userMessage);
			userInDb.liked = userInDb.liked.concat(likedMessage);
			await userInDb.save();
		});
		test("GET user own messages", async () => {
			const { body } = await api.get(`${USERS_ENDPOINT}/${ID_IN_DB}/messages`)
				.expect(200)
				.expect("Content-type", /application\/json/);
			expect(body).toHaveLength(1);
			const message = body[0];
			expect(message).toEqual(userMessage.toJSON());
		});
		test("GET user liked messages", async () => {
			const { body } = await api.get(`${USERS_ENDPOINT}/${ID_IN_DB}/liked`)
				.expect(200)
				.expect("Content-type", /application\/json/);
			expect(body).toHaveLength(1);
			const message = body[0];
			expect(message).toEqual(likedMessage.toJSON());
		});
	});
});

const userNotFoundErrorObject = (id) => errorResponse(new NotFoundError(`User with id: ${id} not found`).message);

afterAll(() => {
	mongoose.connection.close();
});
