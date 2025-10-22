import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();
const hsk1Words = JSON.parse(readFileSync(join(__dirname, 'hsk1-words.json'), 'utf-8'));
const articles = JSON.parse(readFileSync(join(__dirname, 'articles.json'), 'utf-8'));

async function main() {
  console.log('🌱 开始填充种子数据...\n');

  // 1. 清空现有数据（开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  清空现有数据...');
    await prisma.articleView.deleteMany();
    await prisma.learningSession.deleteMany();
    await prisma.userWord.deleteMany();
    await prisma.article.deleteMany();
    await prisma.word.deleteMany();
    await prisma.user.deleteMany();
    await prisma.aIConfig.deleteMany();
    console.log('✅ 数据已清空\n');
  }

  // 2. 创建管理员账号
  console.log('👤 创建管理员账号...');
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      username: 'admin',
      password: hashedAdminPassword,
      role: 'ADMIN',
      isPremium: true,
    }
  });
  console.log(`✅ 管理员创建成功: ${admin.email}\n`);

  // 3. 创建测试用户
  console.log('👥 创建测试用户...');
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  
  // 创建普通测试用户
  const demoUser = await prisma.user.create({
    data: {
      email: 'user@demo.com',
      username: 'demouser',
      password: hashedUserPassword,
      role: 'USER',
      isPremium: false,
    }
  });
  console.log(`✅ 测试用户创建成功: ${demoUser.email}\n`);
  
  const hashedUserPassword2 = await bcrypt.hash('test123', 10);
  const testUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'john_doe',
        password: hashedUserPassword,
        role: 'USER',
        preferredLang: 'en',
      }
    }),
    prisma.user.create({
      data: {
        email: 'yuki@example.jp',
        username: 'yuki_tanaka',
        password: hashedUserPassword,
        role: 'USER',
        preferredLang: 'ja',
      }
    }),
    prisma.user.create({
      data: {
        email: 'minho@example.kr',
        username: 'minho_kim',
        password: hashedUserPassword,
        role: 'USER',
        preferredLang: 'ko',
        isPremium: true,
      }
    }),
  ]);
  console.log(`✅ ${testUsers.length} 个测试用户创建成功\n`);

  // 4. 创建HSK词汇
  console.log('📚 创建HSK词汇...');
  const words = [];
  for (const wordData of hsk1Words) {
    const word = await prisma.word.create({
      data: {
        chinese: wordData.chinese,
        pinyin: wordData.pinyin,
        pinyinNumeric: wordData.pinyinNumeric,
        englishDefinition: wordData.englishDefinition,
        hskLevel: wordData.hskLevel,
        slug: wordData.slug,
        metaTitle: `${wordData.chinese} (${wordData.pinyin}) - HSK ${wordData.hskLevel} Chinese Word`,
        metaDescription: `Learn ${wordData.chinese} (${wordData.pinyin}): ${wordData.englishDefinition}. HSK ${wordData.hskLevel} vocabulary with examples, pronunciation, and practice.`,
        exampleSentences: JSON.stringify(wordData.exampleSentences),
        characterBreakdown: wordData.characterBreakdown ? JSON.stringify(wordData.characterBreakdown) : null,
        relatedWords: wordData.relatedWords ? JSON.stringify(wordData.relatedWords) : null,
        faqs: wordData.faqs ? JSON.stringify(wordData.faqs) : null,
        frequency: wordData.frequency,
        difficulty: wordData.difficulty,
        source: wordData.source,
        isPublished: true,
        publishedAt: new Date(),
      }
    });
    words.push(word);
  }
  console.log(`✅ ${words.length} 个HSK词汇创建成功\n`);

  // 5. 创建文章
  console.log('📰 创建文章...');
  const createdArticles = [];
  for (const articleData of articles) {
    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        titleEn: articleData.titleEn,
        slug: articleData.slug,
        content: JSON.stringify(articleData.content),
        excerpt: articleData.excerpt,
        level: articleData.level,
        hskLevel: articleData.hskLevel,
        readTime: articleData.readTime,
        wordCount: articleData.wordCount,
        newWords: JSON.stringify(articleData.newWords),
        quiz: articleData.quiz ? JSON.stringify(articleData.quiz) : null,
        coverImage: articleData.coverImage,
        metaTitle: articleData.metaTitle,
        metaDescription: articleData.metaDescription,
        status: 'PUBLISHED',
        publishedAt: new Date(articleData.publishedAt),
        viewCount: articleData.viewCount || 0,
      }
    });
    createdArticles.push(article);
  }
  console.log(`✅ ${createdArticles.length} 篇文章创建成功\n`);

  // 6. 为测试用户添加学习词汇
  console.log('📖 为测试用户添加学习词汇...');
  const johnUser = testUsers[0];
  const userWordsData = [];
  
  // John学习前3个词
  for (let i = 0; i < Math.min(3, words.length); i++) {
    const nextReview = new Date();
    nextReview.setHours(nextReview.getHours() + (i + 1) * 24); // 1天、2天、3天后复习
    
    userWordsData.push({
      userId: johnUser.id,
      wordId: words[i].id,
      status: i === 0 ? 'LEARNING' : 'NEW',
      repetitions: i === 0 ? 2 : 0,
      easeFactor: 2.5,
      interval: i === 0 ? 1 : 0,
      nextReview: nextReview,
      isFavorite: i === 0,
      source: 'HSK Library',
      correctCount: i === 0 ? 3 : 0,
      wrongCount: i === 0 ? 1 : 0,
      lastReviewAt: i === 0 ? new Date() : null,
    });
  }
  
  await prisma.userWord.createMany({ data: userWordsData });
  console.log(`✅ ${userWordsData.length} 个学习词汇添加成功\n`);

  // 7. 创建学习会话记录
  console.log('🎯 创建学习会话记录...');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  await prisma.learningSession.create({
    data: {
      userId: johnUser.id,
      wordsReviewed: 5,
      wordsCorrect: 4,
      wordsWrong: 1,
      totalTime: 300, // 5分钟
      startedAt: yesterday,
      endedAt: yesterday,
    }
  });
  console.log('✅ 学习会话记录创建成功\n');

  // 8. 创建文章阅读记录
  console.log('📚 创建文章阅读记录...');
  if (createdArticles.length > 0) {
    await prisma.articleView.create({
      data: {
        userId: johnUser.id,
        articleId: createdArticles[0].id,
        readProgress: 100,
        completedQuiz: true,
        quizScore: 80,
      }
    });
    console.log('✅ 文章阅读记录创建成功\n');
  }

  // 9. 创建AI配置
  console.log('🤖 创建AI配置...');
  await prisma.aIConfig.create({
    data: {
      modelName: 'GLM-4',
      apiKey: process.env.GLM_API_KEY || 'your-glm-api-key',
      apiUrl: process.env.GLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      isActive: true,
      isDefault: true,
    }
  });
  console.log('✅ AI配置创建成功\n');

  // 10. 统计信息
  console.log('📊 数据统计:');
  const stats = {
    users: await prisma.user.count(),
    words: await prisma.word.count(),
    articles: await prisma.article.count(),
    userWords: await prisma.userWord.count(),
    learningSessions: await prisma.learningSession.count(),
    articleViews: await prisma.articleView.count(),
    aiConfigs: await prisma.aIConfig.count(),
  };
  
  console.log(`  👤 用户: ${stats.users}`);
  console.log(`  📚 词汇: ${stats.words}`);
  console.log(`  📰 文章: ${stats.articles}`);
  console.log(`  📖 用户词汇: ${stats.userWords}`);
  console.log(`  🎯 学习会话: ${stats.learningSessions}`);
  console.log(`  👁️  文章阅读: ${stats.articleViews}`);
  console.log(`  🤖 AI配置: ${stats.aiConfigs}`);
  
  console.log('\n✅ 种子数据填充完成！\n');
  console.log('🔑 测试账号:');
  console.log('   管理员: admin@chinesemaster.com / admin123');
  console.log('   用户1: john@example.com / test123');
  console.log('   用户2: yuki@example.jp / test123');
  console.log('   用户3: minho@example.kr / test123\n');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
