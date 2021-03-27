const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const API_ENDPOINT = '/api/v1';

describe('GET messages', () => {
  test('content JSON', async () => {
    await api
      .get(`${API_ENDPOINT}/messages`)
      .expect('Content-type', /application\/json/);
  });

  test('status 200', async () => {
    await api
      .get(`${API_ENDPOINT}/messages`)
      .expect(200);
  });

  test('returns array', async () => {
    const response = await api
      .get(`${API_ENDPOINT}/messages`);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
