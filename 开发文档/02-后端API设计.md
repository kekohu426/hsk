# 02-后端API设计

## 概述

本文档详细定义ChineseMaster平台的所有RESTful API端点，包括请求/响应格式、认证机制和错误处理。

### 技术栈

- **框架**: Express.js
- **数据库ORM**: Prisma
- **认证**: JWT (JSON Web Tokens)
- **验证**: Joi / Zod
- **API文档**: Swagger/OpenAPI 3.0

### API基础URL

```
开发环境: http://localhost:3000
生产环境: https://api.chinesemaster.com
```

---

## 🔐 认证机制

### JWT Token结构

```json
{
  "userId": 123,
  "email": "user@example.com",
  "role": "USER", // USER | ADMIN
  "iat": 1634567890,
  "exp": 1634654290
}
```

### 请求头认证

```http
Authorization: Bearer <JWT_TOKEN>
```

### Token刷新策略

- Access Token有效期: 24小时
- Refresh Token有效期: 30天
- 自动刷新机制在前端实现

---

## 📁 API端点分类

### 1️⃣ 认证相关 (`/api/auth`)

#### POST /api/auth/register
注册新用户

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "learner01"
}
```

**响应** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "user@example.com",
      "username": "learner01",
      "role": "USER",
      "isPremium": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "该邮箱已被注册"
  }
}
```

---

#### POST /api/auth/login
用户登录

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "user@example.com",
      "username": "learner01",
      "role": "USER",
      "isPremium": true,
      "level": 5,
      "xp": 2500
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "邮箱或密码错误"
  }
}
```

---

#### POST /api/auth/logout
用户登出

**认证**: 必需

**请求体**:
```json
{}
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "登出成功"
}
```

**说明**:
- 前端应删除localStorage中的token
- 后端可选：将token加入Redis黑名单（如果实现token撤销机制）
- token有效期：24小时后自动失效

---

#### POST /api/auth/forgot-password
忘记密码（发送重置邮件）

**认证**: 不需要

**请求体**:
```json
{
  "email": "user@example.com"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "密码重置邮件已发送，请检查您的邮箱"
}
```

**说明**:
- 生成唯一的重置token（有效期1小时）
- 发送包含重置链接的邮件
- 即使邮箱不存在也返回成功（安全考虑）

---

#### POST /api/auth/reset-password
重置密码

**认证**: 不需要

**请求体**:
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "密码重置成功，请使用新密码登录"
}
```

**错误响应** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "重置token无效或已过期"
  }
}
```

---

### 2️⃣ 用户管理 (`/api/users`)

#### GET /api/users/me
获取当前用户信息

**认证**: 必需

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "username": "learner01",
    "role": "USER",
    "isPremium": true,
    "level": 5,
    "xp": 2500,
    "streak": 15,
    "wordBankCount": {
      "toLearn": 100,
      "learning": 250,
      "mastered": 450
    },
    "hskProgress": {
      "hsk1": { "total": 150, "mastered": 150 },
      "hsk2": { "total": 150, "mastered": 120 },
      "hsk3": { "total": 300, "mastered": 180 },
      "hsk4": { "total": 600, "mastered": 0 },
      "hsk5": { "total": 1300, "mastered": 0 },
      "hsk6": { "total": 2500, "mastered": 0 }
    }
  }
}
```

---

#### PUT /api/users/me
更新当前用户信息

**认证**: 必需

**请求体**:
```json
{
  "username": "new_username",
  "avatar": "https://example.com/avatar.jpg"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 123,
    "username": "new_username",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

#### GET /api/users/stats
获取用户学习统计

**认证**: 必需

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalWords": 800,
    "totalArticlesRead": 25,
    "totalStudyTime": 18000, // 秒
    "currentStreak": 15,
    "longestStreak": 30,
    "recentActivity": [
      {
        "type": "WORD_LEARNED",
        "timestamp": "2025-10-22T10:30:00Z",
        "details": { "word": "你好", "hskLevel": 1 }
      },
      {
        "type": "ARTICLE_READ",
        "timestamp": "2025-10-22T09:15:00Z",
        "details": { "articleId": 42, "title": "中国的茶文化" }
      }
    ],
    "achievements": [
      {
        "id": 1,
        "name": "First 100 Words",
        "icon": "🏅",
        "rarity": "COMMON",
        "earnedAt": "2025-10-15T12:00:00Z"
      }
    ]
  }
}
```

---

#### GET /api/users/stats/trends
获取用户学习趋势数据

**认证**: 必需

**查询参数**:
- `period`: 时间周期，7days | 30days | 90days (默认: 7days)

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "period": "7days",
    "trends": [
      {
        "date": "2025-10-17",
        "studyTime": 1800, // 秒
        "wordsLearned": 15,
        "articlesRead": 2,
        "xpEarned": 85
      },
      {
        "date": "2025-10-18",
        "studyTime": 2400,
        "wordsLearned": 20,
        "articlesRead": 1,
        "xpEarned": 105
      }
      // ... 其他日期
    ],
    "summary": {
      "totalStudyTime": 12600,
      "averageStudyTime": 1800,
      "totalWordsLearned": 105,
      "totalArticlesRead": 8,
      "totalXpEarned": 620
    }
  }
}
```

---

#### PUT /api/users/me/password
修改密码

**认证**: 必需

**请求体**:
```json
{
  "oldPassword": "CurrentPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

**错误响应** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "当前密码错误"
  }
}
```

---

#### GET /api/users/me/export
导出用户学习数据

**认证**: 必需

**查询参数**:
- `format`: json | csv (默认: json)

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "username": "learner01",
      "email": "user@example.com",
      "level": 5,
      "xp": 2500,
      "createdAt": "2025-10-01T00:00:00Z"
    },
    "wordBank": [
      {
        "word": "你好",
        "pinyin": "nǐ hǎo",
        "hskLevel": 1,
        "status": "MASTERED",
        "addedAt": "2025-10-01T12:00:00Z",
        "reviewCount": 10
      }
      // ... 所有词汇
    ],
    "readingHistory": [
      {
        "articleTitle": "中国的茶文化",
        "readAt": "2025-10-15T14:00:00Z",
        "timeSpent": 480
      }
      // ... 阅读历史
    ],
    "achievements": [
      {
        "name": "First 100 Words",
        "earnedAt": "2025-10-15T12:00:00Z"
      }
      // ... 成就
    ]
  }
}
```

