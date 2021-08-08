const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Message = require('../models/message');

const { currentTimeStamp } = require('../utils/time');
const { getMessages, initDb } = require('./testHelper');

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
    let addedMessage;
    test('setup', async () => {
      const validMessage = {
        username: 'testUsername',
        message: 'testMessage',
        location: {
          latitude: 60.171712519065174,
          longitude: 24.94059522394236,
        },
      };
      const { body: newMessage } = await api
        .post(MESSAGES_ENDPOINT)
        .send(validMessage)
        .set('Accept', 'application/json')
        .expect(201);
      const {
        id,
        message,
        username,
        location,
        created,
        expires,
        likes,
      } = newMessage;
      addedMessage = {
        id,
        message,
        username,
        location,
        created,
        expires,
        likes,
      };
    });
    describe('valid request', () => {
      test('status 200', async () => {
        await api.get(`${MESSAGES_ENDPOINT}/${addedMessage.id}`)
          .expect(200);
      });

      test('content JSON', async () => {
        await api.get(`${MESSAGES_ENDPOINT}/${addedMessage.id}`)
          .expect('Content-type', /application\/json/);
      });

      test('return correct message - no location', async () => {
        const { body: message } = await api.get(`${MESSAGES_ENDPOINT}/${addedMessage.id}`)
          .expect(200);
        expect(message).toEqual(addedMessage);
        expect(message.distance).not.toBeDefined();
      });

      test('return correct message - with location', async () => {
        const { latitude, longitude } = { ...addedMessage.location };
        const query = `?latitude=${latitude}&longitude=${longitude}`;
        const { body: message } = await api.get(`${MESSAGES_ENDPOINT}/${addedMessage.id}${query}`)
          .expect(200);
        expect(message.distance).toBeDefined();
        expect(message.distance).toBe(0);
      });
    });
    describe('invalid request', () => {
      test('fail with 404 ', async () => {
        const id = addedMessage.id + 1;
        const { body: errorMessage } = await api.get(`${MESSAGES_ENDPOINT}/${id}`)
          .expect(404);
        expect(errorMessage).toBe(`Message with ID: ${id} not found`);
      });
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
