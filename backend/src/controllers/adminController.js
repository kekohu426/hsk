import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { aiService } from '../services/aiService.js';

// Stats
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalArticles, totalWords, todayActive] = await Promise.all([
      prisma.user.count(),
      prisma.article.count(),
      prisma.word.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    res.json({
      totalUsers,
      totalArticles,
      totalWords,
      todayActive,  // Changed from activeUsersToday to match frontend
      recentActivity: [] // TODO: Implement activity tracking
    });
  } catch (error) {
    next(error);
  }
};

// Articles
export const getArticles = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = status && status !== 'all' ? { status } : {};

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);

    // Map database fields to frontend expected fields
    const mappedArticles = articles.map(article => ({
      ...article,
      chineseContent: article.content,  // Map content → chineseContent
      difficulty: article.level,         // Map level → difficulty
      views: article.viewCount          // Map viewCount → views
    }));

    res.json({
      articles: mappedArticles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      throw new AppError('Article not found', 404);
    }

    res.json({ article });
  } catch (error) {
    next(error);
  }
};

export const generateArticle = async (req, res, next) => {
  try {
    const { topic, difficulty, keywords, wordCount } = req.body;

    if (!topic) {
      throw new AppError('Topic is required', 400);
    }

    // Generate article using AI
    const article = await aiService.generateArticle({
      topic,
      difficulty: difficulty || 'Beginner',
      keywords: keywords || [],
      wordCount: wordCount || 300
    });

    res.json({ article });
  } catch (error) {
    next(error);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const articleData = req.body;

    // Validate required fields
    if (!articleData.title || !articleData.content) {
      throw new AppError('Title and content are required', 400);
    }

    // Ensure slug is unique
    let slug = articleData.slug;
    let slugExists = await prisma.article.findUnique({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = `${articleData.slug}-${counter}`;
      slugExists = await prisma.article.findUnique({ where: { slug } });
      counter++;
    }

    // Create article in database
    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        titleEn: articleData.titleEn,
        slug,
        content: JSON.stringify(articleData.content), // Stringify structured content
        excerpt: articleData.excerpt,
        level: articleData.level || 'BEGINNER',
        hskLevel: articleData.hskLevel,
        readTime: articleData.readTime,
        wordCount: articleData.wordCount,
        newWords: JSON.stringify(articleData.newWords || []),
        quiz: articleData.quiz ? JSON.stringify(articleData.quiz) : null,
        coverImage: articleData.coverImage,
        audioUrl: articleData.audioUrl,
        metaTitle: articleData.metaTitle,
        metaDescription: articleData.metaDescription,
        status: articleData.status || 'DRAFT',
        publishedAt: articleData.status === 'PUBLISHED' ? new Date() : null,
        viewCount: articleData.viewCount || 0
      }
    });

    res.status(201).json({ article });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle JSON fields if they're objects
    const updateData = { ...updates };
    if (updates.content && typeof updates.content === 'object') {
      updateData.content = JSON.stringify(updates.content);
    }
    if (updates.newWords && typeof updates.newWords === 'object') {
      updateData.newWords = JSON.stringify(updates.newWords);
    }
    if (updates.quiz && typeof updates.quiz === 'object') {
      updateData.quiz = JSON.stringify(updates.quiz);
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData
    });

    res.json({ article });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id }
    });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Words