**说明**:
- format=csv时，返回CSV文件（Content-Type: text/csv）
- 遵守GDPR数据导出要求

---

### 3️⃣ 词汇相关 (`/api/words`)

#### GET /api/words
获取词汇列表（支持过滤和分页）

**认证**: 必需

**查询参数**:
- `hskLevel`: 1-6 (可选)
- `status`: TO_LEARN | LEARNING | MASTERED (可选)
- `search`: 搜索关键词 (可选)
- `page`: 页码，默认1
- `limit`: 每页数量，默认20

**请求示例**:
```
GET /api/words?hskLevel=2&status=LEARNING&page=1&limit=20
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "words": [
      {
        "id": 101,
        "word": "学习",
        "pinyinWithTones": "xué xí",
        "english": "to study, to learn",
        "hskLevel": 2,
        "userWordStatus": "LEARNING",
        "nextReviewDate": "2025-10-23T14:00:00Z",
        "reviewCount": 3,
        "correctRate": 0.85
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    }
  }
}
```

---

#### GET /api/words/:wordId
获取词汇详情

**认证**: 可选（登录用户可看学习状态）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 101,
    "word": "学习",
    "pinyinWithTones": "xué xí",
    "pinyinWithNumbers": "xue2 xi2",
    "english": "to study, to learn",
    "hskLevel": 2,
    "partOfSpeech": "verb",
    "contentJson": {
      "quickLearn": {
        "keyPoints": [
          "学习 (xué xí) 是由两个字组成的动词",
          "学 (xué) 表示学习的动作",
          "习 (xí) 表示练习和实践",
          "常用于描述系统性的学习过程"
        ],
        "examples": [
          {
            "chinese": "我在学习中文。",
            "pinyin": "Wǒ zài xué xí zhōng wén.",
            "english": "I am studying Chinese."
          }
        ],
        "commonMistakes": [
          {
            "mistake": "学习汉语很难。❌",
            "correction": "学中文很难。✅ (日常口语中更常用'学'而不是'学习')"
          }
        ],
        "quiz": [
          {
            "question": "Which sentence correctly uses 学习?",
            "options": [
              "我学习中文两年了。",
              "我学习很累。",
              "学习很好吃。"
            ],
            "correct": 0
          }
        ]
      },
      "deepDive": {
        "etymology": "学习一词源自古汉语...",
        "cultural": "在中国文化中，学习被视为...",
        "grammar": "学习作为动词，可以接名词作宾语...",
        "usage": "学习可用于正式和非正式场合..."
      },
      "practice": {
        "writingPrompt": "写一段话描述你今天学习了什么",
        "pronunciationTips": "注意'学'是第二声，'习'也是第二声..."
      }
    },
    "userWordData": {
      "status": "LEARNING",
      "addedAt": "2025-10-20T10:00:00Z",
      "nextReviewDate": "2025-10-23T14:00:00Z",
      "reviewCount": 3,
      "correctCount": 8,
      "incorrectCount": 2,
      "currentInterval": 3 // SuperMemo间隔（天）
    }
  }
}
```

---

#### POST /api/words/:wordId/add
将词汇添加到个人词库

**认证**: 必需

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "wordId": 101,
    "status": "TO_LEARN",
    "addedAt": "2025-10-23T12:00:00Z",
    "nextReviewDate": "2025-10-23T12:00:00Z"
  }
}
```

---

#### POST /api/words/:wordId/review
提交词汇复习结果

**认证**: 必需

**请求体**:
```json
{
  "quality": 4, // SuperMemo质量评分 0-5
  "timeSpent": 15 // 秒
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "wordId": 101,
    "newStatus": "LEARNING",
    "nextReviewDate": "2025-10-26T14:00:00Z",
    "interval": 3, // 新间隔（天）
    "easeFactor": 2.5,
    "reviewCount": 4,
    "xpEarned": 10
  }
}
```

---

#### GET /api/words/due
获取待复习词汇

**认证**: 必需

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "dueWords": [
      {
        "id": 101,
        "word": "学习",
        "pinyinWithTones": "xué xí",
        "english": "to study",
        "hskLevel": 2,
        "nextReviewDate": "2025-10-23T10:00:00Z"
      }
    ],
    "totalDue": 15
  }
}
```

---

#### GET /api/words/:wordId/related
获取相关词汇推荐

**认证**: 可选

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "related": [
      {
        "id": 102,
        "word": "学生",
        "pinyinWithTones": "xué shēng",
        "english": "student",
        "hskLevel": 1,
        "relationType": "SEMANTIC" // SEMANTIC | SYNONYM | ANTONYM | COMPOUND
      },
      {
        "id": 103,
        "word": "学校",
        "pinyinWithTones": "xué xiào",
        "english": "school",
        "hskLevel": 1,
        "relationType": "SEMANTIC"
      },
      {
        "id": 104,
        "word": "教",
        "pinyinWithTones": "jiāo",
        "english": "to teach",
        "hskLevel": 2,
        "relationType": "ANTONYM"
      }
    ],
    "totalRelated": 10
  }
}
```

