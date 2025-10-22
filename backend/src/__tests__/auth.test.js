import request from 'supertest';
import app from '../server.js';
import prisma from '../utils/prisma.js';

describe('Authentication API Tests', () => {
  let testUser = {
    email: `test${Date.now()}@example.com`,
    username: `testuser${Date.now()}`,
    password: 'Test123456'
  };

  afterAll(async () => {
    // Cleanup
    try {
      await prisma.user.deleteMany({
        where: { email: { contains: 'test' } }
      });
    } catch (error) {
      console.log('Cleanup error:', error);
    }
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('username', testUser.username);
      expect(res.body.user).not.toHaveProperty('password');
    });

    test('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    test('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          username: 'testuser',
          password: 'Test123456'
        })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    test('should reject short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          username: 'testuser2',
          password: '123'
        })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    test('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123'
        })
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    test('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123456'
        })
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('JWT Token Tests', () => {
    let token;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      token = res.body.token;
    });

    test('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.user).toHaveProperty('email');
    });

    test('should reject request without token', async () => {
      await request(app)
        .get('/api/user/profile')
        .expect(401);
    });

    test('should reject request with invalid token', async () => {
      await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });
  });
});

