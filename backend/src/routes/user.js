import express from 'express';
import {
  getUserWords,
  addWordToBank,
  batchAddWords,
  updateUserWord,
  deleteUserWord,
  getUserStats,
  getProfile,
  updateProfile
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/user/profile
router.get('/profile', getProfile);

// PATCH /api/user/profile (also support PUT for compatibility)
router.patch('/profile', updateProfile);
router.put('/profile', updateProfile);

// GET /api/user/words
router.get('/words', getUserWords);

// POST /api/user/words
router.post('/words', addWordToBank);

// POST /api/user/words/batch
router.post('/words/batch', batchAddWords);

// PATCH /api/user/words/:id
router.patch('/words/:id', updateUserWord);

// DELETE /api/user/words/:id
router.delete('/words/:id', deleteUserWord);

// GET /api/user/stats
router.get('/stats', getUserStats);

export default router;

