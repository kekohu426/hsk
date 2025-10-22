import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';
import * as userLearningStatsController from '../controllers/userLearningStatsController.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('ADMIN'));

// Stats
router.get('/stats', adminController.getStats);

// Articles
router.get('/articles', adminController.getArticles);
router.get('/articles/:id', adminController.getArticle);
router.post('/articles', adminController.createArticle);
router.post('/articles/generate', adminController.generateArticle);
router.put('/articles/:id', adminController.updateArticle);
router.delete('/articles/:id', adminController.deleteArticle);

// Words
router.get('/words', adminController.getWords);
router.post('/words', adminController.createWord);
router.post('/words/generate', adminController.generateWords);
router.post('/words/batch', adminController.batchCreateWords);
router.post('/words/import', adminController.importWordsByLevel);
router.post('/words/study-data', adminController.generateStudyDataForWords);
router.put('/words/:id', adminController.updateWord);
router.delete('/words/:id', adminController.deleteWord);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// User Learning Stats
router.get('/user-learning-stats', userLearningStatsController.getUserLearningStats);
router.get('/users/:userId/learning-details', userLearningStatsController.getUserLearningDetails);

// AI Config
router.get('/ai-config', adminController.getAIConfig);
router.put('/ai-config', adminController.updateAIConfigGlobal);
router.put('/ai-config/:id', adminController.updateAIConfig);
router.patch('/ai-config/:id', adminController.toggleAIConfig);

// AI Generation (alternative paths for backward compatibility)
router.post('/ai/generate-article', adminController.generateArticle);
router.post('/ai/generate-vocab', adminController.generateWords);

export default router;
