// import nodejieba from 'nodejieba';
import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

// Simple Chinese text segmentation function
function simpleChineseSegmentation(text) {
  // Simple segmentation by splitting on punctuation and whitespace
  // This is a basic implementation - in production, you'd want proper Chinese segmentation
  return text.split(/[\s，。！？；：""''（）【】]/).filter(word => word.length > 0);
}

// POST /api/text/analyze
export const analyzeText = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { text } = req.body;

    if (!text || text.length === 0) {
      throw new AppError('Text is required', 400);
    }

    if (text.length > 1000) {
      throw new AppError('Text is too long (max 1000 characters)', 400);
    }

    // Use simple segmentation instead of jieba
    const segments = simpleChineseSegmentation(text);

    // Filter out single characters and non-Chinese words
    const chineseWords = segments.filter(word => {
      return word.length >= 2 && /[\u4e00-\u9fa5]/.test(word);
    });

    // Get unique words
    const uniqueWords = [...new Set(chineseWords)];

    // Find these words in our database
    const wordsInDB = await prisma.word.findMany({
      where: {
        chinese: { in: uniqueWords },
        isPublished: true
      },
      select: {
        id: true,
        chinese: true,
        pinyin: true,
        englishDefinition: true,
        hskLevel: true,
        slug: true,
        audioUrl: true,
        exampleSentences: true
      }
    });

    // Get user's existing words
    const userWords = await prisma.userWord.findMany({
      where: {
        userId,
        wordId: { in: wordsInDB.map(w => w.id) }
      },
      select: { wordId: true }
    });

    const userWordIds = new Set(userWords.map(uw => uw.wordId));

    // Separate into known and new words
    const knownWords = wordsInDB.filter(w => userWordIds.has(w.id));
    const newWords = wordsInDB.filter(w => !userWordIds.has(w.id));

    // Sort new words by HSK level
    newWords.sort((a, b) => a.hskLevel - b.hskLevel);

    // Determine overall difficulty
    const avgHSK = newWords.length > 0
      ? newWords.reduce((sum, w) => sum + w.hskLevel, 0) / newWords.length
      : 0;

    let difficulty = 'Unknown';
    if (avgHSK > 0) {
      if (avgHSK <= 2) difficulty = 'Beginner (HSK 1-2)';
      else if (avgHSK <= 4) difficulty = 'Intermediate (HSK 3-4)';
      else difficulty = 'Advanced (HSK 5-6)';
    }

    res.json({
      segmented: segments,
      analysis: {
        totalSegments: segments.length,
        uniqueChineseWords: uniqueWords.length,
        wordsInDatabase: wordsInDB.length,
        knownWords: knownWords.length,
        newWords: newWords.length,
        difficulty
      },
      knownWords,
      newWords
    });
  } catch (error) {
    next(error);
  }
};






