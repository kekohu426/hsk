import express from 'express';
import { 
  getPublishedWords,
  getPublishedWordBySlug
} from '../controllers/wordEntryController.js';
import { 
  getWords,
  getHSKLevels,
  getWordSlugs,
  getWordDetail
} from '../controllers/wordController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// 获取词汇列表（用于HSK词库浏览）
router.get('/', optionalAuth, getWords);

// 获取HSK级别信息
router.get('/hsk/levels', getHSKLevels);

// 获取词条slugs（用于sitemap/SSG）
router.get('/slugs', getWordSlugs);

// 获取统一的词条数据（词条+落地页+用户进度）
router.get('/detail/:slug', optionalAuth, getWordDetail);

// 获取已发布的词条列表（公开，可选认证）
router.get('/published', optionalAuth, getPublishedWords);

// 获取单个已发布词条详情（公开，可选认证）
router.get('/published/:slug', optionalAuth, getPublishedWordBySlug);

export default router;




