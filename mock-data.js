// Mock Data for ChineseMaster UI Demo

const mockData = {
    // User Data
    user: {
        id: 'user1',
        username: 'Sarah',
        email: 'sarah@example.com',
        avatar: 'https://i.pravatar.cc/100?img=20',
        level: 12,
        xp: 2450,
        streak: 30,
        joinedDate: '2024-10-01'
    },
    
    // Learning Stats
    stats: {
        totalWords: 750,
        masteredWords: 450,
        learningWords: 200,
        newWords: 100,
        streakDays: 30,
        todayReviewed: 15,
        nextReviewCount: 23,
        totalReviews: 1250,
        averageAccuracy: 85
    },
    
    // Exam Goal
    examGoal: {
        level: 4,
        examDate: '2025-05-15',
        daysLeft: 87,
        readiness: 64,
        masteredWords: 768,
        totalWords: 1200,
        dailyAverage: 18 // minutes
    },
    
    // Daily Missions
    dailyMissions: {
        date: '2025-01-15',
        tasks: [
            {
                id: 'task1',
                type: 'review',
                title: 'Review 10 words',
                target: 10,
                current: 10,
                completed: true,
                xp: 10
            },
            {
                id: 'task2',
                type: 'read',
                title: 'Read 1 article',
                target: 1,
                current: 1,
                completed: true,
                xp: 20
            },
            {
                id: 'task3',
                type: 'add',
                title: 'Add 5 new words',
                target: 5,
                current: 0,
                completed: false,
                xp: 15
            }
        ],
        totalProgress: 66,
        streakDays: 30
    },
    
    // Achievements
    achievements: [
        {
            id: 'ach1',
            key: 'first_100_words',
            title: 'First 100 Words',
            description: 'Learn your first 100 words',
            icon: '🏁',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-11-15',
            xpReward: 50
        },
        {
            id: 'ach2',
            key: '30_day_streak',
            title: '30-Day Streak',
            description: 'Study for 30 days in a row',
            icon: '🔥',
            rarity: 'rare',
            unlocked: true,
            unlockedAt: '2025-01-10',
            xpReward: 100
        },
        {
            id: 'ach3',
            key: 'reading_marathon',
            title: 'Reading Marathon',
            description: 'Read 50 articles',
            icon: '📚',
            rarity: 'epic',
            unlocked: false,
            progress: 25,
            target: 50,
            xpReward: 200
        },
        {
            id: 'ach4',
            key: 'hsk_master',
            title: 'HSK Master',
            description: 'Pass HSK 6 exam',
            icon: '👑',
            rarity: 'legendary',
            unlocked: false,
            progress: 0,
            target: 1,
            xpReward: 500
        }
    ],
    
    // Recent Words
    recentWords: [
        {
            id: 'word1',
            chinese: '学习',
            pinyin: 'xuéxí',
            english: 'to study, to learn',
            hskLevel: 2,
            status: 'learning',
            addedAt: '2025-01-14'
        },
        {
            id: 'word2',
            chinese: '认识',
            pinyin: 'rènshi',
            english: 'to know, to recognize',
            hskLevel: 2,
            status: 'new',
            addedAt: '2025-01-15'
        },
        {
            id: 'word3',
            chinese: '重要',
            pinyin: 'zhòngyào',
            english: 'important',
            hskLevel: 3,
            status: 'mastered',
            addedAt: '2025-01-13'
        }
    ],
    
    // HSK Levels Progress
    hskProgress: [
        { level: 1, total: 150, mastered: 150, percentage: 100 },
        { level: 2, total: 300, mastered: 300, percentage: 100 },
        { level: 3, total: 600, mastered: 390, percentage: 65 },
        { level: 4, total: 1200, mastered: 0, percentage: 0 },
        { level: 5, total: 2500, mastered: 0, percentage: 0 },
        { level: 6, total: 5000, mastered: 0, percentage: 0 }
    ],
    
    // Word Detail Example
    wordDetail: {
        word: '你好',
        pinyin: 'nǐ hǎo',
        english: 'Hello / Hi',
        hskLevel: 1,
        frequency: 950,
        keyPoints: [
            'Most common greeting in Chinese',
            'Used at any time of day (unlike "good morning")',
            'Can be used both formally and informally',
            'Literally means "you good"'
        ],
        examples: [
            {
                chinese: '你好！很高兴认识你。',
                pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.',
                english: 'Hello! Nice to meet you.'
            },
            {
                chinese: '你好，请问洗手间在哪里？',
                pinyin: 'Nǐ hǎo, qǐngwèn xǐshǒujiān zài nǎlǐ?',
                english: 'Hello, where is the restroom?'
            },
            {
                chinese: '老师好！',
                pinyin: 'Lǎoshī hǎo!',
                english: 'Hello teacher!',
                note: 'When greeting teachers or elders, use their title instead of "你"'
            }
        ],
        commonMistakes: [
            {
                wrong: '你好吗？(as a greeting)',
                correct: '你好！',
                explanation: '"你好吗？" means "How are you?" and requires an answer. For a simple greeting, use "你好！"'
            },
            {
                wrong: 'Nǐhǎo (wrong tone)',
                correct: 'Nǐ hǎo (3rd tone + 3rd tone)',
                explanation: 'Pay attention to tones! Both characters use the 3rd tone (falling-rising).'
            }
        ],
        relatedWords: {
            similar: [
                { chinese: '早上好', pinyin: 'zǎoshang hǎo', english: 'Good morning' },
                { chinese: '晚上好', pinyin: 'wǎnshang hǎo', english: 'Good evening' }
            ],
            related: [
                { chinese: '谢谢', pinyin: 'xièxie', english: 'Thank you' },
                { chinese: '再见', pinyin: 'zàijiàn', english: 'Goodbye' }
            ]
        },
        memoryHook: 'Think "You good?" - that\'s literally what it means!',
        usageTip: 'Use "你好" at any time as a universal greeting. For more formal situations, add the person\'s title.',
        mastery: 75
    },
    
    // Onboarding Quiz Questions
    quizQuestions: [
        {
            id: 'q1',
            question: 'What does "你好" mean?',
            options: [
                { value: 'a', text: 'Goodbye', correct: false },
                { value: 'b', text: 'Hello', correct: true },
                { value: 'c', text: 'Thank you', correct: false },
                { value: 'd', text: 'Excuse me', correct: false }
            ]
        },
        {
            id: 'q2',
            question: 'Choose the correct pinyin for "学习":',
            options: [
                { value: 'a', text: 'xuéxí', correct: true },
                { value: 'b', text: 'xúexì', correct: false },
                { value: 'c', text: 'xuēxī', correct: false },
                { value: 'd', text: 'xuéxǐ', correct: false }
            ]
        }
    ],
    
    // Testimonials
    testimonials: [
        {
            id: 'test1',
            name: 'Sarah Johnson',
            location: 'Stanford Student 🇺🇸',
            avatar: 'https://i.pravatar.cc/100?img=10',
            rating: 5,
            text: 'I passed HSK 5 in just 4 months using ChineseMaster. The daily missions kept me motivated, and the deep content explanations really helped me understand cultural context.'
        },
        {
            id: 'test2',
            name: 'Michael Chen',
            location: 'Marketing Manager 🇬🇧',
            avatar: 'https://i.pravatar.cc/100?img=11',
            rating: 5,
            text: 'As a busy professional, I needed flexible learning. The 15-min daily sessions fit perfectly into my schedule. Landed a promotion thanks to my Chinese skills!'
        },
        {
            id: 'test3',
            name: 'Emma Rodriguez',
            location: 'Freelance Translator 🇪🇸',
            avatar: 'https://i.pravatar.cc/100?img=12',
            rating: 5,
            text: 'The AI-powered recommendations are spot-on. It knew exactly which words I struggled with and gave me targeted practice. Best investment in my language learning!'
        }
    ],
    
    // Featured Words for Landing Page
    featuredWords: [
        {
            word: '你好',
            pinyin: 'nǐ hǎo',
            english: 'Hello',
            hskLevel: 1,
            slug: 'ni-hao'
        },
        {
            word: '学习',
            pinyin: 'xuéxí',
            english: 'To study',
            hskLevel: 2,
            slug: 'xue-xi'
        },
        {
            word: '重要',
            pinyin: 'zhòngyào',
            english: 'Important',
            hskLevel: 3,
            slug: 'zhong-yao'
        },
        {
            word: '机会',
            pinyin: 'jīhuì',
            english: 'Opportunity',
            hskLevel: 4,
            slug: 'ji-hui'
        },
        {
            word: '环境',
            pinyin: 'huánjìng',
            english: 'Environment',
            hskLevel: 5,
            slug: 'huan-jing'
        },
        {
            word: '综合',
            pinyin: 'zōnghé',
            english: 'Comprehensive',
            hskLevel: 6,
            slug: 'zong-he'
        }
    ]
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockData;
}

