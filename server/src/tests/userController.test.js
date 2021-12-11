const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../main/app");
const User = require("../main/models/user");
const { initDb } = require("./testHelper");

const api = supertest(app);

const USERS_ENDPOINT = "/api/v1/users";

const INITIAL_USERS = [
	{
		id: "1",
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
});

afterAll(() => {
	mongoose.connection.close();
});