**说明**:
- 返回最多10个相关词汇
- 优先级：近义词 > 反义词 > 语义相关 > 组合词
- 算法基于：共现频率、语义相似度、字符组合关系

---

### 4️⃣ 文章相关 (`/api/articles`)

#### GET /api/articles
获取文章列表

**认证**: 可选

**查询参数**:
- `category`: 类别 (可选)
- `hskLevel`: 1-6 (可选)
- `search`: 搜索关键词（标题、内容） (可选)
- `page`: 页码
- `limit`: 每页数量

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": 42,
        "slug": "chinese-tea-culture",
        "title": "中国的茶文化",
        "excerpt": "茶文化是中国传统文化的重要组成部分...",
        "coverImage": "https://example.com/tea.jpg",
        "author": "李老师",
        "category": "Culture",
        "hskLevel": 3,
        "wordCount": 850,
        "estimatedReadTime": 8, // 分钟
        "publishedAt": "2025-10-20T00:00:00Z",
        "viewCount": 1250,
        "isBookmarked": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100
    }
  }
}
```

---

#### GET /api/articles/:slug
获取文章详情

**认证**: 可选（登录用户可看阅读进度）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 42,
    "slug": "chinese-tea-culture",
    "title": "中国的茶文化",
    "content": "茶文化是中国传统文化的重要组成部分...",
    "annotatedContent": "<p>茶文化是<span class='word-item hsk-2' data-word='中国' data-pinyin='Zhōng guó' data-meaning='China'>中国</span>传统文化...</p>",
    "author": "李老师",
    "category": "Culture",
    "hskLevel": 3,
    "wordCount": 850,
    "wordDistribution": {
      "HSK1": 150,
      "HSK2": 120,
      "HSK3": 80,
      "HSK4": 20,
      "HSK5": 5,
      "HSK6": 2
    },
    "publishedAt": "2025-10-20T00:00:00Z",
    "viewCount": 1251,
    "userProgress": {
      "isRead": false,
      "lastPosition": 0,
      "readingTime": 0
    }
  }
}
```

---

#### POST /api/articles/:articleId/bookmark
收藏/取消收藏文章

**认证**: 必需

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "isBookmarked": true
  }
}
```

---

#### POST /api/articles/:articleId/progress
更新文章阅读进度

**认证**: 必需

**请求体**:
```json
{
  "position": 0.65, // 0-1，阅读进度百分比
  "timeSpent": 180 // 秒
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "position": 0.65,
    "timeSpent": 180,
    "isCompleted": false,
    "xpEarned": 0
  }
}
```

---

#### GET /api/articles/:articleId/related
获取相关文章推荐

**认证**: 可选

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "related": [
      {
        "id": 43,
        "slug": "chinese-tea-ceremony",
        "title": "中国茶道的艺术",
        "excerpt": "深入探讨中国茶道的历史和文化意义...",
        "coverImage": "https://example.com/tea-ceremony.jpg",
        "category": "Culture",
        "hskLevel": 3,
        "estimatedReadTime": 6,
        "similarity": 0.85 // 相似度评分
      },
      {
        "id": 44,
        "slug": "tea-regions-china",
        "title": "中国著名的茶叶产区",
        "excerpt": "了解中国主要的茶叶产区和特色...",
        "coverImage": "https://example.com/tea-regions.jpg",
        "category": "Culture",
        "hskLevel": 3,
        "estimatedReadTime": 5,
        "similarity": 0.78
      }
    ],
    "totalRelated": 5
  }
}
```

**说明**:
- 返回最多5篇相关文章
- 推荐算法基于：
  - 内容相似度（TF-IDF、词嵌入）
  - 相同类别
  - 相同HSK等级
  - 用户阅读历史

---

### 5️⃣ 文本分析 (`/api/text`)

#### POST /api/text/analyze
分析中文文本（提取词汇、标注HSK等级）

**认证**: 必需

**请求体**:
```json
{
  "text": "我今天学习了中文。"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "words": [
      {
        "word": "我",
        "pinyin": "wǒ",
        "english": "I, me",
        "hskLevel": 1,
        "position": { "start": 0, "end": 1 }
      },
      {
        "word": "今天",
        "pinyin": "jīn tiān",
        "english": "today",
        "hskLevel": 1,
        "position": { "start": 1, "end": 3 }
      }
    ],
    "totalWords": 5,
    "uniqueWords": 5,
    "hskDistribution": {
      "HSK1": 4,
      "HSK2": 1
    },
    "difficulty": "EASY",
    "annotatedHtml": "<span class='word-item hsk-1' data-word='我' data-pinyin='wǒ' data-meaning='I, me'>我</span>..."
  }
}
```

---

### 6️⃣ 每日任务 (`/api/daily-missions`)

#### GET /api/daily-missions
获取今日任务

