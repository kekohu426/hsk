const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // ==================== 1. Create Initial Achievements ====================
  console.log('📊 Creating achievements...');

  const achievements = await prisma.achievement.createMany({
    data: [
      {
        key: 'first_10_words',
        title: 'First Steps',
        description: 'Learn your first 10 words',
        icon: '👶',
        rarity: 'COMMON',
        xpReward: 10,
        targetType: 'word_count',
        targetValue: 10
      },
      {
        key: 'first_100_words',
        title: 'Century Mark',
        description: 'Learn your first 100 words',
        icon: '🏁',
        rarity: 'COMMON',
        xpReward: 50,
        targetType: 'word_count',
        targetValue: 100
      },
      {
        key: 'first_500_words',
        title: 'Word Master',
        description: 'Learn 500 words',
        icon: '🎓',
        rarity: 'RARE',
        xpReward: 200,
        targetType: 'word_count',
        targetValue: 500
      },
      {
        key: '7_day_streak',
        title: 'Week Warrior',
        description: 'Study for 7 days in a row',
        icon: '🔥',
        rarity: 'COMMON',
        xpReward: 30,
        targetType: 'streak_days',
        targetValue: 7
      },
      {
        key: '30_day_streak',
        title: 'Month Master',
        description: 'Study for 30 days in a row',
        icon: '⚡',
        rarity: 'RARE',
        xpReward: 100,
        targetType: 'streak_days',
        targetValue: 30
      },
      {
        key: '100_day_streak',
        title: 'Century Streak',
        description: 'Study for 100 days in a row',
        icon: '👑',
        rarity: 'EPIC',
        xpReward: 500,
        targetType: 'streak_days',
        targetValue: 100
      },
      {
        key: 'first_article',
        title: 'Reader',
        description: 'Read your first article',
        icon: '📖',
        rarity: 'COMMON',
        xpReward: 20,
        targetType: 'articles_read',
        targetValue: 1
      },
      {
        key: '50_articles',
        title: 'Bookworm',
        description: 'Read 50 articles',
        icon: '🐛',
        rarity: 'RARE',
        xpReward: 150,
        targetType: 'articles_read',
        targetValue: 50
      },
      {
        key: 'hsk1_complete',
        title: 'HSK 1 Champion',
        description: 'Master all HSK 1 words',
        icon: '🥇',
        rarity: 'EPIC',
        xpReward: 300,
        targetType: 'hsk_level_complete',
        targetValue: 1
      },
      {
        key: 'hsk6_complete',
        title: 'HSK 6 Legend',
        description: 'Master all HSK 6 words',
        icon: '🏆',
        rarity: 'LEGENDARY',
        xpReward: 2000,
        targetType: 'hsk_level_complete',
        targetValue: 6
      }
    ],
    skipDuplicates: true
  });

  console.log(`   ✅ Created ${achievements.count} achievements\n`);

  // ==================== 2. Create AI Config ====================
  console.log('🤖 Creating AI configuration...');

  const glmApiKey = process.env.GLM_API_KEY || 'your-glm-api-key-here';

  await prisma.aIConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      modelName: 'GLM-4-Flash',
      apiKey: glmApiKey,
      apiUrl: 'https://open.bigmodel.cn/api/paas/v4',
      isActive: true,
      isDefault: true,
      tokenUsed: 0,
      estimatedCost: 0
    }
  });

  console.log('   ✅ AI configuration created\n');

  // ==================== 3. Create Admin User ====================
  console.log('👤 Creating admin user...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@chinesemaster.com';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      level: 1,
      xp: 0,
      streak: 0,
      isPremium: true,
      preferredLang: 'en'
    }
  });

  console.log(`   ✅ Admin user created: ${adminEmail}\n`);

  // ==================== 4. Create Sample User ====================
  console.log('👥 Creating sample test user...');

  const testPassword = await bcrypt.hash('test123456', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: testPassword,
      level: 3,
      xp: 450,
      streak: 7,
      isPremium: false,
      preferredLang: 'en',
      examGoal: {
        level: 4,
        examDate: '2025-06-15',
        readiness: 35
      }
    }
  });

  console.log(`   ✅ Test user created: test@example.com\n`);

  // ==================== 5. Create Daily Mission for Test User ====================
  console.log('🎯 Creating daily mission for test user...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyMission.upsert({
    where: {
      userId_date: {
        userId: testUser.id,
        date: today
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      date: today,
      reviewTarget: 10,
      reviewCurrent: 3,
      reviewCompleted: false,
      reviewXp: 10,
      readTarget: 1,
      readCurrent: 0,
      readCompleted: false,
      readXp: 20,
      addTarget: 5,
      addCurrent: 1,
      addCompleted: false,
      addXp: 15,
      totalProgress: 25,
      allCompleted: false
    }
  });

  console.log('   ✅ Daily mission created\n');

  // ==================== Summary ====================
  console.log('✨ Database seeding completed successfully!\n');
  console.log('📝 Summary:');
  console.log(`   - 10 achievements created`);
  console.log(`   - 1 AI configuration created`);
  console.log(`   - 2 users created (admin + test user)`);
  console.log(`   - 1 daily mission created\n`);
  console.log('🔑 Login Credentials:');
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`   Test User: test@example.com / test123456\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
