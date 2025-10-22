import request from 'supertest';
import app from '../server.js';
import prisma from '../utils/prisma.js';

describe('Admin API Tests', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@demo.com',
        password: 'admin123'
      });
    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@demo.com',
        password: 'user123'
      });
    userToken = userRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Admin Authorization', () => {
    test('should allow admin access to admin routes', async () => {
      await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    test('should reject non-admin access to admin routes', async () => {
      await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    test('should reject unauthenticated access to admin routes', async () => {
      await request(app)
        .get('/api/admin/stats')
        .expect(401);
    });
  });

  describe('GET /api/admin/stats', () => {
    test('should get admin dashboard statistics', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('totalUsers');
      expect(res.body).toHaveProperty('totalArticles');
      expect(res.body).toHaveProperty('totalWords');
      expect(res.body).toHaveProperty('activeUsersToday');
    });
  });

  describe('AI Generation', () => {
    test('should generate article with AI (mock)', async () => {
      const res = await request(app)
        .post('/api/admin/ai/generate-article')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          topic: '中国传统节日',
          difficulty: 'beginner',
          keywords: '春节,端午节',
          wordCount: 200
        })
        .expect(200);

      expect(res.body).toHaveProperty('article');
      expect(res.body.article).toHaveProperty('title');
      expect(res.body.article).toHaveProperty('content');
      expect(res.body.article).toHaveProperty('newWords');
      expect(res.body.article).toHaveProperty('quiz');
    });

    test('should generate vocabulary with AI (mock)', async () => {
      const res = await request(app)
        .post('/api/admin/ai/generate-vocab')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          hskLevel: 1,
          count: 5
        })
        .expect(200);

      expect(res.body).toHaveProperty('words');
      expect(Array.isArray(res.body.words)).toBe(true);
      expect(res.body.words.length).toBeGreaterThan(0);
    });
  });

  describe('User Management', () => {
    test('should get all users', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('users');
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    test('should update user status', async () => {
      // Get a user first
      const usersRes = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      if (usersRes.body.users.length > 0) {
        const userId = usersRes.body.users.find(u => u.role !== 'admin')?.id;
        
        if (userId) {
          const res = await request(app)
            .put(`/api/admin/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ role: 'user' })
            .expect(200);

          expect(res.body.user).toHaveProperty('id', userId);
        }
      }
    });
  });

  describe('AI Configuration', () => {
    test('should get AI config', async () => {
      const res = await request(app)
        .get('/api/admin/ai-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('config');
    });

    test('should update AI config', async () => {
      const res = await request(app)
        .put('/api/admin/ai-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          provider: 'glm',
          model: 'glm-4',
          temperature: 0.7
        })
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
    });
  });
});