**认证**: 必需

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "missions": [
      {
        "id": 1,
        "type": "REVIEW_WORDS",
        "description": "复习 10 个词汇",
        "target": 10,
        "progress": 7,
        "xpReward": 10,
        "status": "IN_PROGRESS", // PENDING | IN_PROGRESS | COMPLETED
        "completedAt": null
      },
      {
        "id": 2,
        "type": "READ_ARTICLE",
        "description": "阅读文章 15 分钟",
        "target": 15,
        "progress": 0,
        "xpReward": 20,
        "status": "PENDING",
        "completedAt": null
      }
    ],
    "totalXpToday": 10,
    "completedCount": 0,
    "totalCount": 3
  }
}
```

---

#### POST /api/daily-missions/:missionId/claim
领取任务奖励

**认证**: 必需

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "missionId": 1,
    "xpEarned": 10,
    "totalXp": 2510,
    "newLevel": 5
  }
}
```

---

### 7️⃣ 成就系统 (`/api/achievements`)

#### GET /api/achievements
获取所有成就

**认证**: 必需

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": 1,
        "name": "First 100 Words",
        "description": "Add 100 words to your word bank",
        "icon": "🏅",
        "rarity": "COMMON",
        "condition": {
          "type": "WORD_COUNT",
          "target": 100
        },
        "progress": 100,
        "isEarned": true,
        "earnedAt": "2025-10-15T12:00:00Z"
      },
      {
        "id": 2,
        "name": "30-Day Streak",
        "description": "Maintain a 30-day learning streak",
        "icon": "🔥",
        "rarity": "RARE",
        "condition": {
          "type": "STREAK_DAYS",
          "target": 30
        },
        "progress": 15,
        "isEarned": false,
        "earnedAt": null
      }
    ],
    "totalAchievements": 20,
    "earnedAchievements": 5
  }
}
```

---

### 8️⃣ HSK词库 (`/api/hsk`)

#### GET /api/hsk/:level/words
获取指定HSK等级的所有词汇

**认证**: 可选

**查询参数**:
- `page`: 页码
- `limit`: 每页数量

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "hskLevel": 2,
    "words": [
      {
        "id": 101,
        "word": "学习",
        "pinyinWithTones": "xué xí",
        "english": "to study",
        "userStatus": "LEARNING", // 登录用户的学习状态
        "isMastered": false
      }
    ],
    "totalWords": 150,
    "userMasteredCount": 45, // 用户已掌握的数量
    "pagination": {
      "currentPage": 1,
      "totalPages": 8
    }
  }
}
```

---

### 9️⃣ 管理员API (`/api/admin`)

#### POST /api/admin/word-entries/import
导入词汇（CSV批量导入）

**认证**: 必需（Admin权限）

**请求体**: `multipart/form-data`
```
file: words.csv
```

**CSV格式**:
```csv
word,pinyinWithTones,pinyinWithNumbers,english,hskLevel,partOfSpeech
你好,nǐ hǎo,ni3 hao3,hello,1,interjection
学习,xué xí,xue2 xi2,to study,2,verb
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "imported": 150,
    "skipped": 5,
    "errors": [
      {
        "row": 23,
        "error": "Missing required field: english"
      }
    ]
  }
}
```

---

#### POST /api/admin/generation/batch
批量生成AI内容

**认证**: 必需（Admin权限）

**请求体**:
```json
{
  "type": "WORD", // WORD | ARTICLE
  "targetIds": [101, 102, 103],
  "priority": "HIGH" // LOW | NORMAL | HIGH
}
```

**响应** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "batchId": "batch_abc123",
    "jobCount": 3,
    "estimatedTime": 180, // 秒
    "status": "QUEUED"
  }
}
```

---

#### GET /api/admin/generation/batch/:batchId/progress
获取批量生成进度

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "batchId": "batch_abc123",
    "status": "IN_PROGRESS", // QUEUED | IN_PROGRESS | COMPLETED | FAILED
    "totalJobs": 3,
    "completedJobs": 2,
    "failedJobs": 0,
    "progress": 66.7,
    "jobs": [
      {
        "id": "job_1",
        "type": "WORD",
        "targetId": 101,
        "status": "COMPLETED",
        "completedAt": "2025-10-23T12:05:00Z"
      },
      {
        "id": "job_2",
        "type": "WORD",
        "targetId": 102,
        "status": "COMPLETED",
        "completedAt": "2025-10-23T12:06:00Z"
      },
      {
        "id": "job_3",
        "type": "WORD",
        "targetId": 103,
        "status": "IN_PROGRESS",
        "startedAt": "2025-10-23T12:06:30Z"
      }
    ]
  }
}
```

---

#### GET /api/admin/users
获取所有用户（分页）

**认证**: 必需（Admin权限）

**查询参数**:
- `search`: 搜索关键词
- `role`: USER | ADMIN
- `isPremium`: true | false
- `page`: 页码
- `limit`: 每页数量

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 123,
        "email": "user@example.com",
        "username": "learner01",
        "role": "USER",
        "isPremium": true,
        "level": 5,
        "xp": 2500,
        "createdAt": "2025-10-01T00:00:00Z",
        "lastActiveAt": "2025-10-23T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200
    }
  }
}
```

---

#### GET /api/admin/users/:userId/stats
获取用户详细学习统计

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": 123,
    "username": "learner01",
    "level": 5,
    "xp": 2500,
    "streak": 15,
    "wordBank": {
      "toLearn": 100,
      "learning": 250,
      "mastered": 450,
      "total": 800
    },
    "hskProgress": {
      "hsk1": { "total": 150, "mastered": 150, "percentage": 100 },
      "hsk2": { "total": 150, "mastered": 120, "percentage": 80 },
      "hsk3": { "total": 300, "mastered": 180, "percentage": 60 },
      "hsk4": { "total": 600, "mastered": 0, "percentage": 0 },
      "hsk5": { "total": 1300, "mastered": 0, "percentage": 0 },
      "hsk6": { "total": 2500, "mastered": 0, "percentage": 0 }
    },
    "recentActivities": [
      {
        "type": "WORD_LEARNED",
        "timestamp": "2025-10-23T10:30:00Z",
        "details": { "word": "学习", "hskLevel": 2 }
      }
    ],
    "achievements": [
      {
        "id": 1,
        "name": "First 100 Words",
        "earnedAt": "2025-10-15T12:00:00Z"
      }
    ]
  }
}
```

