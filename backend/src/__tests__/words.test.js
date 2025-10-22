import request from 'supertest';
import app from '../server.js';
import prisma from '../utils/prisma.js';

describe('Words API Tests', () => {
  let adminToken;
  let userToken;
  let testWordId;

  beforeAll(async () => {
    // Login as admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@demo.com',
        password: 'admin123'
      });
    adminToken = adminRes.body.token;

    // Login as user
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

  describe('GET /api/words', () => {
    test('should get words list', async () => {
      const res = await request(app)
        .get('/api/words')
        .expect(200);

      expect(res.body).toHaveProperty('words');
      expect(Array.isArray(res.body.words)).toBe(true);
      expect(res.body).toHaveProperty('pagination');
    });

    test('should filter by HSK level', async () => {
      const res = await request(app)
        .get('/api/words?hskLevel=1')
        .expect(200);

      expect(res.body.words.every(w => w.hskLevel === 1)).toBe(true);
    });

    test('should support pagination', async () => {
      const res = await request(app)
        .get('/api/words?page=1&limit=5')
        .expect(200);

      expect(res.body.words.length).toBeLessThanOrEqual(5);
      expect(res.body.pagination).toHaveProperty('page', 1);
      expect(res.body.pagination).toHaveProperty('limit', 5);
    });

    test('should search words', async () => {
      const res = await request(app)
        .get('/api/words?search=你好')
        .expect(200);

      expect(res.body.words.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /api/words/:id', () => {
    test('should get word by ID', async () => {
      // First get a word ID
      const listRes = await request(app).get('/api/words');
      if (listRes.body.words.length > 0) {
        const wordId = listRes.body.words[0].id;
        
        const res = await request(app)
          .get(`/api/words/${wordId}`)
          .expect(200);

        expect(res.body.word).toHaveProperty('id', wordId);
        expect(res.body.word).toHaveProperty('chinese');
        expect(res.body.word).toHaveProperty('pinyin');
      }
    });

    test('should return 404 for non-existent word', async () => {
      await request(app)
        .get('/api/words/nonexistent-id')
        .expect(404);
    });
  });

  describe('GET /api/words/slug/:slug', () => {
    test('should get word by slug', async () => {
      const listRes = await request(app).get('/api/words');
      if (listRes.body.words.length > 0) {
        const slug = listRes.body.words[0].slug;
        
        const res = await request(app)
          .get(`/api/words/slug/${slug}`)
          .expect(200);

        expect(res.body.word).toHaveProperty('slug', slug);
      }
    });
  });

  describe('Admin Word Management', () => {
    const testWord = {
      chinese: '测试',
      pinyin: 'cèshì',
      pinyinNumeric: 'ce4shi4',
      englishDefinition: 'test',
      hskLevel: 1,
      exampleSentences: [
        {
          cn: '这是一个测试。',
          pinyin: 'zhè shì yī gè cèshì.',
          en: 'This is a test.'
        }
      ]
    };

    test('should create word as admin', async () => {
      const res = await request(app)
        .post('/api/admin/words')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testWord)
        .expect(201);

      expect(res.body.word).toHaveProperty('chinese', testWord.chinese);
      testWordId = res.body.word.id;
    });

    test('should reject word creation by non-admin', async () => {
      await request(app)
        .post('/api/admin/words')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testWord)
        .expect(403);
    });

    test('should update word as admin', async () => {
      const res = await request(app)
        .put(`/api/admin/words/${testWordId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ englishDefinition: 'updated test' })
        .expect(200);

      expect(res.body.word).toHaveProperty('englishDefinition', 'updated test');
    });

    test('should delete word as admin', async () => {
      await request(app)
        .delete(`/api/admin/words/${testWordId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});

