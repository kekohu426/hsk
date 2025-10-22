import express from 'express';
import { getWords, getWordById, getWordBySlug, getHSKLevels, getWordSlugs, getWordDetail } from '../controllers/wordController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/words - Get all words (with filters)
router.get('/', optionalAuth, getWords);

// GET /api/words/hsk/levels - Get HSK levels info
router.get('/hsk/levels', getHSKLevels);

// GET /api/words/slugs - Get published word slugs (for SSG/sitemap)
router.get('/slugs', getWordSlugs);

// GET /api/words/detail/:slug - Get unified word data (word + landing page + user progress)
router.get('/detail/:slug', optionalAuth, getWordDetail);

// GET /api/words/slug/:slug - Get word by slug
router.get('/slug/:slug', optionalAuth, getWordBySlug);

// GET /api/words/:id - Get word by ID (must be last to avoid conflicts)
router.get('/:id', optionalAuth, getWordById);

export default router;
