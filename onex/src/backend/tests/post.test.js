// test/post.test.js
require('./setup');
const seedPosts = require('./seed');
const request = require('supertest');
const app = require('../server');
const Post = require('../models/Post');

beforeEach(async () => {
  await seedPosts(10); // populate test DB before each test
});

describe('GET /api/posts', () => {
  it('should return 10 seeded posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(10);
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('description');
  });
});

