import express from 'express';
import { 
  importWords,
  getWordEntries,
  getWordEntryById,
  publishWordEntry,
  deleteWordEntry,
  generateWords
} from '../controllers/wordEntryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// 所有路由都需要管理员权限
router.use(authenticate);
router.use(authorize('ADMIN'));

// 批量导入词汇
router.post('/import', importWords);

// AI生成词条
router.post('/generate', generateWords);

// 获取词条列表
router.get('/', getWordEntries);

// 获取单个词条详情
router.get('/:id', getWordEntryById);

// 发布词条
router.post('/:id/publish', publishWordEntry);

// 删除词条
router.delete('/:id', deleteWordEntry);

export default router;

