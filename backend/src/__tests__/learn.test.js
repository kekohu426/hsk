import request from 'supertest';
import app from '../server.js';
import prisma from '../utils/prisma.js';

describe('Learning API Tests', () => {
  let userToken;
  let userId;
  let userWordId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@demo.com',
        password: 'user123'
      });
    userToken = res.body.token;
    userId = res.body.user.id;

    // Add a word to user's bank for testing
    const wordsRes = await request(app).get('/api/words');
    if (wordsRes.body.words.length > 0) {
      const wordId = wordsRes.body.words[0].id;
      const addRes = await request(app)
        .post('/api/user/words')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ wordId });
      
      if (addRes.body.userWord) {
        userWordId = addRes.body.userWord.id;
      }
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/learn/review-queue', () => {
    test('should get review queue', async () => {
      const res = await request(app)
        .get('/api/learn/review-queue')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('words');
      expect(Array.isArray(res.body.words)).toBe(true);
      expect(res.body).toHaveProperty('totalDue');
    });

    test('should reject unauthorized access', async () => {
      await request(app)
        .get('/api/learn/review-queue')
        .expect(401);
    });
  });

  describe('POST /api/learn/review', () => {
    test('should submit review result', async () => {
      if (userWordId) {
        const res = await request(app)
          .post('/api/learn/review')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            userWordId: userWordId,
            quality: 4
          })
          .expect(200);

        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('nextReview');
      }
    });

    test('should reject invalid quality score', async () => {
      if (userWordId) {
        await request(app)
          .post('/api/learn/review')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            userWordId: userWordId,
            quality: 10 // Invalid score
          })
          .expect(400);
      }
    });
  });

  describe('GET /api/learn/stats', () => {
    test('should get learning statistics', async () => {
      const res = await request(app)
        .get('/api/learn/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('totalWords');
      expect(res.body).toHaveProperty('wordsReviewedToday');
      expect(res.body).toHaveProperty('currentStreak');
    });
  });

  describe('GET /api/learn/history', () => {
    test('should get learning history', async () => {
      const res = await request(app)
        .get('/api/learn/history')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('history');
      expect(Array.isArray(res.body.history)).toBe(true);
    });

    test('should support date range filter', async () => {
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const res = await request(app)
        .get(`/api/learn/history?startDate=${startDate}&endDate=${endDate}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(res.body.history)).toBe(true);
    });
  });

  describe('Learning Sessions', () => {
    test('should start a learning session', async () => {
      const res = await request(app)
        .post('/api/learn/session/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ sessionType: 'review' })
        .expect(201);

      expect(res.body).toHaveProperty('sessionId');
      expect(res.body).toHaveProperty('words');
    });

    test('should end a learning session', async () => {
      const startRes = await request(app)
        .post('/api/learn/session/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ sessionType: 'review' });

      if (startRes.body.sessionId) {
        const res = await request(app)
          .post(`/api/learn/session/${startRes.body.sessionId}/end`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            correctCount: 5,
            totalCount: 10
          })
          .expect(200);

        expect(res.body).toHaveProperty('success', true);
      }
    });
  });
});

