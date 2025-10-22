import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();

/**
 * 获取用户学习统计数据（含分组）
 * GET /api/admin/user-learning-stats
 */
export const getUserLearningStats = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'lastActive', 
      order = 'desc',
      group = 'all' // all, active, inactive, newbie, advanced
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 获取所有用户及其学习数据
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        streakDays: true,
        userWords: {
          select: {
            id: true,
            status: true,
            isFavorite: true,
            repetitions: true,
            correctCount: true,
            wrongCount: true,
            addedAt: true
          }
        },
        learningSessions: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            wordsReviewed: true,
            correctAnswers: true
          }
        }
      }
    });

    // 计算每个用户的统计数据
    const usersWithStats = users.map(user => {
      const totalWords = user.userWords.length;
      const masteredWords = user.userWords.filter(w => w.status === 'MASTERED').length;
      const learningWords = user.userWords.filter(w => w.status === 'LEARNING').length;
      const newWords = user.userWords.filter(w => w.status === 'NEW').length;
      const favoriteWords = user.userWords.filter(w => w.isFavorite).length;
      
      const totalReviews = user.userWords.reduce((sum, w) => sum + w.repetitions, 0);
      const totalCorrect = user.userWords.reduce((sum, w) => sum + w.correctCount, 0);
      const totalWrong = user.userWords.reduce((sum, w) => sum + w.wrongCount, 0);
      const accuracy = totalCorrect + totalWrong > 0 
        ? Math.round((totalCorrect * 100) / (totalCorrect + totalWrong))
        : 0;

      // 计算总学习时长（秒）
      const totalLearningTime = user.learningSessions.reduce((sum, session) => {
        if (session.startTime && session.endTime) {
          return sum + (new Date(session.endTime) - new Date(session.startTime)) / 1000;
        }
        return sum;
      }, 0);

      // 最近活跃时间（取最近的学习记录或登录时间）
      const lastActiveAt = user.learningSessions.length > 0
        ? new Date(Math.max(...user.learningSessions.map(s => new Date(s.startTime))))
        : user.lastLoginAt || user.createdAt;

      // 判断活跃度
      const daysSinceLastActive = (new Date() - new Date(lastActiveAt)) / (1000 * 60 * 60 * 24);
      const isActive = daysSinceLastActive <= 7; // 7天内活跃
      const isNewbie = (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24) <= 30; // 30天内注册

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        lastActiveAt,
        streakDays: user.streakDays || 0,
        
        // 词汇统计
        totalWords,
        masteredWords,
        learningWords,
        newWords,
        favoriteWords,
        
        // 学习统计
        totalReviews,
        totalSessions: user.learningSessions.length,
        totalLearningTime: Math.round(totalLearningTime),
        accuracy,
        
        // 分组标签
        isActive,
        isNewbie,
        isAdvanced: totalWords >= 100,
        
        // 活跃天数
        daysSinceLastActive: Math.round(daysSinceLastActive)
      };
    });

    // 根据分组筛选
    let filteredUsers = usersWithStats;
    switch (group) {
      case 'active':
        filteredUsers = usersWithStats.filter(u => u.isActive);
        break;
      case 'inactive':
        filteredUsers = usersWithStats.filter(u => !u.isActive);
        break;
      case 'newbie':
        filteredUsers = usersWithStats.filter(u => u.isNewbie);
        break;
      case 'advanced':
        filteredUsers = usersWithStats.filter(u => u.isAdvanced);
        break;
      case 'all':
      default:
        // 不筛选
        break;
    }

    // 排序
    filteredUsers.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'lastActive') {
        aValue = new Date(a.lastActiveAt);
        bValue = new Date(b.lastActiveAt);
      }
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // 分页
    const paginatedUsers = filteredUsers.slice(skip, skip + parseInt(limit));

    // 计算总体统计
    const overallStats = {
      totalUsers: users.length,
      activeUsers: usersWithStats.filter(u => u.isActive).length,
      inactiveUsers: usersWithStats.filter(u => !u.isActive).length,
      newbieUsers: usersWithStats.filter(u => u.isNewbie).length,
      advancedUsers: usersWithStats.filter(u => u.isAdvanced).length,
      
      totalLearningTime: usersWithStats.reduce((sum, u) => sum + u.totalLearningTime, 0),
      totalReviews: usersWithStats.reduce((sum, u) => sum + u.totalReviews, 0),
      avgWordsPerUser: Math.round(usersWithStats.reduce((sum, u) => sum + u.totalWords, 0) / users.length) || 0,
      avgAccuracy: Math.round(usersWithStats.reduce((sum, u) => sum + u.accuracy, 0) / users.length) || 0
    };

    res.json({
      stats: overallStats,
      users: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / parseInt(limit))
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个用户详细学习数据
 * GET /api/admin/users/:userId/learning-details
 */
export const getUserLearningDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // 获取用户基本信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        streakDays: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // 获取词汇数据
    const userWords = await prisma.userWord.findMany({
      where: { userId },
      include: {
        wordEntry: {
          select: {
            word: true,
            hskLevel: true
          }
        }
      }
    });

    // 按状态分组
    const wordsByStatus = {
      NEW: userWords.filter(w => w.status === 'NEW').length,
      LEARNING: userWords.filter(w => w.status === 'LEARNING').length,
      MASTERED: userWords.filter(w => w.status === 'MASTERED').length
    };

    // 按HSK级别分组
    const wordsByHSK = {};
    for (let i = 1; i <= 6; i++) {
      wordsByHSK[i] = userWords.filter(w => w.wordEntry?.hskLevel === i).length;
    }

    // 计算准确率
    const totalCorrect = userWords.reduce((sum, w) => sum + w.correctCount, 0);
    const totalWrong = userWords.reduce((sum, w) => sum + w.wrongCount, 0);
    const accuracy = totalCorrect + totalWrong > 0
      ? Math.round((totalCorrect * 100) / (totalCorrect + totalWrong))
      : 0;

    // 获取学习会话
    const learningSessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: 20
    });

    // 生成30天学习曲线
    const learningCurve = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const wordsAddedOnDay = userWords.filter(w => {
        const addedDate = new Date(w.addedAt);
        return addedDate >= date && addedDate < nextDate;
      }).length;

      const sessionsOnDay = learningSessions.filter(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= date && sessionDate < nextDate;
      });

      const reviewsOnDay = sessionsOnDay.reduce((sum, s) => sum + (s.wordsReviewed || 0), 0);
      const timeOnDay = sessionsOnDay.reduce((sum, s) => {
        if (s.startTime && s.endTime) {
          return sum + (new Date(s.endTime) - new Date(s.startTime)) / 1000;
        }
        return sum;
      }, 0);

      learningCurve.push({
        date: date.toISOString().split('T')[0],
        wordsAdded: wordsAddedOnDay,
        reviewsDone: reviewsOnDay,
        timeSpent: Math.round(timeOnDay)
      });
    }

    // 最近活动日志
    const recentWords = userWords
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, 10)
      .map(w => ({
        word: w.wordEntry?.word,
        status: w.status,
        addedAt: w.addedAt
      }));

    res.json({
      user,
      stats: {
        totalWords: userWords.length,
        byStatus: wordsByStatus,
        byHSK: wordsByHSK,
        accuracy,
        streakDays: user.streakDays || 0,
        totalSessions: learningSessions.length
      },
      learningCurve,
      recentSessions: learningSessions.slice(0, 10),
      recentWords
    });

  } catch (error) {
    next(error);
  }
};

