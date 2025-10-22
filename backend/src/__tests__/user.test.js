import request from 'supertest';
import app from '../server.js';
import prisma from '../utils/prisma.js';

describe('User API Tests', () => {
  let userToken;
  let userId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@demo.com',
        password: 'user123'
      });
    userToken = res.body.token;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/user/profile', () => {
    test('should get user profile', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).toHaveProperty('username');
      expect(res.body.user).not.toHaveProperty('password');
    });
  });

  describe('PUT /api/user/profile', () => {
    test('should update user profile', async () => {
      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ username: 'UpdatedUsername' })
        .expect(200);

      expect(res.body.user).toHaveProperty('username', 'UpdatedUsername');
    });
  });

  describe('GET /api/user/stats', () => {
    test('should get user statistics', async () => {
      const res = await request(app)
        .get('/api/user/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('totalWords');
      expect(res.body).toHaveProperty('masteredWords');
      expect(res.body).toHaveProperty('learningWords');
    });
  });

  describe('User Word Bank', () => {
    let wordId;

    beforeAll(async () => {
      // Get a word to add to bank
      const wordsRes = await request(app).get('/api/words');
      if (wordsRes.body.words.length > 0) {
        wordId = wordsRes.body.words[0].id;
      }
    });

    test('should get user word bank', async () => {
      const res = await request(app)
        .get('/api/user/words')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('words');
      expect(Array.isArray(res.body.words)).toBe(true);
    });

    test('should add word to bank', async () => {
      if (wordId) {
        const res = await request(app)
          .post('/api/user/words')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ wordId })
          .expect(201);

        expect(res.body.userWord).toHaveProperty('wordId', wordId);
      }
    });

    test('should remove word from bank', async () => {
      if (wordId) {
        // Get user word to delete
        const wordsRes = await request(app)
          .get('/api/user/words')
          .set('Authorization', `Bearer ${userToken}`);
        
        if (wordsRes.body.words.length > 0) {
          const userWordId = wordsRes.body.words[0].id;
          
          await request(app)
            .delete(`/api/user/words/${userWordId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);
        }
      }
    });
  });
});

