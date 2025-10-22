import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/articles?level=BEGINNER&page=1&limit=10
export const getArticles = async (req, res, next) => {
  try {
    const { level, page = 1, limit = 10, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      status: 'PUBLISHED',
      ...(level && { level }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { excerpt: { contains: search } }
        ]
      })
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          titleEn: true,
          slug: true,
          excerpt: true,
          level: true,
          hskLevel: true,
          readTime: true,
          wordCount: true,
          coverImage: true,
          publishedAt: true,
          viewCount: true,
          newWords: true
        }
      }),
      prisma.article.count({ where })
    ]);

    res.json({
      articles,
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

// GET /api/articles/:id
export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findFirst({
      where: {
        id,
        status: 'PUBLISHED'
      }
    });

    if (!article) {
      throw new AppError('Article not found', 404);
    }

    // If user is logged in, get their reading progress
    let readingProgress = null;
    if (req.user) {
      readingProgress = await prisma.articleView.findFirst({
        where: {
          userId: req.user.userId,
          articleId: article.id
        },
        select: {
          readProgress: true,
          completedQuiz: true,
          quizScore: true,
          createdAt: true
        }
      });
    }

    res.json({ article, readingProgress });
  } catch (error) {
    next(error);
  }
};

// GET /api/articles/slug/:slug
export const getArticleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findFirst({
      where: {
        slug,
        status: 'PUBLISHED'
      }
    });

    if (!article) {
      throw new AppError('Article not found', 404);
    }

    // If user is logged in, get their reading progress
    let readingProgress = null;
    if (req.user) {
      readingProgress = await prisma.articleView.findFirst({
        where: {
          userId: req.user.userId,
          articleId: article.id
        },
        select: {
          readProgress: true,
          completedQuiz: true,
          quizScore: true,
          createdAt: true
        }
      });
    }

    res.json({ article, readingProgress });
  } catch (error) {
    next(error);
  }
};

// POST /api/articles/:id/view
export const incrementArticleView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { readProgress, completedQuiz, quizScore } = req.body;

    // Increment view count
    await prisma.article.update({
      where: { id },
      data: {
        viewCount: { increment: 1 }
      }
    });

    // If user is logged in, record their progress
    if (req.user) {
      await prisma.articleView.upsert({
        where: {
          userId_articleId: {
            userId: req.user.userId,
            articleId: id
          }
        },
        create: {
          userId: req.user.userId,
          articleId: id,
          readProgress: readProgress || 0,
          completedQuiz: completedQuiz || false,
          quizScore: quizScore || null
        },
        update: {
          readProgress: readProgress,
          completedQuiz: completedQuiz,
          quizScore: quizScore
        }
      });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
