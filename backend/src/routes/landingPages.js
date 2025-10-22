import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  generateLandingPage,
  saveLandingPage,
  listLandingPages,
  getLandingPage,
  deleteLandingPage
} from '../controllers/landingPageController.js';

const router = Router();

// 管理端路由(需要认证+管理员权限)
router.use(authenticate);
router.use(authorize('ADMIN'));

// 生成落地页
router.post('/generate', generateLandingPage);

// 保存/发布落地页
router.post('/', saveLandingPage);

// 获取落地页列表
router.get('/', listLandingPages);

// 获取单个落地页
router.get('/:slug', getLandingPage);

// 删除落地页
router.delete('/:id', deleteLandingPage);

export default router;
