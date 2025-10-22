import express from 'express';
import { getDueWords, submitReview, startSession, endSession, getLearnStats, getLearnHistory } from '../controllers/learnController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/learn/queue (alias for due-words)
router.get('/queue', getDueWords);

// GET /api/learn/review-queue (alias for due-words)
router.get('/review-queue', getDueWords);

// GET /api/learn/due-words
router.get('/due-words', getDueWords);

// GET /api/learn/stats
router.get('/stats', getLearnStats);

// GET /api/learn/history
router.get('/history', getLearnHistory);

// POST /api/learn/review
router.post('/review', submitReview);

// POST /api/learn/session/start
router.post('/session/start', startSession);

// POST /api/learn/session/:id/end
router.post('/session/:id/end', endSession);

export default router;

