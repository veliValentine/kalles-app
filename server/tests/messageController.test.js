const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const BadRequestError = require('../models/errors/badRequestError');
const NotFoundError = require('../models/errors/notFoundError');
const Message = require('../models/message');

const {
  initDb, contentInDb, contentCountInDb, errorResponse, findContentById, EPSILON,
} = require('./testHelper');

const api = supertest(app);

const MESSAGES_ENDPOINT = '/api/v1/messages';

const VALID_TEST_ID = 'aaaaaaaaaaaaaaaaaaaaaaaa';

const INVALID_TEST_ID = 'testId';

const INITIAL_MESSAGES = [
  {
    username: 'testUser1',
    message: 'testMessage1',
    location: {
      latitude: 60.205636,
      longitude: 24.96295,
    },
  },
  {
    username: 'testUser2',
    message: 'testMessage2',
    location: {
      latitude: 60.216411,
      longitude: 24.980939,
    },
  },
];

beforeEach(async () => {
  await initDb(Message, INITIAL_MESSAGES);
});

describe('messages', () => {
  describe('GET messages', () => {
    test('API returns messages as correct type', async () => {
      const { body } = await api
        .get(MESSAGES_ENDPOINT)
        .expect(200)
        .expect('Content-type', /application\/json/);

      expect(Array.isArray(body)).toBe(true);
    });
    test('API returns correct amount of messages', async () => {
      const { body } = await api.get(MESSAGES_ENDPOINT);
      expect(body).toHaveLength(INITIAL_MESSAGES.length);
    });
    test('API returns valid messages(no distance)', async () => {
      const { body } = await api.get(MESSAGES_ENDPOINT);
      const firstMessage = body[0];
      expect(firstMessage).toMatchObject(INITIAL_MESSAGES[0]);
      expect(firstMessage.distance).toBeUndefined();
      expect(firstMessage.likes).toBe(0);
      expect(firstMessage.createDay).toBeDefined();
      expect(firstMessage.id).toBeDefined();
    });
    test('API returns valid messages(with distance)', async () => {
      const { body } = await api.get(`${MESSAGES_ENDPOINT}?latitude=60&longitude=25`);
      const firstMessage = body[0];
      expect(firstMessage).toMatchObject(INITIAL_MESSAGES[0]);
      expect(firstMessage.distance).toBe(22.96);
    });
  });

  describe('POST message', () => {
    const validMessage = {
      username: 'testUsername',
      message: 'testMessage',
      location: {
        latitude: 0.00,
        longitude: 0.00,
      },
    };
    describe('Valid messages', () => {
      test('API returns new message as json with status 201', async () => {
        await api
          .post(MESSAGES_ENDPOINT)
          .send(validMessage)
          .set('Accept', 'application/json')
          .expect(201)
          .expect('Content-type', /application\/json/);
      });

      test('Message is added to db', async () => {
        const initialMessageCount = await contentCountInDb(Message);

        const { body } = await api
          .post(MESSAGES_ENDPOINT)
          .send(validMessage)
          .set('Accept', 'application/json')
          .expect(201);

        const messageCount = await contentCountInDb(Message);
        expect(messageCount).toBe(initialMessageCount + 1);

        const addedMessage = await findContentById(Message, body.id);
        addedMessage.distance = 0;
        expect(body).toEqual(addedMessage);
      });

      test('Extra properties not saved to new message', async () => {
        const extraAttributesMessage = {
          ...validMessage,
          id: '42',
          location: {
            ...validMessage.location,
            message: '42 again',
          },
        };
        const initialMessageCount = await contentCountInDb(Message);

        const { body } = await api
          .post(MESSAGES_ENDPOINT)
          .send(extraAttributesMessage)
          .set('Accept', 'application/json')
          .expect(201);

        const messageCount = await contentCountInDb(Message);
        expect(messageCount).toBe(initialMessageCount + 1);

        const addedMessage = await findContentById(Message, body.id);
        addedMessage.distance = 0;
        expect(body).toEqual(addedMessage);
        expect(body.message).toBe(validMessage.message);
      });
    });

    describe('Invalid messages', () => {
      test('Message missing username not added to db', async () => {
        const invalidMessage = { ...validMessage };
        invalidMessage.username = undefined;
        await missingContentTest(invalidMessage, badRequestErrorObject('Invalid username'));
      });
      test('Message missing message(text) not added to db', async () => {
        const invalidMessage = { ...validMessage };
        invalidMessage.message = undefined;
        await missingContentTest(invalidMessage, badRequestErrorObject('Invalid message'));
      });
      describe('invalid location', () => {
        test('Message missing location not added to db', async () => {
          const invalidMessage = { ...validMessage };
          invalidMessage.location = undefined;
          await missingContentTest(invalidMessage, badRequestErrorObject('Invalid location'));
        });
        test('Message missing latitude not added to db', async () => {
          const invalidMessage = { ...validMessage };
          invalidMessage.location.latitude = undefined;
          await missingContentTest(invalidMessage, badRequestErrorObject('Invalid location'));
        });
        test('Message missing longitude not added to db', async () => {
          const invalidMessage = { ...validMessage };
          invalidMessage.location.longitude = undefined;
          await missingContentTest(invalidMessage, badRequestErrorObject('Invalid location'));
        });
        test('Message invalid location not added to db', async () => {
          const invalidMessage = { ...validMessage };
          const invalidLocation = {
            latitude: 'String',
            longitude: [],
          };
          invalidMessage.location = invalidLocation;
          await missingContentTest(invalidMessage, badRequestErrorObject('Invalid location'));
        });
        test('Message invalid location not added to db - values out of range - negative', async () => {
          const invalidMessage = { ...validMessage };
          const invalidLocation = {
            latitude: -90 - EPSILON,
            longitude: -180 - EPSILON,
          };
          invalidMessage.location = invalidLocation;
          await missingContentTest(
            invalidMessage,
            validationErrorObject(
              `location.latitude: Path \`location.latitude\` (${invalidLocation.latitude}) is less than minimum allowed value (-90)., `
              + `location.longitude: Path \`location.longitude\` (${invalidLocation.longitude}) is less than minimum allowed value (-180).`,
            ),
          );
        });
        test('Message invalid location not added to db - values out of range - positive', async () => {
          const invalidMessage = { ...validMessage };
          const invalidLocation = {
            latitude: 90 + EPSILON,
            longitude: 180 + EPSILON,
          };
          invalidMessage.location = invalidLocation;
          await missingContentTest(
            invalidMessage,
            validationErrorObject(
              `location.latitude: Path \`location.latitude\` (${invalidLocation.latitude}) is more than maximum allowed value (90)., `
              + `location.longitude: Path \`location.longitude\` (${invalidLocation.longitude}) is more than maximum allowed value (180).`,
            ),
          );
        });
      });

      const missingContentTest = async (invalidMessage, errorMessage) => {
        const initialMessageCount = await contentCountInDb(Message);
        const { body } = await api
          .post(MESSAGES_ENDPOINT)
          .send(invalidMessage)
          .set('Accept', 'application/json')
          .expect(400)
          .expect('Content-type', /application\/json/);

        const messageCount = await contentCountInDb(Message);
        expect(messageCount).toBe(initialMessageCount);

        expect(body).toEqual(errorMessage);
      };
    });
  });

  describe('GET message', () => {
    describe('valid request', () => {
      let messageInDb;
      beforeEach(async () => {
        const messagesInDb = await contentInDb(Message);
        messageInDb = messagesInDb[0];
      });

      test('Returned message is correct type', async () => {
        await api.get(`${MESSAGES_ENDPOINT}/${messageInDb.id}`)
          .expect(200)
          .expect('Content-type', /application\/json/);
      });
      test('Returns correct message(no distance)', async () => {
        const { body } = await api.get(`${MESSAGES_ENDPOINT}/${messageInDb.id}`)
          .expect(200);
        expect(body).toEqual(messageInDb);
      });
      test('Returns correct message(with distance)', async () => {
        const { body } = await api.get(`${MESSAGES_ENDPOINT}/${messageInDb.id}?latitude=60&longitude=25`);
        const messageInDbWithDistance = { ...messageInDb, distance: 22.96 };
        expect(body).toEqual(messageInDbWithDistance);
      });
    });
    describe('invalid request', () => {
      test('fail with 404 ', async () => {
        const { body } = await api.get(`${MESSAGES_ENDPOINT}/${VALID_TEST_ID}`)
          .expect(404)
          .expect('Content-type', /application\/json/);
        expect(body).toEqual(messageNotFoundErrorObject(VALID_TEST_ID));
      });
      test('fail with 400 ', async () => {
        const { body } = await api.get(`${MESSAGES_ENDPOINT}/${INVALID_TEST_ID}`)
          .expect(400)
          .expect('Content-type', /application\/json/);
        expect(body).toEqual(invalidIdErrorObject(INVALID_TEST_ID));
      });
    });
  });

  describe('DELETE message', () => {
    let messageInDb;
    beforeEach(async () => {
      const messagesInDb = await contentInDb(Message);
      messageInDb = messagesInDb[0];
    });

    test('Removing valid message deletes it from db', async () => {
      const initialMessageCount = await contentCountInDb(Message);
      await api.delete(`${MESSAGES_ENDPOINT}/${messageInDb.id}`)
        .expect(204);
      const messagesInDb = await contentInDb(Message);
      expect(messagesInDb).toHaveLength(initialMessageCount - 1);
      const deletedMessageFoundInDb = messagesInDb.find(({ id }) => id === messageInDb.id);
      expect(deletedMessageFoundInDb).toBeUndefined();
    });
    test('Removing same message twice returns 404', async () => {
      const initialMessageCount = await contentCountInDb(Message);
      await api.delete(`${MESSAGES_ENDPOINT}/${messageInDb.id}`)
        .expect(204);
      const { body } = await api.delete(`${MESSAGES_ENDPOINT}/${messageInDb.id}`)
        .expect(404)
        .expect('Content-type', /application\/json/);
      expect(body).toEqual(messageNotFoundErrorObject(messageInDb.id));
      const messagesInDb = await contentInDb(Message);
      expect(messagesInDb).toHaveLength(initialMessageCount - 1);
    });
    test('Removing message with non existing id returns 404', async () => {
      const initialMessageCount = await contentCountInDb(Message);
      const { body } = await api.delete(`${MESSAGES_ENDPOINT}/${VALID_TEST_ID}`)
        .expect(404)
        .expect('Content-type', /application\/json/);
      expect(body).toEqual(messageNotFoundErrorObject(VALID_TEST_ID));
      const messageCount = await contentCountInDb(Message);
      expect(initialMessageCount).toBe(messageCount);
    });
    test('Removing message with invalid id returns 400', async () => {
      const initialMessageCount = await contentCountInDb(Message);
      const { body } = await api.delete(`${MESSAGES_ENDPOINT}/${INVALID_TEST_ID}`)
        .expect(400)
        .expect('Content-type', /application\/json/);
      expect(body).toEqual(invalidIdErrorObject(INVALID_TEST_ID));
      const messageCount = await contentCountInDb(Message);
      expect(initialMessageCount).toBe(messageCount);
    });
  });

  describe('Like message', () => {
    let messageInDb;
    beforeEach(async () => {
      const messagesInDb = await contentInDb(Message);
      messageInDb = messagesInDb[0];
    });

    test('Liking message returns status 200 and liked message', async () => {
      const { id, likes: initialLikes } = messageInDb;
      const { body } = await api.post(`${MESSAGES_ENDPOINT}/${id}/like`)
        .expect(200)
        .expect('Content-type', /application\/json/);
      const newMessage = { ...messageInDb, likes: initialLikes + 1 };
      expect(body).toEqual(newMessage);
    });
    test('Liking message adds likes', async () => {
      const likesBefore = await totalMessageLikes();
      const { id } = messageInDb;
      await api.post(`${MESSAGES_ENDPOINT}/${id}/like`)
        .expect(200);
      await api.post(`${MESSAGES_ENDPOINT}/${id}/like`)
        .expect(200);
      const likesAfter = await totalMessageLikes();
      expect(likesAfter).toBe(likesBefore + 2);
    });
    test('Liking non existing message return message not found error', async () => {
      const { body } = await api.post(`${MESSAGES_ENDPOINT}/${VALID_TEST_ID}/like`)
        .expect(404);
      expect(body).toEqual(messageNotFoundErrorObject(VALID_TEST_ID));
    });
    test('Liking with invalid id returns bad request', async () => {
      const { body } = await api.post(`${MESSAGES_ENDPOINT}/${INVALID_TEST_ID}/like`)
        .expect(400);
      expect(body).toEqual(invalidIdErrorObject(INVALID_TEST_ID));
    });
    test('Liking non existing message has no effect on likes amount', async () => {
      const likesBefore = await totalMessageLikes();
      await api.post(`${MESSAGES_ENDPOINT}/${VALID_TEST_ID}/like`)
        .expect(404);
      await api.post(`${MESSAGES_ENDPOINT}/${INVALID_TEST_ID}/like`)
        .expect(400);
      const likesAfter = await totalMessageLikes();
      expect(likesAfter).toBe(likesBefore);
    });
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

const validationErrorObject = (message) => errorResponse(`Message validation failed: ${message}`);

const likesSumReducer = (acc, curr) => acc + curr.likes;

afterAll(() => {
  mongoose.connection.close();
});
