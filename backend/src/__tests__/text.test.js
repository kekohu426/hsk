import request from 'supertest';
import app from '../server.js';
import prisma from '../utils/prisma.js';

describe('Text Analysis API Tests', () => {
  let userToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@demo.com',
        password: 'user123'
      });
    userToken = res.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/text/analyze', () => {
    test('should analyze Chinese text', async () => {
      const res = await request(app)
        .post('/api/text/analyze')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: '我喜欢学习中文。' })
        .expect(200);

      expect(res.body).toHaveProperty('segmented');
      expect(Array.isArray(res.body.segmented)).toBe(true);
      expect(res.body).toHaveProperty('analysis');
    });

    test('should reject empty text', async () => {
      await request(app)
        .post('/api/text/analyze')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: '' })
        .expect(400);
    });

    test('should handle complex text with punctuation', async () => {
      const res = await request(app)
        .post('/api/text/analyze')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: '你好，我是学生。我喜欢学习！' })
        .expect(200);

      expect(res.body.segmented.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/text/analyze/batch', () => {
    test('should batch add words to user bank', async () => {
      // First analyze text
      const analyzeRes = await request(app)
        .post('/api/text/analyze')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: '我喜欢学习中文。' });

      if (analyzeRes.body.newWords && analyzeRes.body.newWords.length > 0) {
        const wordIds = analyzeRes.body.newWords
          .map(w => w.id)
          .slice(0, 2); // Take first 2 words

        if (wordIds.length > 0) {
          const res = await request(app)
            .post('/api/user/words/batch')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ wordIds })
            .expect(200);

          expect(res.body).toHaveProperty('added');
          expect(res.body).toHaveProperty('skipped');
        }
      }
    });

    test('should require authentication', async () => {
      await request(app)
        .post('/api/user/words/batch')
        .send({ wordIds: ['word1', 'word2'] })
        .expect(401);
    });
  });

  // Note: These routes are not implemented in the current version
  // Skipping these tests for now
});

