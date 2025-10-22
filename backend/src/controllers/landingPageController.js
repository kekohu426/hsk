import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import aiLandingPageService from '../services/aiLandingPageService.js';

/**
 * 生成词条落地页(管理端)
 * POST /api/admin/landing-pages/generate
 */
export const generateLandingPage = async (req, res, next) => {
  try {
    const { word, pinyin, hskLevel, coreMeaning, audience, tone, keywords } = req.body;

    if (!word) {
      throw new AppError('缺少必填参数: word', 400);
    }

    //  查询现有词条数据(若存在)
    let wordRecord = null;
    try {
      wordRecord = await prisma.word.findFirst({
        where: { chinese: word }
      });
    } catch (error) {
      console.log('[Landing Page] 词条不存在,将使用输入参数');
    }

    // 参数补充
    const params = {
      word,
      pinyin: pinyin || wordRecord?.pinyin || '',
      hskLevel: hskLevel || wordRecord?.hskLevel || 1,
      coreMeaning: coreMeaning || wordRecord?.englishDefinition || '',
      audience: audience || '零基础成人学习者',
      tone: tone || '亲和+权威',
      keywords: keywords || {
        main: word,
        longTail: [`${word}的意思`, `${word}怎么用`, `${word}例句`],
        lsi: [`中文${word}`, `汉语${word}`, `HSK${hskLevel || 1}${word}`],
        qa: [`${word}是什么意思`, `${word}怎么读`, `${word}怎么记`]
      }
    };

    console.log('[Landing Page] 生成参数:', params);

    // 调用AI生成
    const result = await aiLandingPageService.generateLandingPageContent(params);

    // 验证
    aiLandingPageService.validateLandingPageJson(result.content);

    console.log('[Landing Page] 生成成功, SEO评分:', result.metrics.score);

    res.json({
      success: true,
      content: result.content,
      metrics: result.metrics,
      prompt: result.prompt.substring(0, 500) + '...', // 仅返回片段
      message: result.metrics.isValid 
        ? '✅ 内容生成成功,所有质量指标达标'
        : `⚠️ 内容已生成,但存在以下问题: ${result.metrics.issues.join('; ')}`
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 保存/发布落地页
 * POST /api/admin/landing-pages
 */
export const saveLandingPage = async (req, res, next) => {
  try {
    const { word, slug, hskLevel, jsonContent, metrics, status, prompt, rawResponse } = req.body;

    if (!word || !slug || !jsonContent) {
      throw new AppError('缺少必填参数: word, slug, jsonContent', 400);
    }

    const serializedContent = typeof jsonContent === 'string'
      ? jsonContent
      : JSON.stringify(jsonContent);

    const sanitizedPrompt = typeof prompt === 'string' ? prompt : '通过管理端生成';
    const serializedRawResponse = typeof rawResponse === 'string'
      ? rawResponse
      : rawResponse
        ? JSON.stringify(rawResponse)
        : null;

    // Upsert
    const record = await prisma.wordLandingPage.upsert({
      where: { word },
      update: {
        jsonContent: serializedContent,
        seoScore: metrics?.score || 0,
        status: status || 'DRAFT',
        wordCount: metrics?.longFormChars || 0,
        exampleCount: metrics?.exampleCount || 0,
        faqCount: metrics?.faqCount || 0,
        updatedAt: new Date(),
        aiPrompt: sanitizedPrompt,
        aiResponseRaw: serializedRawResponse
      },
      create: {
        word,
        slug,
        hskLevel: hskLevel || 1,
        jsonContent: serializedContent,
        seoScore: metrics?.score || 0,
        status: status || 'DRAFT',
        aiPrompt: sanitizedPrompt,
        aiResponseRaw: serializedRawResponse,
        wordCount: metrics?.longFormChars || 0,
        exampleCount: metrics?.exampleCount || 0,
        faqCount: metrics?.faqCount || 0
      }
    });

    console.log(`[Landing Page] 已保存: ${word} (${status || 'DRAFT'})`);

    res.json({
      success: true,
      landingPage: record,
      message: status === 'PUBLISHED' ? '✅ 落地页已发布' : '✅ 落地页已保存为草稿'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取落地页列表(管理端)
 * GET /api/admin/landing-pages
 */
export const listLandingPages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where = status ? { status } : {};

    const [pages, total] = await Promise.all([
      prisma.wordLandingPage.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      }),
      prisma.wordLandingPage.count({ where })
    ]);

    res.json({
      success: true,
      pages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个落地页(管理端)
 * GET /api/admin/landing-pages/:slug
 */
export const getLandingPage = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const page = await prisma.wordLandingPage.findUnique({
      where: { slug }
    });

    if (!page) {
      throw new AppError('落地页不存在', 404);
    }

    res.json({
      success: true,
      page
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取已发布的落地页列表(公开)
 * GET /api/landing-pages
 */
export const getPublishedLandingPages = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const where = { status: 'PUBLISHED' };

    const [pages, total] = await Promise.all([
      prisma.wordLandingPage.findMany({
        where,
        select: {
          slug: true,
          word: true,
          hskLevel: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      }),
      prisma.wordLandingPage.count({ where })
    ]);

    res.json({
      success: true,
      pages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个已发布的落地页(公开)
 * GET /api/landing-pages/:slug
 */
export const getPublishedLandingPage = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const page = await prisma.wordLandingPage.findFirst({
      where: {
        slug,
        status: 'PUBLISHED'
      }
    });

    if (!page) {
      throw new AppError('落地页不存在或未发布', 404);
    }

    res.json({
      success: true,
      page
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 删除落地页(管理端)
 * DELETE /api/admin/landing-pages/:id
 */
export const deleteLandingPage = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.wordLandingPage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '✅ 落地页已删除'
    });

  } catch (error) {
    next(error);
  }
};
