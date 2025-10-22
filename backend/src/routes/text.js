import express from 'express';
import { analyzeText } from '../controllers/textController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/text/analyze
router.post('/analyze', authenticate, analyzeText);

export default router;