---

#### POST /api/admin/daily-missions
创建每日任务模板

**认证**: 必需（Admin权限）

**请求体**:
```json
{
  "type": "REVIEW_WORDS",
  "description": "复习 {target} 个词汇",
  "target": 10,
  "xpReward": 10
}
```

**响应** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "type": "REVIEW_WORDS",
    "description": "复习 10 个词汇",
    "target": 10,
    "xpReward": 10,
    "createdAt": "2025-10-23T12:00:00Z"
  }
}
```

---

#### POST /api/admin/achievements
创建成就

**认证**: 必需（Admin权限）

**请求体**:
```json
{
  "name": "Reading Marathon",
  "description": "Read 50 articles",
  "icon": "📚",
  "rarity": "EPIC",
  "condition": {
    "type": "ARTICLE_READ",
    "target": 50
  }
}
```

**响应** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Reading Marathon",
    "description": "Read 50 articles",
    "icon": "📚",
    "rarity": "EPIC",
    "condition": {
      "type": "ARTICLE_READ",
      "target": 50
    },
    "createdAt": "2025-10-23T12:00:00Z"
  }
}
```

---

#### GET /api/admin/static/pages
获取静态页面生成状态

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalPages": 10500,
    "generatedPages": 8500,
    "pendingPages": 1800,
    "failedPages": 200,
    "generationProgress": 81.0,
    "pages": [
      {
        "id": 1,
        "wordId": 101,
        "word": "学习",
        "slug": "xue-xi",
        "hskLevel": 2,
        "status": "GENERATED",
        "generatedAt": "2025-10-20T10:00:00Z"
      }
    ]
  }
}
```

---

#### POST /api/admin/static/generate-all
批量生成所有静态页面

**认证**: 必需（Admin权限)

**响应** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "message": "Static page generation started",
    "totalPages": 10500,
    "estimatedTime": 8750 // 秒 (~2.5小时，按3秒/页计算)
  }
}
```

---

#### POST /api/admin/static/regenerate/:wordId
重新生成单个词条的静态页面

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "wordId": 101,
    "word": "学习",
    "slug": "xue-xi",
    "status": "GENERATED",
    "generatedAt": "2025-10-23T12:10:00Z"
  }
}
```

---

#### POST /api/admin/static/sitemap
生成sitemap.xml

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Sitemap generated successfully",
    "url": "https://chinesemaster.com/sitemap.xml",
    "totalUrls": 10500,
    "generatedAt": "2025-10-23T12:15:00Z"
  }
}
```

---

#### POST /api/admin/articles/annotate
标注文章中的词汇

**认证**: 必需（Admin权限）

**请求体**:
```json
{
  "text": "我今天学习了中文。"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "annotatedHtml": "<span class='word-item hsk-1' data-word='我' data-pinyin='wǒ' data-meaning='I, me'>我</span>...",
    "wordDistribution": {
      "HSK1": 4,
      "HSK2": 1
    },
    "totalWords": 5
  }
}
```

---

## 🚨 错误处理

