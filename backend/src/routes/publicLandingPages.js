import { Router } from 'express';
import {
  getPublishedLandingPages,
  getPublishedLandingPage
} from '../controllers/landingPageController.js';

const router = Router();

// 公开路由(无需认证)

// 获取已发布的落地页列表
router.get('/', getPublishedLandingPages);

// 获取单个已发布的落地页
router.get('/:slug', getPublishedLandingPage);

export default router;
