import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateWordEntry, batchGenerateWordEntries } from '../services/wordEntryAIService.js';

/**
 * 生成URL友好的slug
 */
function generateSlug(word) {
  // 简单的拼音映射（后续可以使用pinyin库）
  // 这里先使用一个简单的方案：word + 随机字符
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${word.toLowerCase().replace(/\s+/g, '-')}-${randomSuffix}`;
}

/**
 * 批量导入词汇
 * POST /api/admin/words/import
 */
export const importWords = async (req, res, next) => {
  try {
    const { words, hskLevel } = req.body;

    // 参数验证
    if (!words || !hskLevel) {
      throw new AppError('缺少必填参数: words, hskLevel', 400);
    }

    if (![1, 2, 3, 4, 5, 6].includes(hskLevel)) {
      throw new AppError('HSK等级必须在1-6之间', 400);
    }

    // 处理输入：支持逗号、换行符分隔
    let wordList = [];
    if (typeof words === 'string') {
      wordList = words
        .split(/[,，\n\r]+/)  // 支持中英文逗号、换行符
        .map(w => w.trim())
        .filter(w => w.length > 0);
    } else if (Array.isArray(words)) {
      wordList = words.map(w => String(w).trim()).filter(w => w.length > 0);
    } else {
      throw new AppError('words参数格式错误，应为字符串或数组', 400);
    }

    // 去重
    wordList = [...new Set(wordList)];

    if (wordList.length === 0) {
      throw new AppError('词汇列表为空', 400);
    }

    if (wordList.length > 100) {
      throw new AppError('单次导入不能超过100个词汇', 400);
    }

    // 检查已存在的词汇
    const existingWords = await prisma.wordEntry.findMany({
      where: {
        word: {
          in: wordList
        }
      },
      select: {
        word: true
      }
    });

    const existingWordSet = new Set(existingWords.map(w => w.word));
    const newWords = wordList.filter(w => !existingWordSet.has(w));
    const duplicates = wordList.filter(w => existingWordSet.has(w));

    // 批量创建词条
    const createdEntries = [];
    for (const word of newWords) {
      const slug = generateSlug(word);
      const entry = await prisma.wordEntry.create({
        data: {
          word,
          slug,
          hskLevel,
          contentJson: '{}', // 空JSON，等待AI生成
          status: 'PENDING_IMPORT'
        }
      });
      createdEntries.push(entry);
    }

    res.json({
      success: true,
      message: `成功导入 ${createdEntries.length} 个词汇`,
      data: {
        imported: createdEntries.map(e => ({
          id: e.id,
          word: e.word,
          slug: e.slug,
          hskLevel: e.hskLevel,
          status: e.status
        })),
        duplicates: duplicates.length > 0 ? duplicates : null,
        stats: {
          total: wordList.length,
          imported: createdEntries.length,
          duplicated: duplicates.length
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取词条列表（管理端）
 * GET /api/admin/words
 */
export const getWordEntries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      hskLevel,
      search
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // 构建where条件
    const where = {};

    if (status) {
      where.status = status;
    }

    if (hskLevel) {
      where.hskLevel = parseInt(hskLevel);
    }

    if (search) {
      where.word = {
        contains: search
      };
    }

    // 查询数据
    const [entries, total] = await Promise.all([
      prisma.wordEntry.findMany({
        where,
        select: {
          id: true,
          word: true,
          slug: true,
          hskLevel: true,
          status: true,
          seoScore: true,
          wordCount: true,
          importedAt: true,
          generatedAt: true,
          publishedAt: true,
          generateError: true
        },
        orderBy: {
          importedAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.wordEntry.count({ where })
    ]);

    res.json({
      success: true,
      data: entries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个词条详情（管理端）
 * GET /api/admin/words/:id
 */
export const getWordEntryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entry = await prisma.wordEntry.findUnique({
      where: { id }
    });

    if (!entry) {
      throw new AppError('词条不存在', 404);
    }

    // 解析contentJson
    let content = {};
    try {
      content = JSON.parse(entry.contentJson);
    } catch (e) {
      console.warn('[WordEntry] JSON解析失败:', e.message);
    }

    res.json({
      success: true,
      data: {
        ...entry,
        content
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 发布词条
 * POST /api/admin/words/:id/publish
 */
export const publishWordEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entry = await prisma.wordEntry.findUnique({
      where: { id }
    });

    if (!entry) {
      throw new AppError('词条不存在', 404);
    }

    if (entry.status !== 'GENERATED') {
      throw new AppError(`词条状态必须为"已生成"才能发布，当前状态：${entry.status}`, 400);
    }

    // 更新为已发布
    const updated = await prisma.wordEntry.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: '词条已发布',
      data: updated
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 删除词条
 * DELETE /api/admin/words/:id
 */
export const deleteWordEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 检查是否有用户关联
    const userWordCount = await prisma.userWord.count({
      where: { wordEntryId: id }
    });

    if (userWordCount > 0) {
      throw new AppError(`该词条已被 ${userWordCount} 个用户添加到词库，无法删除`, 400);
    }

    await prisma.wordEntry.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '词条已删除'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取已发布的词条列表（用户端）
 * GET /api/words/published
 */
export const getPublishedWords = async (req, res, next) => {
  try {
    const { hskLevel, page = 1, limit = 50 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      status: 'PUBLISHED'
    };

    if (hskLevel) {
      where.hskLevel = parseInt(hskLevel);
    }

    const [words, total] = await Promise.all([
      prisma.wordEntry.findMany({
        where,
        select: {
          id: true,
          word: true,
          slug: true,
          hskLevel: true,
          seoScore: true,
          publishedAt: true
        },
        orderBy: [
          { hskLevel: 'asc' },
          { word: 'asc' }
        ],
        skip,
        take: limitNum
      }),
      prisma.wordEntry.count({ where })
    ]);

    res.json({
      success: true,
      data: words,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个已发布词条的详情（用户端）
 * GET /api/words/published/:slug
 */
export const getPublishedWordBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id; // 可选认证

    const word = await prisma.wordEntry.findFirst({
      where: {
        slug,
        status: 'PUBLISHED'
      }
    });

    if (!word) {
      throw new AppError('词条不存在或未发布', 404);
    }

    // 解析JSON内容
    let content = {};
    try {
      content = JSON.parse(word.contentJson);
    } catch (e) {
      console.warn('[WordEntry] JSON解析失败:', e.message);
    }

    // 如果用户已登录，获取学习进度
    let userProgress = null;
    if (userId) {
      userProgress = await prisma.userWord.findFirst({
        where: {
          userId,
          wordEntryId: word.id
        }
      });
    }

    res.json({
      success: true,
      data: {
        id: word.id,
        word: word.word,
        slug: word.slug,
        hskLevel: word.hskLevel,
        content,
        userProgress: userProgress ? {
          status: userProgress.status,
          addedAt: userProgress.addedAt,
          notes: userProgress.notes
        } : null
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 生成词条（AI）
 * POST /api/admin/words/generate
 */
export const generateWords = async (req, res, next) => {
  try {
    const { wordIds } = req.body;  // 词条ID数组

    if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
      throw new AppError('缺少参数: wordIds（词条ID数组）', 400);
    }

    if (wordIds.length > 10) {
      throw new AppError('单次生成不能超过10个词条', 400);
    }

    // 获取AI配置
    const aiConfig = await prisma.aIConfig.findFirst({
      where: {
        isActive: true,
        modelName: 'GLM-4'
      }
    });

    if (!aiConfig || !aiConfig.apiKey) {
      throw new AppError('GLM-4 API配置不存在或未激活，请先在AI配置中设置', 500);
    }

    // 设置响应头支持SSE（Server-Sent Events）
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 进度回调函数
    const onProgress = (progress) => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    };

    // 批量生成
    const results = await batchGenerateWordEntries(
      wordIds,
      aiConfig.apiKey,
      onProgress
    );

    // 发送最终结果
    res.write(`data: ${JSON.stringify({ 
      type: 'complete', 
      results 
    })}\n\n`);
    
    res.end();

  } catch (error) {
    // SSE模式下的错误处理
    if (!res.headersSent) {
      next(error);
    } else {
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        message: error.message 
      })}\n\n`);
      res.end();
    }
  }
};

