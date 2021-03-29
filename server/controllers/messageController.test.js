const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const MESSAGES_ENDPOINT = '/api/v1/messages';

describe('message', () => {
  describe('GET messages', () => {
    test('content JSON', async () => {
      await api
        .get(`${MESSAGES_ENDPOINT}`)
        .expect('Content-type', /application\/json/);
    });

    test('status 200', async () => {
      await api
        .get(`${MESSAGES_ENDPOINT}`)
        .expect(200);
    });

    test('returns array', async () => {
      const { body: messages } = await api
        .get(`${MESSAGES_ENDPOINT}`);
      expect(Array.isArray(messages)).toBe(true);
    });
  });

  describe('POST message', () => {
    const newMessage = {
      username: 'testUsername',
      message: 'testMessage',
      location: {
        latitude: 0.00,
        longitude: 0.00,
      },
    };
    test('new message response 201', async () => {
      await api
        .post(MESSAGES_ENDPOINT)
        .send(newMessage)
        .set('Accept', 'application/json')
        .expect(201);
    });

    test('message added', async () => {
      const { body: messagesBefore } = await api
        .get(MESSAGES_ENDPOINT)
        .expect(200);

      await api
        .post(MESSAGES_ENDPOINT)
        .send(newMessage)
        .set('Accept', 'application/json')
        .expect(201);

      const { body: messagesAfter } = await api
        .get(MESSAGES_ENDPOINT)
        .expect(200);

      expect(messagesAfter.length).toBe(messagesBefore.length + 1);
    });

    // TODO check missing attributes in request body => status 400

    // TODO check extra attributes not saved. Like id

    // TODO check returned object contains right attributes

    // TODO check endDate default value +1 day

    // TODO check endDate>created
  });

  describe('GET single message', () => {
  });
});