export const getWords = async (req, res, next) => {
  try {
    const { hskLevel, page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = hskLevel ? { hskLevel: parseInt(hskLevel) } : {};

    const [words, total] = await Promise.all([
      prisma.word.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.word.count({ where })
    ]);

    res.json({
      words,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createWord = async (req, res, next) => {
  try {
    const wordData = req.body;

    const slug = wordData.chinese.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');
    const seoMetadata = generateSeoMetadata(wordData);
    const content = serializeWordContent(wordData);

    const word = await prisma.word.create({
      data: {
        chinese: wordData.chinese,
        pinyin: wordData.pinyin,
        pinyinNumeric: wordData.pinyinNumeric || null,
        englishDefinition: wordData.englishDefinition,
        hskLevel: wordData.hskLevel || 1,
        slug,
        metaTitle: wordData.metaTitle || seoMetadata.metaTitle,
        metaDescription: wordData.metaDescription || seoMetadata.metaDescription,
        audioUrl: wordData.audioUrl || null,
        source: wordData.source || 'AI',
        frequency: wordData.frequency || 0,
        difficulty: wordData.difficulty || wordData.hskLevel || 1,
        isPublished: wordData.isPublished ?? false,
        publishedAt: wordData.isPublished ? new Date() : null,
        studyData: wordData.studyData ? JSON.stringify(wordData.studyData) : null,
        ...content
      }
    });

    res.status(201).json({ word });
  } catch (error) {
    next(error);
  }
};

export const generateWords = async (req, res, next) => {
  try {
    const { hskLevel, prompt, count = 10 } = req.body;

    if (!hskLevel) {
      throw new AppError('HSK level is required', 400);
    }

    console.log(`[词汇生成] 开始生成 ${count} 个 HSK ${hskLevel} 词汇...`);

    // Generate words using AI
    const words = await aiService.generateVocabulary({
      hskLevel,
      prompt,
      count
    });

    if (!words || !Array.isArray(words)) {
      throw new AppError('AI 返回的数据格式不正确', 500);
    }

    if (words.length === 0) {
      throw new AppError('AI 未能生成任何词汇，请重试', 500);
    }

    console.log(`[词汇生成] 成功生成 ${words.length} 个词汇`);
    res.json({ words, count: words.length });
  } catch (error) {
    // 增强错误日志
    console.error('[词汇生成失败]', {
      hskLevel: req.body.hskLevel,
      count: req.body.count,
      error: error.message,
      stack: error.stack
    });
    
    // 如果是已知的AppError，直接传递
    if (error.name === 'AppError') {
      next(error);
    } else {
      // 将其他错误转换为友好的错误信息
      next(new AppError(error.message || '词汇生成失败，请检查 AI 服务配置', 500));
    }
  }
};

/**
 * 生成SEO友好的slug
 * 优先使用拼音，如果没有则使用时间戳
 */
function generateSlug(wordData) {
  const { chinese, pinyin, pinyinNumeric } = wordData;
  
  // 优先使用pinyinNumeric（去掉数字），其次使用pinyin，最后fallback到中文
  let baseSlug = pinyinNumeric 
    ? pinyinNumeric.replace(/[0-9]/g, '').toLowerCase()
    : pinyin 
    ? pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (match) => {
        const toneMap = {
          'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
          'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
          'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
          'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
          'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
          'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v'
        };
        return toneMap[match] || match;
      }).toLowerCase()
    : chinese;
  
  // 清理特殊字符，只保留字母、数字和连字符
  baseSlug = baseSlug.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');
  baseSlug = baseSlug.replace(/^-+|-+$/g, ''); // 去掉首尾的连字符
  
  // 添加时间戳确保唯一性
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

/**
 * 生成SEO元数据
 */
function generateSeoMetadata(wordData) {
  const { chinese, pinyin, englishDefinition, hskLevel } = wordData;
  const englishSummary = wordData.englishSummary?.trim?.();
  
  const metaTitle = `${chinese} (${pinyin}) - HSK ${hskLevel} Chinese Word | ChineseMaster`;
  
  const metaDescription = englishSummary && englishSummary.length > 0
    ? englishSummary
    : `Learn the Chinese word ${chinese} (${pinyin}): ${englishDefinition}. ` +
      `HSK ${hskLevel} vocabulary with pronunciation, example sentences, character breakdown, and usage tips. ` +
      `Master Chinese vocabulary effectively.`;
  
  return { metaTitle, metaDescription };
}

function buildSeoExtras(wordData = {}, existing = {}) {
  return {
    longForm: wordData.longForm || existing.longForm || { sections: [] },
    englishSummary:
      wordData.englishSummary !== undefined
        ? wordData.englishSummary
        : (existing.englishSummary || ''),
    keywords: Array.isArray(wordData.keywords)
      ? wordData.keywords
      : (existing.keywords || []),
    relatedLinks: Array.isArray(wordData.relatedLinks)
      ? wordData.relatedLinks
      : (existing.relatedLinks || []),
    mainImages: Array.isArray(wordData.mainImages)
      ? wordData.mainImages
      : (existing.mainImages || [])
  };
}

function buildRelatedWordsPayload(wordData = {}, existingRelatedWords = {}) {
  const relatedWords = wordData.relatedWords && typeof wordData.relatedWords === 'object'
    ? wordData.relatedWords
    : existingRelatedWords;

  return {
    ...relatedWords,
    seoExtras: buildSeoExtras(wordData, relatedWords?.seoExtras)
  };
}

function serializeWordContent(wordData = {}, existingRelatedWords = {}) {
  const exampleSentences = Array.isArray(wordData.exampleSentences) ? wordData.exampleSentences : [];
  const characterBreakdown = wordData.characterBreakdown || {};
  const faqs = Array.isArray(wordData.faqs) ? wordData.faqs : [];
  const relatedWordsWithSeo = buildRelatedWordsPayload(wordData, existingRelatedWords);

  return {
    exampleSentences: JSON.stringify(exampleSentences),
    characterBreakdown: JSON.stringify(characterBreakdown),
    relatedWords: JSON.stringify(relatedWordsWithSeo),
    faqs: JSON.stringify(faqs)
  };
}

const toArray = (value, mapper) => {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,，]/) : [];
  return arr
    .map((item) => (mapper ? mapper(item) : (typeof item === 'string' ? item.trim() : item)))
    .filter((item) => {
      if (typeof item === 'string') {
        return item.trim().length > 0;
      }
      return item !== null && item !== undefined;
    });
};

const parseSeoKeywords = (value) =>
  toArray(value, (item) =>
    typeof item === 'string' ? item.trim() : ''
  );

const mapExamplesFromStudyData = (examples = []) =>
  toArray(examples).map((example, index) => {
    const cn = example.cn || '';
    const pinyin = example.pinyin || '';
    const en = example.en || '';
    const usageNote = example.source ? `来源: ${example.source}` : example.usageNote || '';
    return {
      cn,
      pinyin,
      en,
      usageNote,
      image: {
        alt: example.image?.alt || `${cn || '例句'} 插图`,
        caption: example.image?.caption || cn || `例句 ${index + 1}`,
        prompt: example.image?.prompt || '',
        url: example.image?.url || '',
        placement: example.image?.placement || null
      }
    };
  });

const mapCollocationsFromStudyData = (collocations = []) =>
  toArray(collocations).map((item) => ({
    word: item.cn || item.word || '',
    pinyin: item.pinyin || '',
    meaning: item.en || item.meaning || '',
    example: item.example || ''
  })).filter((item) => item.word);

const mapSynonymsFromStudyData = (relatedWords = []) =>
  toArray(relatedWords).map((item) => ({
    word: item.cn || item.word || '',
    pinyin: item.pinyin || '',
    meaning: item.en || item.meaning || '',
    slug: item.url || '',
    note: item.note || ''
  })).filter((item) => item.word);

const buildLongFormFromStudyData = (studyData = {}) => {
  const sections = [];
  if (studyData.definition?.cn) {
    sections.push({
      title: '核心含义',
      body: studyData.definition.cn,
      bulletPoints: []
    });
  }
  if (studyData.detailedExplanation?.cn) {
    sections.push({
      title: '用法详解',
      body: studyData.detailedExplanation.cn,
      bulletPoints: []
    });
  }
  const collocationLines = mapCollocationsFromStudyData(studyData.collocations).map(
    (item) => `${item.word}（${item.pinyin}）- ${item.meaning}`
  );
  if (collocationLines.length > 0) {
    sections.push({
      title: '常见搭配',
      body: collocationLines.join('；'),
      bulletPoints: []
    });
  }
  if (studyData.culturalTips?.cn) {
    sections.push({
      title: '文化背景',
      body: studyData.culturalTips.cn,
      bulletPoints: []
    });
  }
  return {
    sections
  };
};

const buildFaqsFromStudyData = (studyData = {}) => {
  const confusion = studyData.confusionPoints;
  const faqs = [];
  if (confusion?.cn?.wrong || confusion?.cn?.correct) {
    faqs.push({
      question: '常见错误用法',
      answer: `${confusion.cn.wrong || ''}\n${confusion.cn.correct || ''}\n${confusion.en || ''}`.trim()
    });
  }
  const examTypesCn = toArray(studyData.examTypes?.cn);
  const examTypesEn = toArray(studyData.examTypes?.en);
  if (examTypesCn.length > 0) {
    faqs.push({
      question: '考试题型',
      answer: `${examTypesCn.join('\n')}\n${examTypesEn.join('\n')}`.trim()
    });
  }
  const practice = toArray(studyData.practiceQuestions);
  practice.forEach((item, index) => {
    if (item?.question?.cn) {
      const correctOption = (item.options || []).find((opt) => opt.isCorrect);
      faqs.push({
        question: `练习题 ${index + 1}`,
        answer: `${item.question.cn}\n${item.question.en || ''}\n正确答案：${correctOption?.label || ''} ${correctOption?.cn || ''}`
      });
    }
  });
  return faqs;
};

const parseHskLevel = (studyLevel, fallback) => {
  if (typeof studyLevel === 'string') {
    const match = studyLevel.match(/(\d+)/);
    if (match) {
      const level = parseInt(match[1], 10);
      if (!Number.isNaN(level)) {
        return level;
      }
    }
  }
  return fallback || 1;
};

function buildWordDataFromStudyData(studyData, existingWord = null, options = {}) {
  if (!studyData || typeof studyData !== 'object') {
    throw new Error('Invalid study data');
  }

  const {
    defaultHskLevel = 1,
    overwriteCore = true
  } = options;

  const hskLevel = parseHskLevel(studyData.level, existingWord?.hskLevel || defaultHskLevel);

  const base = {
    chinese: studyData.word || existingWord?.chinese || '',
    pinyin: studyData.pinyin || existingWord?.pinyin || '',
    pinyinNumeric: studyData.pinyinWithTones || existingWord?.pinyinNumeric || '',
    englishDefinition: studyData.english || existingWord?.englishDefinition || '',
    hskLevel,
    englishSummary: studyData.detailedExplanation?.en || existingWord?.englishSummary || '',
    audioUrl: studyData.audio?.url || existingWord?.audioUrl || null,
    keywords: parseSeoKeywords(studyData.seo?.keywords),
    exampleSentences: mapExamplesFromStudyData(studyData.examples),
    relatedWords: {
      synonyms: mapSynonymsFromStudyData(studyData.relatedWords),
      antonyms: [],
      collocations: mapCollocationsFromStudyData(studyData.collocations)
    },
    faqs: buildFaqsFromStudyData(studyData),
    longForm: buildLongFormFromStudyData(studyData),
    relatedLinks: toArray(studyData.relatedWords).map((item) => ({
      title: item.cn || item.word || '',
      slug: (item.url || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\//, ''),
      anchorText: item.en || item.meaning || ''
    }))
  };

  if (!overwriteCore && existingWord) {
    base.chinese = existingWord.chinese;
    base.pinyin = existingWord.pinyin;
    base.pinyinNumeric = existingWord.pinyinNumeric;
    base.englishDefinition = existingWord.englishDefinition;
  }

  if (base.keywords.length === 0 && Array.isArray(studyData.collocations)) {
    base.keywords = studyData.collocations
      .map((item) => item.cn || item.word)
      .filter(Boolean)
      .slice(0, 5);
  }

  const seoMeta = studyData.seo || {};
  base.metaTitle = seoMeta.title || existingWord?.metaTitle || null;
  base.metaDescription = seoMeta.description || existingWord?.metaDescription || null;

  base.studyData = studyData;
  return base;
}

export const batchCreateWords = async (req, res, next) => {
  try {
    const { words, publishImmediately = true, enrich = false } = req.body;

    if (!Array.isArray(words) || words.length === 0) {
      throw new AppError('Words array is required', 400);
    }

    console.log(`[批量创建词汇] 开始创建 ${words.length} 个词汇...`);

    const results = {
      created: [],
      updated: [],
      errors: []
    };

    for (const wordData of words) {
      try {
        // 验证必需字段
        if (!wordData.chinese || !wordData.pinyin || !wordData.englishDefinition) {
          results.errors.push({
            word: wordData.chinese || 'Unknown',
            error: 'Missing required fields (chinese, pinyin, englishDefinition)'
          });
          continue;
        }

        // 生成slug和SEO元数据
        const slug = generateSlug(wordData);
        const seoMetadata = generateSeoMetadata(wordData);

        const existingWord = await prisma.word.findUnique({
          where: { chinese: wordData.chinese }
        });

        // 基础数据
        let data = {
          chinese: wordData.chinese,
          pinyin: wordData.pinyin,
          pinyinNumeric: wordData.pinyinNumeric || null,
          englishDefinition: wordData.englishDefinition,
          hskLevel: wordData.hskLevel || 1,
          slug,
          metaTitle: wordData.metaTitle || seoMetadata.metaTitle,
          metaDescription: wordData.metaDescription || seoMetadata.metaDescription,
          audioUrl: wordData.audioUrl || null,
          source: wordData.source || 'AI',
          frequency: wordData.frequency || 0,
          difficulty: wordData.difficulty || wordData.hskLevel || 1,
          isPublished: publishImmediately,
          publishedAt: publishImmediately ? new Date() : null,
        };

        // 可选富化：若缺失模块则调用 AI 生成完善内容
        if (enrich) {
          const needsExamples = !Array.isArray(wordData.exampleSentences) || wordData.exampleSentences.length < 2;
          const needsBreakdown = !wordData.characterBreakdown || Object.keys(wordData.characterBreakdown || {}).length === 0;
          const needsRelated = !wordData.relatedWords || Object.keys(wordData.relatedWords || {}).length === 0;
          const needsFaqs = !Array.isArray(wordData.faqs) || wordData.faqs.length < 2;
          const needsLongForm = !wordData.longForm || !Array.isArray(wordData.longForm.sections) || wordData.longForm.sections.length < 4;
          const needsMedia = !Array.isArray(wordData.mainImages) || wordData.mainImages.length === 0;

          if (needsExamples || needsBreakdown || needsRelated || needsFaqs || needsLongForm || needsMedia) {
            try {
              const modules = [];
              if (needsExamples) modules.push('examples');
              if (needsBreakdown) modules.push('breakdown');
              if (needsRelated) modules.push('related');
              if (needsFaqs) modules.push('faqs');
              if (needsLongForm) modules.push('longForm');
              if (needsMedia) modules.push('media');

              const enriched = await aiService.generateVocabPage({
                word: wordData.chinese,
                hskLevel: wordData.hskLevel || 1,
                modules
              });

              if (needsExamples && Array.isArray(enriched.exampleSentences)) {
                wordData.exampleSentences = enriched.exampleSentences;
              }
              if (needsBreakdown && enriched.characterBreakdown) {
                wordData.characterBreakdown = enriched.characterBreakdown;
              }
              if (needsRelated && enriched.relatedWords) {
                wordData.relatedWords = enriched.relatedWords;
              }
              if (needsFaqs && Array.isArray(enriched.faqs)) {
                wordData.faqs = enriched.faqs;
              }
              if (needsLongForm && enriched.longForm) {
                wordData.longForm = enriched.longForm;
              }
              if (!wordData.englishSummary && enriched.englishSummary) {
                wordData.englishSummary = enriched.englishSummary;
              }
              if ((!Array.isArray(wordData.keywords) || wordData.keywords.length === 0) && enriched.keywords) {
                wordData.keywords = enriched.keywords;
              }
              if ((!Array.isArray(wordData.relatedLinks) || wordData.relatedLinks.length === 0) && enriched.relatedLinks) {
                wordData.relatedLinks = enriched.relatedLinks;
              }
              if (needsMedia && Array.isArray(enriched.mainImages)) {
                wordData.mainImages = enriched.mainImages;
              }
            } catch (e) {
              console.warn('[批量创建词汇] 富化失败，继续保存基础数据:', wordData.chinese, e?.message);
            }
          }
        }

        const existingRelated = existingWord
          ? (existingWord.relatedWords ? JSON.parse(existingWord.relatedWords) : {})
          : {};
        const content = serializeWordContent(wordData, existingRelated);
        data = { ...data, ...content };
        if (wordData.studyData) {
          data.studyData = JSON.stringify(wordData.studyData);
        } else if (existingWord?.studyData) {
          data.studyData = existingWord.studyData;
        }

        if (existingWord) {
          // 更新现有词汇
          const updatedWord = await prisma.word.update({
            where: { id: existingWord.id },
            data: {
              ...data,
              slug: existingWord.slug, // 保留原有slug
            }
          });
          results.updated.push(updatedWord);
          console.log(`[批量创建词汇] 更新: ${wordData.chinese}`);
        } else {
          // 创建新词汇
          const createdWord = await prisma.word.create({ data });
          results.created.push(createdWord);
          console.log(`[批量创建词汇] 创建: ${wordData.chinese}`);
        }
      } catch (error) {
        console.error(`[批量创建词汇] 处理失败: ${wordData.chinese}`, error);
        results.errors.push({
          word: wordData.chinese,
          error: error.message
        });
      }
    }

    console.log(`[批量创建词汇] 完成 - 创建: ${results.created.length}, 更新: ${results.updated.length}, 错误: ${results.errors.length}`);

    res.status(201).json({
      message: 'Batch operation completed',
      summary: {
        total: words.length,
        created: results.created.length,
        updated: results.updated.length,
        errors: results.errors.length
      },
      created: results.created,
      updated: results.updated,
      errors: results.errors
    });
  } catch (error) {
    console.error('[批量创建词汇] 严重错误:', error);
    next(error);
  }
};

export const importWordsByLevel = async (req, res, next) => {
  try {
    const {
      hskLevel,
      words,
      publishImmediately = false,
      generateStudyData = false
    } = req.body;

    if (!hskLevel || !words) {
      throw new AppError('缺少必填参数: hskLevel, words', 400);
    }

    const levelNumber = parseInt(hskLevel, 10);
    if (Number.isNaN(levelNumber) || levelNumber < 1 || levelNumber > 6) {
      throw new AppError('HSK等级必须是1到6之间的数字', 400);
    }

    const wordList = words
      .split(/[,，\n]/)
      .map((item) => item.trim())
      .filter((item, index, arr) => item && arr.indexOf(item) === index);

    if (wordList.length === 0) {
      throw new AppError('未解析到任何词汇，请检查输入格式', 400);
    }

    const summary = {
      total: wordList.length,
      created: [],
      updated: [],
      errors: []
    };

    for (const word of wordList) {
      try {
        const existingWord = await prisma.word.findUnique({
          where: { chinese: word }
        });

        if (generateStudyData) {
          const studyData = await aiService.generateWordStudyData({
            word,
            hskLevel: levelNumber
          });

          const mapped = buildWordDataFromStudyData(studyData, existingWord, {
            defaultHskLevel: levelNumber,
            overwriteCore: true
          });

          const slug = existingWord?.slug || generateSlug(mapped);
          const seoMetadata = generateSeoMetadata(mapped);
          const existingRelated = existingWord?.relatedWords ? JSON.parse(existingWord.relatedWords) : {};
          const content = serializeWordContent(mapped, existingRelated);

          const payload = {
            chinese: mapped.chinese,
            pinyin: mapped.pinyin,
            pinyinNumeric: mapped.pinyinNumeric || null,
            englishDefinition: mapped.englishDefinition,
            hskLevel: mapped.hskLevel || levelNumber,
            slug,
            metaTitle: mapped.metaTitle || seoMetadata.metaTitle,
            metaDescription: mapped.metaDescription || seoMetadata.metaDescription,
            audioUrl: mapped.audioUrl || existingWord?.audioUrl || null,
            source: 'AI-IMPORT',
            frequency: existingWord?.frequency || 0,
            difficulty: existingWord?.difficulty || mapped.hskLevel || levelNumber,
            isPublished: publishImmediately,
            publishedAt: publishImmediately ? new Date() : existingWord?.publishedAt || null,
            studyData: JSON.stringify(mapped.studyData || {})
          };

          if (mapped.englishSummary) {
            payload.englishSummary = mapped.englishSummary;
          }

          const data = { ...payload, ...content };

          if (existingWord) {
            const updated = await prisma.word.update({
              where: { id: existingWord.id },
              data
            });
            summary.updated.push({ id: updated.id, word: updated.chinese });
          } else {
            const created = await prisma.word.create({
              data
            });
            summary.created.push({ id: created.id, word: created.chinese });
          }
        } else {
          const baseData = {
            chinese: existingWord?.chinese || word,
            pinyin: existingWord?.pinyin || '',
            pinyinNumeric: existingWord?.pinyinNumeric || '',
            englishDefinition: existingWord?.englishDefinition || '',
            hskLevel: levelNumber,
            audioUrl: existingWord?.audioUrl || null,
            source: existingWord?.source || 'IMPORT',
            frequency: existingWord?.frequency || 0,
            difficulty: existingWord?.difficulty || levelNumber,
            isPublished: existingWord?.isPublished ?? false,
            publishedAt: existingWord?.publishedAt || null,
            englishSummary: existingWord?.englishSummary || '',
            metaTitle: existingWord?.metaTitle || `${word} - HSK ${levelNumber} Vocabulary (待完善)`,
            metaDescription:
              existingWord?.metaDescription ||
              `占位条目：${word}，HSK ${levelNumber} 词汇。待生成详细学习内容。`
          };

          const slug = existingWord?.slug || generateSlug(baseData);
          const content = serializeWordContent(
            {
              exampleSentences: existingWord
                ? JSON.parse(existingWord.exampleSentences || '[]')
                : [],
              characterBreakdown: existingWord
                ? JSON.parse(existingWord.characterBreakdown || '{}')
                : {},
              relatedWords: existingWord
                ? JSON.parse(existingWord.relatedWords || '{}')
                : {},
              faqs: existingWord ? JSON.parse(existingWord.faqs || '[]') : []
            },
            existingWord?.relatedWords ? JSON.parse(existingWord.relatedWords || '{}') : {}
          );

          const data = {
            ...baseData,
            slug,
            ...content
          };

          if (existingWord) {
            const updated = await prisma.word.update({
              where: { id: existingWord.id },
              data
            });
            summary.updated.push({ id: updated.id, word: updated.chinese });
          } else {
            const created = await prisma.word.create({
              data
            });
            summary.created.push({ id: created.id, word: created.chinese });
          }
        }
      } catch (error) {
        console.error(`[词汇导入] 处理 ${word} 失败:`, error.message);
        summary.errors.push({
          word,
          error: error.message
        });
      }
    }

    res.json({
      message: '词汇导入完成',
      summary
    });
  } catch (error) {
    next(error);
  }
};

export const generateStudyDataForWords = async (req, res, next) => {
  try {
    const { wordIds, overwriteCore = false } = req.body;

    if (!Array.isArray(wordIds) || wordIds.length === 0) {
      throw new AppError('wordIds 数组不能为空', 400);
    }

    const words = await prisma.word.findMany({
      where: {
        id: { in: wordIds }
      }
    });

    const summary = {
      total: wordIds.length,
      processed: [],
      errors: []
    };

    for (const word of words) {
      try {
        const studyData = await aiService.generateWordStudyData({
          word: word.chinese,
          hskLevel: word.hskLevel
        });

        const mapped = buildWordDataFromStudyData(studyData, word, {
          defaultHskLevel: word.hskLevel,
          overwriteCore
        });

        const seoMetadata = generateSeoMetadata({
          ...mapped,
          englishSummary: mapped.englishSummary || word.englishSummary
        });

        const existingRelated = word.relatedWords ? JSON.parse(word.relatedWords) : {};
        const content = serializeWordContent(mapped, existingRelated);

        const data = {
          pinyin: overwriteCore ? mapped.pinyin : word.pinyin || mapped.pinyin,
          pinyinNumeric: overwriteCore ? (mapped.pinyinNumeric || null) : (word.pinyinNumeric || mapped.pinyinNumeric || null),
          englishDefinition: overwriteCore ? mapped.englishDefinition : (word.englishDefinition || mapped.englishDefinition),
          hskLevel: mapped.hskLevel || word.hskLevel,
          difficulty: mapped.hskLevel || word.difficulty || word.hskLevel,
          metaTitle: mapped.metaTitle || word.metaTitle || seoMetadata.metaTitle,
          metaDescription: mapped.metaDescription || word.metaDescription || seoMetadata.metaDescription,
          audioUrl: mapped.audioUrl || word.audioUrl,
          englishSummary: mapped.englishSummary || word.englishSummary,
          studyData: JSON.stringify(mapped.studyData || {}),
          ...content
        };

        await prisma.word.update({
          where: { id: word.id },
          data
        });

        summary.processed.push({
          id: word.id,
          word: word.chinese
        });
      } catch (error) {
        console.error(`[生成学习数据] 处理 ${word.chinese} 失败:`, error.message);
        summary.errors.push({
          word: word.chinese,
          error: error.message
        });
      }
    }

    res.json({
      message: '学习数据生成完成',
      summary
    });
  } catch (error) {
    next(error);
  }
};

export const updateWord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updateData = { ...updates };

    if (updates.exampleSentences && typeof updates.exampleSentences === 'object') {
      updateData.exampleSentences = JSON.stringify(updates.exampleSentences);
    }
    if (updates.characterBreakdown && typeof updates.characterBreakdown === 'object') {
      updateData.characterBreakdown = JSON.stringify(updates.characterBreakdown);
    }
    if (updates.faqs && typeof updates.faqs === 'object') {
      updateData.faqs = JSON.stringify(updates.faqs);
    }
    if (updates.studyData) {
      if (typeof updates.studyData === 'object') {
        updateData.studyData = JSON.stringify(updates.studyData);
      } else {
        updateData.studyData = updates.studyData;
      }
    }

    if (
      updates.longForm !== undefined ||
      updates.englishSummary !== undefined ||
      updates.keywords !== undefined ||
      updates.relatedLinks !== undefined ||
      updates.mainImages !== undefined ||
      updates.relatedWords
    ) {
      const existingWord = await prisma.word.findUnique({
        where: { id },
        select: { relatedWords: true }
      });
      const existingRelated = existingWord?.relatedWords ? JSON.parse(existingWord.relatedWords) : {};
      const relatedPayload = buildRelatedWordsPayload(
        {
          relatedWords: updates.relatedWords,
          longForm: updates.longForm,
          englishSummary: updates.englishSummary,
          keywords: updates.keywords,
          relatedLinks: updates.relatedLinks,
          mainImages: updates.mainImages
        },
        existingRelated
      );

      updateData.relatedWords = JSON.stringify(relatedPayload);

      // Prevent serializeWordContent returning other fields for this call
      if (!updateData.characterBreakdown && existingWord?.relatedWords) {
        // no-op
      }

      delete updateData.longForm;
      delete updateData.englishSummary;
      delete updateData.keywords;
      delete updateData.relatedLinks;
      delete updateData.mainImages;
    }

    const word = await prisma.word.update({
      where: { id },
      data: updateData
    });

    res.json({ word });
  } catch (error) {
    next(error);
  }
};

export const deleteWord = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.word.delete({
      where: { id }
    });

    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Users
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userWords: {
          select: {
            id: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const usersWithStats = users.map(user => ({
      ...user,
      totalWords: user.userWords.length,
      userWords: undefined
    }));

    res.json({ users: usersWithStats });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userWords: true,
        learningSessions: true
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

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: updates
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// AI Config
export const getAIConfig = async (req, res, next) => {
  try {
    const configs = await prisma.aIConfig.findMany();

    // Hide API keys in response and map modelName to model, add provider
    const safeConfigs = configs.map(config => ({
      ...config,
      model: config.modelName,  // Map modelName to model for frontend
      provider: config.modelName.toLowerCase().includes('glm') ? 'glm' : 
                config.modelName.toLowerCase().includes('gpt') ? 'openai' :
                config.modelName.toLowerCase().includes('claude') ? 'claude' : 'glm',
      apiKey: config.apiKey ? '***' + config.apiKey.slice(-4) : ''
    }));

    res.json({ configs: safeConfigs });
  } catch (error) {
    next(error);
  }
};

export const updateAIConfigGlobal = async (req, res, next) => {
  try {
    const { provider, model, temperature } = req.body;
    
    // For now, just return success
    // In a real app, this would update the configuration
    res.json({ 
      success: true,
      config: {
        provider,
        model,
        temperature
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAIConfig = async (req, res, next) => {
  try {
    const { id } = req.params;  // This might be 'glm', 'openai', 'claude' from frontend
    const { model, apiKey, apiUrl } = req.body;

    // Check if a config with this modelName already exists
    let config = await prisma.aIConfig.findFirst({
      where: { modelName: model }
    });

    if (config) {
      // Update existing config
      config = await prisma.aIConfig.update({
        where: { id: config.id },
        data: { 
          modelName: model,
          apiKey,
          ...(apiUrl && { apiUrl })
        }
      });
    } else {
      // Create new config
      config = await prisma.aIConfig.create({
        data: {
          modelName: model,
          apiKey,
          apiUrl: apiUrl || 'https://api.openai.com/v1',  // Default URL
          isActive: false
        }
      });
    }

    res.json({ config });
  } catch (error) {
    next(error);
  }
};

export const toggleAIConfig = async (req, res, next) => {
  try {
    const { id } = req.params;  // This might be 'glm', 'openai', 'claude' from frontend
    const { isActive } = req.body;

    // Find config by ID or modelName pattern
    let config = await prisma.aIConfig.findFirst({
      where: {
        OR: [
          { id },
          { modelName: { contains: id.toUpperCase() } }  // Match 'glm' with 'GLM-4', etc.
        ]
      }
    });

    if (!config) {
      throw new AppError('AI Config not found', 404);
    }

    // If activating, deactivate all others
    if (isActive) {
      await prisma.aIConfig.updateMany({
        where: { id: { not: config.id } },
        data: { isActive: false }
      });
    }

    config = await prisma.aIConfig.update({
      where: { id: config.id },
      data: { isActive }
    });

    res.json({ config });
  } catch (error) {
    next(error);
  }
};
