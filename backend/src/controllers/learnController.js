import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/learn/due-words?limit=10
export const getDueWords = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { limit = 10 } = req.query;

    // Priority 1: Words due for review
    // Priority 2: Learning words not yet due
    // Priority 3: New words
    const dueWords = await prisma.userWord.findMany({
      where: {
        userId,
        status: { in: ['NEW', 'LEARNING'] }
      },
      include: {
        word: true
      },
      orderBy: [
        { nextReview: 'asc' },
        { addedAt: 'asc' }
      ],
      take: parseInt(limit)
    });

    // Count total due words
    const totalDue = await prisma.userWord.count({
      where: {
        userId,
        status: { in: ['NEW', 'LEARNING'] }
      }
    });

    res.json({
      words: dueWords,
      totalDue,
      count: dueWords.length
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/learn/review
export const submitReview = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { userWordId, quality, timeSpent } = req.body;
    // quality: 0 (again), 1 (hard), 2 (good), 3 (easy)

    if (!userWordId || quality === undefined) {
      throw new AppError('userWordId and quality are required', 400);
    }

    // Validate quality score (0-5 as per SM-2 algorithm)
    const qualityInt = parseInt(quality);
    if (isNaN(qualityInt) || qualityInt < 0 || qualityInt > 5) {
      throw new AppError('Quality score must be between 0 and 5', 400);
    }

    const userWord = await prisma.userWord.findFirst({
      where: { id: userWordId, userId }
    });

    if (!userWord) {
      throw new AppError('Word not found in your bank', 404);
    }

    // Calculate new SRS values using SM-2 algorithm
    const { newStatus, newInterval, newEaseFactor, newRepetitions } = calculateSM2({
      quality: parseInt(quality),
      repetitions: userWord.repetitions,
      easeFactor: userWord.easeFactor,
      interval: userWord.interval
    });

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    // Update statistics
    const isCorrect = quality >= 2; // Good or Easy
    const updated = await prisma.userWord.update({
      where: { id: userWordId },
      data: {
        status: newStatus,
        repetitions: newRepetitions,
        easeFactor: newEaseFactor,
        interval: newInterval,
        nextReview,
        correctCount: isCorrect ? { increment: 1 } : userWord.correctCount,
        wrongCount: !isCorrect ? { increment: 1 } : userWord.wrongCount,
        totalTime: { increment: timeSpent || 0 },
        lastReviewAt: new Date()
      },
      include: {
        word: true
      }
    });

    res.json({
      success: true,
      userWord: updated,
      nextReview,
      message: quality === 0 ? 'Review again today' : `Next review in ${newInterval} days`
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/learn/stats
export const getLearnStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get total words in user's bank
    const totalWords = await prisma.userWord.count({
      where: { userId }
    });

    // Get words reviewed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const wordsReviewedToday = await prisma.userWord.count({
      where: {
        userId,
        lastReviewAt: {
          gte: today
        }
      }
    });

    // Get words by status
    const statusCounts = await prisma.userWord.groupBy({
      by: ['status'],
      where: { userId },
      _count: true
    });

    // Calculate current streak based on learning sessions
    // For now, return a simple count of consecutive days with sessions
    const recentSessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 30
    });

    let currentStreak = 0;
    if (recentSessions.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let checkDate = new Date(today);
      for (const session of recentSessions) {
        const sessionDate = new Date(session.startedAt);
        sessionDate.setHours(0, 0, 0, 0);
        
        if (sessionDate.getTime() === checkDate.getTime()) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (sessionDate.getTime() < checkDate.getTime()) {
          break;
        }
      }
    }

    const stats = {
      totalWords,
      wordsReviewedToday,
      currentStreak,
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {})
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// GET /api/learn/history
export const getLearnHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate, limit = 50 } = req.query;

    const where = { userId };

    // Add date filters if provided
    if (startDate || endDate) {
      where.startedAt = {};
      if (startDate) {
        where.startedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.startedAt.lte = new Date(endDate);
      }
    }

    const history = await prisma.learningSession.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ history });
  } catch (error) {
    next(error);
  }
};

// POST /api/learn/session/start
export const startSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { limit = 10 } = req.body;

    const session = await prisma.learningSession.create({
      data: {
        userId,
        wordsReviewed: 0,
        wordsCorrect: 0,
        wordsWrong: 0,
        totalTime: 0
      }
    });

    // Get words for this session
    const words = await prisma.userWord.findMany({
      where: {
        userId,
        status: { in: ['NEW', 'LEARNING'] }
      },
      include: {
        word: true
      },
      orderBy: [
        { nextReview: 'asc' },
        { addedAt: 'asc' }
      ],
      take: parseInt(limit)
    });

    res.status(201).json({ 
      sessionId: session.id,
      words: words.map(uw => uw.word),
      session 
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/learn/session/:id/end
export const endSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { wordsReviewed, wordsCorrect, wordsWrong, totalTime } = req.body;

    const session = await prisma.learningSession.findFirst({
      where: { id, userId }
    });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    const updated = await prisma.learningSession.update({
      where: { id },
      data: {
        wordsReviewed: wordsReviewed || 0,
        wordsCorrect: wordsCorrect || 0,
        wordsWrong: wordsWrong || 0,
        totalTime: totalTime || 0,
        endedAt: new Date()
      }
    });

    res.json({ 
      success: true,
      session: updated 
    });
  } catch (error) {
    next(error);
  }
};

// SM-2 Algorithm Implementation
function calculateSM2({ quality, repetitions, easeFactor, interval }) {
  let newEaseFactor = easeFactor;
  let newRepetitions = repetitions;
  let newInterval = interval;
  let newStatus = 'LEARNING';

  if (quality >= 2) {
    // Correct response (Good or Easy)
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;

    // Update ease factor
    newEaseFactor = easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    // Mark as mastered after 5 successful reviews
    if (newRepetitions >= 5 && newInterval >= 21) {
      newStatus = 'MASTERED';
    }
  } else {
    // Incorrect response (Again or Hard)
    newRepetitions = 0;
    newInterval = 0; // Review today
    newStatus = 'LEARNING';
  }

  return {
    newStatus,
    newInterval,
    newEaseFactor,
    newRepetitions
  };
}

