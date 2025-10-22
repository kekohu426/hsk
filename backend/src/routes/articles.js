import express from 'express';
import { getArticles, getArticleById, getArticleBySlug, incrementArticleView } from '../controllers/articleController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/articles?level=BEGINNER&page=1
router.get('/', optionalAuth, getArticles);

// GET /api/articles/slug/:slug (must be before /:id)
router.get('/slug/:slug', optionalAuth, getArticleBySlug);

// GET /api/articles/:slug (treat as slug first for user-friendly URLs)
router.get('/:slug', optionalAuth, getArticleBySlug);

// POST /api/articles/:id/view
router.post('/:id/view', optionalAuth, incrementArticleView);

export default router;

