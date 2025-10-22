import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();

// GET /api/words?level=2&page=1&limit=20
export const getWords = async (req, res, next) => {
  try {
    const {
      level,
      page = 1,
      limit = 20,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      status: 'PUBLISHED',
      ...(level && { hskLevel: parseInt(level) }),
      ...(search && {
        word: { contains: search }
      })
    };

    const [words, total] = await Promise.all([
      prisma.wordEntry.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [
          { hskLevel: 'asc' },
          { word: 'asc' }
        ],
        select: {
          id: true,
          word: true,
          slug: true,
          hskLevel: true,
          publishedAt: true
        }
      }),
      prisma.wordEntry.count({ where })
    ]);

    res.json({
      words,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/words/:id
export const getWordById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const word = await prisma.wordEntry.findFirst({
      where: { id, status: 'PUBLISHED' }
    });

    if (!word) {
      throw new AppError('Word not found', 404);
    }

    res.json({ word });
  } catch (error) {
    next(error);
  }
};

// GET /api/words/slug/:slug
export const getWordBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const word = await prisma.wordEntry.findFirst({
      where: { slug, status: 'PUBLISHED' }
    });

    if (!word) {
      throw new AppError('Word not found', 404);
    }

    res.json({ word });
  } catch (error) {
    next(error);
  }
};

// GET /api/words/hsk/levels
export const getHSKLevels = async (req, res, next) => {
  try {
    const levels = await prisma.wordEntry.groupBy({
      by: ['hskLevel'],
      where: { status: 'PUBLISHED' },
      _count: {
        hskLevel: true
      }
    });

    const levelInfo = levels.map(level => ({
      level: level.hskLevel,
      count: level._count.hskLevel,
      name: `HSK ${level.hskLevel}`
    }));

    res.json({ levels: levelInfo });
  } catch (error) {
    next(error);
  }
};

// GET /api/words/slugs - Get published word slugs (for SSG/sitemap)
export const getWordSlugs = async (req, res, next) => {
  try {
    const { page = 1, limit = 1000 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [words, landingPages] = await Promise.all([
      prisma.wordEntry.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          slug: true,
          publishedAt: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.landingPage.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          slug: true,
          publishedAt: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' }
      })
    ]);

    const allSlugs = [
      ...words.map(w => ({ slug: w.slug, type: 'word', publishedAt: w.publishedAt })),
      ...landingPages.map(lp => ({ slug: lp.slug, type: 'landing', publishedAt: lp.publishedAt }))
    ].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.json({ slugs: allSlugs });
  } catch (error) {
    next(error);
  }
};

// GET /api/words/detail/:slug - Get unified word data (word + landing page + user progress)
export const getWordDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.userId; // Optional auth

    // 1. 获取基础词汇数据
    const wordRecord = await prisma.wordEntry.findFirst({
      where: { slug, status: 'PUBLISHED' }
    });

    if (!wordRecord) {
      throw new AppError('Word not found', 404);
    }

    // 2. 获取landing page数据
    const landingPage = await prisma.landingPage.findFirst({
      where: { slug, status: 'PUBLISHED' }
    });

    // 3. 获取用户学习进度（如果已登录）
    let userProgress = null;
    if (userId) {
      const userWord = await prisma.userWord.findFirst({
        where: {
          userId,
          wordEntryId: wordRecord.id
        }
      });

      if (userWord) {
        userProgress = {
          level: userWord.status === 'MASTERED' ? 3 : userWord.status === 'LEARNING' ? 2 : 1,
          repetitions: userWord.repetitions,
          correctCount: userWord.correctCount,
          wrongCount: userWord.wrongCount,
          nextReviewDate: userWord.nextReview,
          isInWordBank: true
        };
      }
    }

    // 4. 构建响应数据
    const response = {
      word: {
        id: wordRecord.id,
        chinese: wordRecord.word,
        slug: wordRecord.slug,
        hskLevel: wordRecord.hskLevel
      },
      content: wordRecord.contentJson ? JSON.parse(wordRecord.contentJson) : null,
      landingPage: landingPage ? {
        id: landingPage.id,
        slug: landingPage.slug,
        content: landingPage.contentJson ? JSON.parse(landingPage.contentJson) : null
      } : null,
      userProgress,
      hasLandingPage: !!landingPage
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};