### 标准错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // 可选，额外的错误详情
  }
}
```

### 常见错误码

| HTTP状态码 | 错误码 | 描述 |
|-----------|--------|------|
| 400 | BAD_REQUEST | 请求参数错误 |
| 400 | EMAIL_EXISTS | 邮箱已被注册 |
| 400 | INVALID_CREDENTIALS | 邮箱或密码错误 |
| 401 | UNAUTHORIZED | 未登录或token无效 |
| 403 | FORBIDDEN | 权限不足 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突 |
| 422 | VALIDATION_ERROR | 数据验证失败 |
| 429 | RATE_LIMIT_EXCEEDED | 请求频率超限 |
| 500 | INTERNAL_SERVER_ERROR | 服务器内部错误 |

---

## 🔒 API安全

### 速率限制

- **认证端点**: 5次/分钟/IP
- **普通API**: 100次/分钟/用户
- **管理员API**: 1000次/分钟/管理员

### CORS配置

```javascript
{
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

### 输入验证

所有用户输入必须经过验证：
- Email格式验证
- 密码强度验证（最少8位，包含字母和数字）
- SQL注入防护（使用Prisma参数化查询）
- XSS防护（前端输入过滤）

---

## 📊 API监控

### 响应时间要求

- GET请求: < 200ms
- POST/PUT请求: < 500ms
- 批量操作: < 2000ms

### 日志记录

记录以下信息：
- 请求方法、路径、参数
- 用户ID（如已认证）
- 响应状态码
- 响应时间
- 错误堆栈（如发生错误）

---

## 🧪 API测试

### 测试工具

- **单元测试**: Jest + Supertest
- **集成测试**: Jest + Prisma Test Database
- **API文档测试**: Postman Collection

### 测试覆盖率要求

- 路由处理: 100%
- 业务逻辑: 90%+
- 错误处理: 100%

---

## 📝 API版本管理

当前版本: **v1**

版本策略：
- 破坏性变更需要新版本号
- 向后兼容的改进可在当前版本更新
- 旧版本至少支持6个月过渡期

---

## 🆕 补充API端点

以下是补充的额外API端点，用于完善系统功能。

### 管理后台 - 文章管理补充

#### POST /api/admin/articles/generate-content
基于Prompt生成文章内容（不创建数据库记录）

**认证**: 必需（Admin权限）

**请求体**:
```json
{
  "prompt": "写一篇关于中国春节传统习俗的文章",
  "hskLevel": 3,
  "category": "Culture",
  "targetWordCount": 800
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "content": "春节是中国最重要的传统节日...",
    "wordCount": 850,
    "estimatedHskLevel": 3,
    "suggestedTitle": "中国春节的传统习俗"
  }
}
```

**说明**:
- 用于文章编辑器中的"AI生成内容"功能
- 返回纯文本内容，由管理员决定是否使用和保存
- 生成时间约30-60秒

---

### 管理后台 - 用户管理补充

#### PUT /api/admin/users/:userId
更新用户信息

**认证**: 必需（Admin权限）

**请求体**:
```json
{
  "isPremium": true,
  "level": 10,
  "xp": 5000,
  "role": "USER" // USER | ADMIN
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 123,
    "username": "learner01",
    "isPremium": true,
    "level": 10,
    "xp": 5000,
    "role": "USER"
  }
}
```

---

#### DELETE /api/admin/users/:userId
删除用户

**认证**: 必需（Admin权限）

**查询参数**:
- `hard`: true | false (默认: false，软删除)

**响应** (200 OK):
```json
{
  "success": true,
  "message": "用户已删除"
}
```

**说明**:
- 默认为软删除（设置deletedAt字段）
- hard=true时永久删除用户及所有关联数据
- 删除操作会记录到操作日志

---

### 管理后台 - 统计数据补充

#### GET /api/admin/daily-missions/stats
获取任务完成率统计

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "missions": [
      {
        "id": 1,
        "type": "REVIEW_WORDS",
        "description": "复习 10 个词汇",
        "totalAssigned": 500, // 分配给多少用户
        "totalCompleted": 350, // 完成次数
        "completionRate": 0.70, // 完成率
        "averageTimeToComplete": 180 // 平均完成时间（秒）
      },
      {
        "id": 2,
        "type": "READ_ARTICLE",
        "description": "阅读文章 15 分钟",
        "totalAssigned": 500,
        "totalCompleted": 200,
        "completionRate": 0.40,
        "averageTimeToComplete": 900
      }
    ],
    "overallCompletionRate": 0.55
  }
}
```

---

#### GET /api/admin/achievements/stats
获取成就获得统计

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": 1,
        "name": "First 100 Words",
        "icon": "🏅",
        "rarity": "COMMON",
        "totalUsers": 1000, // 总用户数
        "earnedCount": 650, // 获得人数
        "earnedRate": 0.65, // 获得率
        "averageTimeToEarn": 7 // 平均获得天数
      },
      {
        "id": 2,
        "name": "30-Day Streak",
        "icon": "🔥",
        "rarity": "RARE",
        "totalUsers": 1000,
        "earnedCount": 120,
        "earnedRate": 0.12,
        "averageTimeToEarn": 35
      }
    ],
    "summary": {
      "totalAchievements": 20,
      "averageEarnedPerUser": 3.5
    }
  }
}
```

---

#### GET /api/admin/activity-logs
获取管理员操作日志

**认证**: 必需（Admin权限）

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `action`: 操作类型过滤 (可选)
- `adminId`: 管理员ID过滤 (可选)

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "adminId": 1,
        "adminUsername": "admin01",
        "action": "DELETE_USER",
        "targetType": "User",
        "targetId": 123,
        "details": {
          "username": "deleted_user",
          "reason": "Spam account"
        },
        "ipAddress": "192.168.1.1",
        "timestamp": "2025-10-23T10:30:00Z"
      },
      {
        "id": 2,
        "adminId": 1,
        "adminUsername": "admin01",
        "action": "UPDATE_WORD",
        "targetType": "Word",
        "targetId": 101,
        "details": {
          "word": "学习",
          "changes": {
            "status": {
              "old": "DRAFT",
              "new": "PUBLISHED"
            }
          }
        },
        "ipAddress": "192.168.1.1",
        "timestamp": "2025-10-23T10:25:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalItems": 1000
    }
  }
}
```

---

### 管理后台 - AI配置补充

#### POST /api/admin/ai-config/test
测试AI连接

**认证**: 必需（Admin权限）

**请求体**:
```json
{
  "apiKey": "optional_test_key" // 可选，测试特定密钥
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "status": "connected",
    "model": "glm-4-flash",
    "latency": 250, // 毫秒
    "testContent": "AI测试响应内容..."
  }
}
```

**错误响应** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "AI_CONNECTION_FAILED",
    "message": "GLM API连接失败：Invalid API key"
  }
}
```

---

### 系统级API

#### GET /api/health
基础健康检查

**认证**: 不需要

