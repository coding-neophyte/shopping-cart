const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  username: 'mockuser',
  email: 'mockemail',
  password: 'mockpassword'
};

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should register new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(mockUser);

    
    expect(res.body).toEqual({
      username: expect.any(String),
      email: expect.any(String)
    });
  });
});
