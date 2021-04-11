const supertest = require('supertest');
const app = require('../app');
const { currentTimeStamp } = require('../utils/time');
const { getMessages } = require('./testHelper');

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
        .get(MESSAGES_ENDPOINT)
        .expect(200);
    });

    test('returns array', async () => {
      const { body: messages } = await api
        .get(MESSAGES_ENDPOINT);
      expect(messages).toEqual([]);
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
        const { body: addedMessage } = await api
          .post(MESSAGES_ENDPOINT)
          .send(validMessage)
          .set('Accept', 'application/json')
          .expect(201);
        expect(addedMessage).toEqual(
          {
            id: addedMessage.id,
            ...validMessage,
            created,
            expires: 24,
            likes: 0,
            distance: 0,
          },
        );
        const messagesAfter = await getMessages(api);
        expect(messagesAfter).toHaveLength(messagesBefore.length + 1);
      });
    });

    describe('invalid messages', () => {
      test('missing username response 400', async () => {
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

        const messagesAfter = await getMessages(api);
        expect(messagesBefore.length).toBe(messagesAfter.length);
      });

      test('missing message response 400', async () => {
        const messagesBefore = await getMessages(api);
        const missingMessage = {
          username: 'testUsername',
          location: {
            latitude: 0.00,
            longitude: 0.00,
          },
        };
        await api
          .post(MESSAGES_ENDPOINT)
          .send(missingMessage)
          .set('Accept', 'application/json')
          .expect(400);

        const messagesAfter = await getMessages(api);
        expect(messagesBefore.length).toBe(messagesAfter.length);
      });

      test('invalid location response 400', async () => {
        const messagesBefore = await getMessages(api);
        const missinglocation = {
          username: 'testUsername',
          message: 'testMessage',
        };
        await api
          .post(MESSAGES_ENDPOINT)
          .send(missinglocation)
          .set('Accept', 'application/json')
          .expect(400);

        const emptyLocation = {
          username: 'testUsername',
          message: 'testMessage',
          location: {},
        };
        await api
          .post(MESSAGES_ENDPOINT)
          .send(emptyLocation)
          .set('Accept', 'application/json')
          .expect(400);

        const missingLatitude = {
          username: 'testUsername',
          message: 'testMessage',
          location: {
            longitude: 0.0,
          },
        };
        await api
          .post(MESSAGES_ENDPOINT)
          .send(missingLatitude)
          .set('Accept', 'application/json')
          .expect(400);

        const missingLongitude = {
          username: 'testUsername',
          message: 'testMessage',
          location: {
            latitude: 0.0,
          },
        };
        await api
          .post(MESSAGES_ENDPOINT)
          .send(missingLongitude)
          .set('Accept', 'application/json')
          .expect(400);

        const messagesAfter = await getMessages(api);
        expect(messagesBefore.length).toBe(messagesAfter.length);
      });
    });

    // TODO check missing attributes in request body => status 400
    // - valid input. message &username => String, location object containing latitude & longitude

    // TODO check extra attributes not saved. Like id

    // TODO check returned object contains right attributes

    // TODO check endDate default value +1 day

    // TODO check endDate>created
  });

  describe('GET single message', () => {
  });
});