**响应** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T10:30:00Z",
  "uptime": 86400, // 秒
  "version": "1.0.0"
}
```

**说明**:
- 用于负载均衡器和监控系统
- 响应时间应 < 50ms
- 不进行数据库查询

---

#### GET /api/admin/system/status
详细系统状态监控

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "overall": "healthy", // healthy | degraded | down
    "timestamp": "2025-10-23T10:30:00Z",
    "components": {
      "database": {
        "status": "healthy",
        "responseTime": 5, // 毫秒
        "connections": {
          "active": 10,
          "idle": 20,
          "max": 50
        }
      },
      "redis": {
        "status": "healthy",
        "responseTime": 2,
        "memory": {
          "used": 52428800, // 字节
          "max": 536870912
        }
      },
      "queue": {
        "status": "healthy",
        "jobs": {
          "waiting": 5,
          "active": 3,
          "completed": 1250,
          "failed": 12
        }
      },
      "ai": {
        "status": "healthy",
        "latency": 250,
        "lastCheck": "2025-10-23T10:25:00Z"
      }
    },
    "performance": {
      "cpu": 45.2, // 百分比
      "memory": 68.5,
      "disk": 72.0
    }
  }
}
```

**说明**:
- 用于管理后台仪表盘显示
- 检查所有关键服务状态
- 每30秒缓存一次结果

---

### 管理后台 - Dashboard统计完善

#### GET /api/admin/dashboard/stats（完整字段定义）

**响应字段说明**:
```json
{
  "success": true,
  "data": {
    // 用户统计
    "users": {
      "total": 1000,
      "activeToday": 250,
      "activeThisWeek": 600,
      "activeThisMonth": 850,
      "newToday": 15,
      "newThisWeek": 80,
      "newThisMonth": 250,
      "premiumUsers": 150,
      "premiumRate": 0.15
    },

    // 内容统计
    "content": {
      "totalWords": 10500,
      "publishedWords": 8500,
      "draftWords": 2000,
      "totalArticles": 150,
      "publishedArticles": 120,
      "draftArticles": 30
    },

    // AI生成统计
    "ai": {
      "totalGenerated": 8500,
      "generatingNow": 50,
      "pendingGeneration": 1950,
      "failedGeneration": 12,
      "averageGenerationTime": 45, // 秒
      "currentBatchProgress": 65.5 // 百分比
    },

    // 学习统计
    "learning": {
      "totalWordsLearned": 125000,
      "totalArticlesRead": 3500,
      "totalStudyTime": 450000, // 秒
      "averageStudyTimePerUser": 450 // 秒/用户
    },

    // 系统健康
    "system": {
      "status": "healthy",
      "apiResponseTime": 150, // 毫秒
      "errorRate": 0.005 // 0.5%
    },

    // 最近活动（最新10条）
    "recentActivities": [
      {
        "type": "USER_REGISTERED",
        "username": "new_user",
        "timestamp": "2025-10-23T10:25:00Z"
      },
      {
        "type": "WORD_GENERATED",
        "word": "学习",
        "timestamp": "2025-10-23T10:20:00Z"
      }
    ]
  }
}
```

---

### 管理后台 - 队列管理

#### GET /api/admin/queue/status
获取队列详细状态

**认证**: 必需（Admin权限）

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "status": "running", // running | paused | stopped
    "queues": {
      "generation": {
        "waiting": 150,
        "active": 3,
        "completed": 8350,
        "failed": 12,
        "delayed": 0,
        "paused": 0
      }
    },
    "workers": {
      "total": 3,
      "active": 3,
      "idle": 0
    },
    "performance": {
      "avgProcessingTime": 42000, // 毫秒
      "throughput": 2.5, // 任务/分钟
      "successRate": 0.998
    },
    "currentBatch": {
      "id": "batch_abc123",
      "type": "WORD_CONTENT",
      "totalTasks": 200,
      "completedTasks": 130,
      "progress": 65.0,
      "estimatedTimeRemaining": 2800, // 秒
      "startedAt": "2025-10-23T10:00:00Z"
    }
  }
}
```

**说明**:
- 用于管理后台"AI生成"页面的队列状态显示
- 提供详细的队列运行数据和性能指标
- 实时更新的任务进度信息

---

#### GET /api/admin/queue/jobs/:jobId
获取单个任务的详细进度

**认证**: 必需（Admin权限）

**URL参数**:
- `jobId`: 任务ID

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "task-12345",
    "type": "WORD_CONTENT",
    "status": "active", // waiting | active | completed | failed
    "targetId": "word_789",
    "target": {
      "word": "学习",
      "slug": "xue-xi"
    },
    "batchId": "batch_abc123",
    "progress": 75,
    "attempts": 1,
    "maxAttempts": 3,
    "startedAt": "2025-10-23T10:15:00Z",
    "estimatedCompletion": "2025-10-23T10:16:30Z",
    "logs": [
      {
        "timestamp": "2025-10-23T10:15:05Z",
        "level": "info",
        "message": "调用GLM API..."
      },
      {
        "timestamp": "2025-10-23T10:15:25Z",
        "level": "info",
        "message": "AI生成完成，正在验证数据..."
      }
    ]
  }
}
```

**错误响应** (404 Not Found):
```json
{
  "success": false,
  "error": "Task not found"
}
```

**说明**:
- 用于实时查看单个任务的执行进度
- 包含详细的日志信息，用于调试
- 支持通过WebSocket推送实时更新（可选）

---

#### GET /api/admin/queue/batches
获取所有生成批次列表

**认证**: 必需（Admin权限）

**查询参数**:
- `page`: 页码（默认: 1）
- `limit`: 每页数量（默认: 20）
- `status`: 批次状态过滤 - `PENDING` | `PROCESSING` | `COMPLETED` | `FAILED` | `CANCELLED`
- `type`: 批次类型过滤 - `WORD_CONTENT` | `ARTICLE_CONTENT` | `HTML_GENERATION`

