const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const NotFoundError = require('../models/errors/notFoundError');
const Message = require('../models/message');

const { currentTimeStamp } = require('../utils/time');
const {
  getMessages, initDb, contentInDb, contentCountInDb, errorResponse,
} = require('./testHelper');

const api = supertest(app);

const MESSAGES_ENDPOINT = '/api/v1/messages';

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
      test('response 201', async () => {
        await api
          .post(MESSAGES_ENDPOINT)
          .send(validMessage)
          .set('Accept', 'application/json')
          .expect(201);
      });

      test('valid message added', async () => {
        const messagesBefore = await getMessages(api);
        const created = currentTimeStamp();
        const expires = currentTimeStamp(24);
        const { body: addedMessage } = await api
          .post(MESSAGES_ENDPOINT)
          .send(validMessage)
          .set('Accept', 'application/json')
          .expect(201);
        expect(addedMessage).toEqual(
          {
            id: addedMessage.id,
            ...validMessage,
            created: created.toISOString(),
            expires: expires.toISOString(),
            likes: 0,
            distance: 0,
          },
        );
        const messagesAfter = await getMessages(api);
        expect(messagesAfter).toHaveLength(messagesBefore.length + 1);
      });

      test('extra attributes not saved', async () => {
        const messagesBefore = await getMessages(api);
        const extraAttributesMessage = {
          ...validMessage,
          id: '42',
          location: {
            ...validMessage.location,
            message: '42 again',
          },
        };
        const created = currentTimeStamp();
        const expires = currentTimeStamp(24);
        const { body: addedMessage } = await api
          .post(MESSAGES_ENDPOINT)
          .send(extraAttributesMessage)
          .set('Accept', 'application/json')
          .expect(201);
        expect(addedMessage).toEqual(
          {
            id: addedMessage.id,
            ...validMessage,
            created: created.toISOString(),
            expires: expires.toISOString(),
            likes: 0,
            distance: 0,
          },
        );
        const messagesAfter = await getMessages(api);
        expect(messagesAfter).toHaveLength(messagesBefore.length + 1);
      });
    });

    describe('invalid messages', () => {
      test('missing username', async () => {
        const messagesBefore = await getMessages(api);
        const missingUsername = {
          message: 'testMessage',
          location: {
            latitude: 0.00,
            longitude: 0.00,
          },
        };
        const { body: errorMessage } = await api
          .post(MESSAGES_ENDPOINT)
          .send(missingUsername)
          .set('Accept', 'application/json')
          .expect(400);
        expect(errorMessage).toBe('Error: Invalid username');
        const messagesAfter = await getMessages(api);
        expect(messagesBefore).toEqual(messagesAfter);
      });

      test('missing message', async () => {
        const messagesBefore = await getMessages(api);
        const missingMessage = {
          username: 'testUsername',
          location: {
            latitude: 0.00,
            longitude: 0.00,
          },
        };
        const { body: errorMessage } = await api
          .post(MESSAGES_ENDPOINT)
          .send(missingMessage)
          .set('Accept', 'application/json')
          .expect(400);
        expect(errorMessage).toBe('Error: Invalid message');
        const messagesAfter = await getMessages(api);
        expect(messagesBefore).toEqual(messagesAfter);
      });

      describe('invalid location', () => {
        test('missing location', async () => {
          const messagesBefore = await getMessages(api);
          const missinglocation = {
            username: 'testUsername',
            message: 'testMessage',
          };
          const { body: errorMessage } = await api
            .post(MESSAGES_ENDPOINT)
            .send(missinglocation)
            .set('Accept', 'application/json')
            .expect(400);
          expect(errorMessage).toBe('Error: Invalid location');
          const messagesAfter = await getMessages(api);
          expect(messagesBefore).toEqual(messagesAfter);
        });
        test('empty location', async () => {
          const messagesBefore = await getMessages(api);
          const emptyLocation = {
            username: 'testUsername',
            message: 'testMessage',
            location: {},
          };
          const { body: errorMessage } = await api
            .post(MESSAGES_ENDPOINT)
            .send(emptyLocation)
            .set('Accept', 'application/json')
            .expect(400);
          expect(errorMessage).toBe('Error: Invalid location');
          const messagesAfter = await getMessages(api);
          expect(messagesBefore).toEqual(messagesAfter);
        });
        test('missing latitude', async () => {
          const messagesBefore = await getMessages(api);
          const missingLatitude = {
            username: 'testUsername',
            message: 'testMessage',
            location: {
              longitude: 0.0,
            },
          };
          const { body: errorMessage } = await api
            .post(MESSAGES_ENDPOINT)
            .send(missingLatitude)
            .set('Accept', 'application/json')
            .expect(400);
          expect(errorMessage).toBe('Error: Invalid location');
          const messagesAfter = await getMessages(api);
          expect(messagesBefore).toEqual(messagesAfter);
        });
        test('missing longitude', async () => {
          const messagesBefore = await getMessages(api);
          const missingLongitude = {
            username: 'testUsername',
            message: 'testMessage',
            location: {
              latitude: 0.0,
            },
          };
          const { body: errorMessage } = await api
            .post(MESSAGES_ENDPOINT)
            .send(missingLongitude)
            .set('Accept', 'application/json')
            .expect(400);
          expect(errorMessage).toBe('Error: Invalid location');
          const messagesAfter = await getMessages(api);
          expect(messagesBefore).toEqual(messagesAfter);
        });
        test('invalid location', async () => {
          const messagesBefore = await getMessages(api);
          const invalidLocation = {
            username: 'testUsername',
            message: 'testMessage',
            location: {
              latitude: 'String',
              longitude: [],
            },
          };
          const { body: errorMessage } = await api
            .post(MESSAGES_ENDPOINT)
            .send(invalidLocation)
            .set('Accept', 'application/json')
            .expect(400);
          expect(errorMessage).toBe('Error: Invalid location');
          const messagesAfter = await getMessages(api);
          expect(messagesBefore).toEqual(messagesAfter);
        });
      });
    });

    // TODO check missing attributes in request body => status 400
    // - valid input. message &username => String, location object containing latitude & longitude

    // TODO check returned object contains right attributes

    // TODO check endDate>created
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
        const id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
        const { body } = await api.get(`${MESSAGES_ENDPOINT}/${id}`)
          .expect(404)
          .expect('Content-type', /application\/json/);
        expect(body).toEqual(errorResponse(messageNotFoundErrorMessage(id)));
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
      expect(body).toEqual(errorResponse(messageNotFoundErrorMessage(messageInDb.id)));
      const messagesInDb = await contentInDb(Message);
      expect(messagesInDb).toHaveLength(initialMessageCount - 1);
    });
    test('Removing message with non exsisting id returns 404', async () => {
      const initialMessageCount = await contentCountInDb(Message);
      const id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      const { body } = await api.delete(`${MESSAGES_ENDPOINT}/${id}`)
        .expect(404)
        .expect('Content-type', /application\/json/);
      expect(body).toEqual(errorResponse(messageNotFoundErrorMessage(id)));
      const messageCount = await contentCountInDb(Message);
      expect(initialMessageCount).toBe(messageCount);
    });
  });
});

const messageNotFoundErrorMessage = (id) => new NotFoundError(`Message with id: ${id} not found`).message;

afterAll(() => {
  mongoose.connection.close();
});
