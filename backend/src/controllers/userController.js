import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/user/profile
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        preferredLang: true,
        isPremium: true,
        premiumUntil: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/words?status=NEW&hskLevel=2
export const getUserWords = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status, hskLevel, isFavorite, page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId,
      ...(status && { status }),
      ...(isFavorite && { isFavorite: isFavorite === 'true' })
    };

    const [userWords, total] = await Promise.all([
      prisma.userWord.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          wordEntry: {
            select: {
              id: true,
              word: true,
              slug: true,
              hskLevel: true,
              contentJson: true
            }
          }
        },
        orderBy: [
          { addedAt: 'desc' }
        ]
      }),
      prisma.userWord.count({ where })
    ]);

    // Filter by HSK level if specified (done in memory for simplicity)
    let filteredWords = userWords;
    if (hskLevel) {
      filteredWords = userWords.filter(uw => uw.wordEntry.hskLevel === parseInt(hskLevel));
    }

    res.json({
      words: filteredWords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: hskLevel ? filteredWords.length : total
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/user/words
export const addWordToBank = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { wordId, source, status } = req.body;

    if (!wordId) {
      throw new AppError('wordId is required', 400);
    }

    // Validate status if provided
    const validStatuses = ['NEW', 'LEARNING', 'MASTERED'];
    const initialStatus = status && validStatuses.includes(status) ? status : 'NEW';

    // Check if word entry exists
    const wordEntry = await prisma.wordEntry.findUnique({
      where: { id: wordId }
    });

    if (!wordEntry) {
      throw new AppError('Word not found', 404);
    }

    // Check if already in bank
    const existing = await prisma.userWord.findUnique({
      where: {
        userId_wordEntryId: { userId, wordEntryId: wordId }
      },
      include: {
        wordEntry: {
          select: {
            id: true,
            word: true,
            slug: true,
            hskLevel: true
          }
        }
      }
    });

    if (existing) {
      // Return existing word instead of error for idempotency
      return res.status(201).json({ userWord: existing, alreadyExists: true });
    }

    // Add to bank
    const userWord = await prisma.userWord.create({
      data: {
        userId,
        wordEntryId: wordId,
        source: source || 'Manual',
        status: initialStatus
      },
      include: {
        wordEntry: {
          select: {
            id: true,
            word: true,
            slug: true,
            hskLevel: true
          }
        }
      }
    });

    res.status(201).json({ userWord });
  } catch (error) {
    next(error);
  }
};

// POST /api/user/words/batch
export const batchAddWords = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { wordIds } = req.body;

    if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
      throw new AppError('Word IDs array is required', 400);
    }

    // Get existing user words
    const existingUserWords = await prisma.userWord.findMany({
      where: {
        userId,
        wordId: { in: wordIds }
      },
      select: { wordId: true }
    });

    const existingWordIds = new Set(existingUserWords.map(uw => uw.wordId));
    const newWordIds = wordIds.filter(id => !existingWordIds.has(id));

    // Add new words
    if (newWordIds.length > 0) {
      await prisma.userWord.createMany({
        data: newWordIds.map(wordId => ({
          userId,
          wordId,
          status: 'NEW',
          source: 'TextAnalyzer'
        }))
      });
    }

    res.json({
      added: newWordIds.length,
      skipped: wordIds.length - newWordIds.length,
      total: wordIds.length
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/user/words/:id
export const updateUserWord = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status, isFavorite, notes } = req.body;

    const userWord = await prisma.userWord.findFirst({
      where: { id, userId }
    });

    if (!userWord) {
      throw new AppError('Word not found in your bank', 404);
    }

    const updated = await prisma.userWord.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(typeof isFavorite === 'boolean' && { isFavorite }),
        ...(notes !== undefined && { notes })
      },
      include: {
        word: true
      }
    });

    res.json({ userWord: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/user/words/:id
export const deleteUserWord = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const userWord = await prisma.userWord.findFirst({
      where: { id, userId }
    });

    if (!userWord) {
      throw new AppError('Word not found in your bank', 404);
    }

    await prisma.userWord.delete({
      where: { id }
    });

    res.json({ message: 'Word removed from bank' });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/stats
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get word counts by status
    const wordCounts = await prisma.userWord.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true }
    });

    const stats = {
      totalWords: 0,
      newWords: 0,
      learningWords: 0,
      masteredWords: 0
    };

    wordCounts.forEach(({ status, _count }) => {
      stats.totalWords += _count.id;
      if (status === 'NEW') stats.newWords = _count.id;
      if (status === 'LEARNING') stats.learningWords = _count.id;
      if (status === 'MASTERED') stats.masteredWords = _count.id;
    });

    // Get due words count (words needing review)
    const dueWordsCount = await prisma.userWord.count({
      where: {
        userId,
        status: { in: ['NEW', 'LEARNING'] },
        nextReview: { lte: new Date() }
      }
    });

    // Get study streak (simplified - consecutive days with learning sessions)
    const recentSessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 30,
      select: { startedAt: true }
    });

    const studyStreak = calculateStreak(recentSessions.map(s => s.startedAt));

    // Get total study time
    const totalTimeResult = await prisma.learningSession.aggregate({
      where: { userId },
      _sum: { totalTime: true }
    });

    res.json({
      ...stats,
      dueWordsCount,
      studyStreak,
      totalStudyTime: totalTimeResult._sum.totalTime || 0
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/user/profile
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { username, avatar, preferredLang } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(avatar && { avatar }),
        ...(preferredLang && { preferredLang })
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        preferredLang: true,
        isPremium: true
      }
    });

    res.json({ user: updated });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate study streak
function calculateStreak(dates) {
  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDates = [...new Set(dates.map(d => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }))].sort((a, b) => b - a);

  let currentDate = today.getTime();

  for (const dateTime of uniqueDates) {
    if (dateTime === currentDate) {
      streak++;
      currentDate -= 24 * 60 * 60 * 1000; // Go back one day
    } else if (dateTime < currentDate) {
      break;
    }
  }

  return streak;
}