**响应** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "batch_abc123",
      "type": "WORD_CONTENT",
      "status": "PROCESSING",
      "totalTasks": 200,
      "completedTasks": 130,
      "failedTasks": 2,
      "progress": 65.0,
      "startedAt": "2025-10-23T10:00:00Z",
      "estimatedCompletion": "2025-10-23T11:30:00Z",
      "createdBy": {
        "id": 1,
        "username": "admin"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**说明**:
- 显示所有历史和当前的生成批次
- 支持按状态和类型过滤
- 用于管理后台查看生成历史

---

#### GET /api/admin/queue/batches/:batchId
获取批次详细信息

**认证**: 必需（Admin权限）

**URL参数**:
- `batchId`: 批次ID

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "batch_abc123",
    "type": "WORD_CONTENT",
    "status": "PROCESSING",
    "totalTasks": 200,
    "completedTasks": 130,
    "failedTasks": 2,
    "progress": 65.0,
    "startedAt": "2025-10-23T10:00:00Z",
    "estimatedCompletion": "2025-10-23T11:30:00Z",
    "createdBy": {
      "id": 1,
      "username": "admin"
    },
    "tasks": [
      {
        "id": "task-12345",
        "status": "completed",
        "targetId": "word_789",
        "target": { "word": "学习" },
        "completedAt": "2025-10-23T10:15:30Z",
        "processingTime": 45000
      },
      {
        "id": "task-12346",
        "status": "active",
        "targetId": "word_790",
        "target": { "word": "中国" },
        "startedAt": "2025-10-23T10:15:35Z",
        "progress": 75
      }
    ],
    "failedTasks": [
      {
        "id": "task-12399",
        "targetId": "word_850",
        "target": { "word": "复杂" },
        "error": "AI API timeout",
        "failedAt": "2025-10-23T10:20:00Z",
        "attempts": 3
      }
    ]
  }
}
```

**说明**:
- 查看批次的完整任务列表
- 包含失败任务的错误信息
- 用于监控和调试批量生成

---

#### POST /api/admin/queue/pause
暂停队列处理

**认证**: 必需（Admin权限）

**请求体**:
```json
{}
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "队列已暂停",
  "data": {
    "status": "paused",
    "pausedAt": "2025-10-23T10:30:00Z",
    "activeJobs": 3 // 当前正在处理的任务数（会继续完成）
  }
}
```

**说明**:
- 暂停队列后，不再处理新任务
- 已经开始的任务会继续完成
- 用于系统维护或紧急暂停

---

#### POST /api/admin/queue/resume
恢复队列处理

**认证**: 必需（Admin权限）

**请求体**:
```json
{}
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "队列已恢复",
  "data": {
    "status": "running",
    "resumedAt": "2025-10-23T10:35:00Z",
    "waitingJobs": 150 // 待处理任务数
  }
}
```

**说明**:
- 恢复队列处理
- 继续处理waiting状态的任务

---

#### POST /api/admin/queue/batches/:batchId/cancel
取消整个批次

**认证**: 必需（Admin权限）

**URL参数**:
- `batchId`: 批次ID

**请求体**:
```json
{
  "reason": "批量任务配置错误" // 可选，取消原因
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "批次已取消",
  "data": {
    "batchId": "batch_abc123",
    "cancelledTasks": 68, // 被取消的任务数
    "completedTasks": 130, // 已完成的任务数（不受影响）
    "failedTasks": 2,
    "cancelledAt": "2025-10-23T10:40:00Z"
  }
}
```

**错误响应** (400 Bad Request):
```json
{
  "success": false,
  "error": "批次已完成，无法取消"
}
```

**说明**:
- 取消批次中所有PENDING和WAITING状态的任务
- 已完成的任务不受影响
- 正在处理的任务会继续完成（无法中断）
- 用于撤销错误的批量生成操作

---

#### DELETE /api/admin/queue/jobs/:jobId
删除/重试单个失败任务

**认证**: 必需（Admin权限）

**URL参数**:
- `jobId`: 任务ID

**查询参数**:
- `action`: `delete` | `retry` (默认: delete)

**响应** (200 OK - delete):
```json
{
  "success": true,
  "message": "任务已删除"
}
```

**响应** (200 OK - retry):
```json
{
  "success": true,
  "message": "任务已重新加入队列",
  "data": {
    "jobId": "task-12399",
    "status": "waiting",
    "attempt": 4
  }
}
```

**说明**:
- delete: 从队列中删除失败的任务
- retry: 重新将失败任务加入队列
- 只能操作failed状态的任务

---

#### POST /api/admin/queue/clean
清理队列中的已完成/失败任务

**认证**: 必需（Admin权限）

**请求体**:
```json
{
  "type": "completed", // completed | failed | all
  "olderThan": 7 // 清理N天前的任务（可选，默认所有）
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "队列清理完成",
  "data": {
    "deletedCount": 8350,
    "type": "completed",
    "olderThan": 7
  }
}
```

**说明**:
- 清理队列中的历史任务记录
- 释放Redis内存空间
- 建议定期执行（如每周一次）
- 不影响数据库中的数据记录

---

## 🔗 相关文档

- [01-数据库设计.md](./01-数据库设计.md) - 数据模型详情
- [03-AI生成系统.md](./03-AI生成系统.md) - AI内容生成逻辑
- [04-任务队列系统.md](./04-任务队列系统.md) - 异步任务处理
