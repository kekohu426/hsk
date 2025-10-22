# 🎯 ChineseMaster - AI驱动的中文学习平台
## 完整产品需求文档 (PRD)

**版本**: V2.0 (重构版本)  
**日期**: 2025年10月18日  
**目标**: 出海产品，面向国外成人中文学习者  

---

## 📋 一、产品概述

### 1.1 核心定位
- **目标用户**: 国外成人中文学习者（主要市场：美国、日本、韩国）
- **核心价值**: AI驱动的智能词汇学习 + HSK系统化 + 沉浸式阅读
- **差异化**: AI自动生成内容 + SEO流量获取 + 个性化学习路径

### 1.2 商业模式
```
Free Tier (广告支持):
  - 每日1篇文章
  - 词库上限100个词
  - 基础学习功能

Premium ($9.99/月):
  - 无限文章访问
  - 无限词库容量
  - AI文本分析无限次
  - 离线模式
  - 无广告

SEO流量策略:
  - 10000+ HSK词汇落地页
  - 每日一文内容页
  - 自然流量 → 注册转化
```

---

## 🎨 二、用户端功能设计

### 2.1 首页 (Home)

**目标**: 个人学习仪表盘，快速启动学习

**功能模块**:
```
┌─────────────────────────────────┐
│  Hi [User], Welcome Back! 👋    │
├─────────────────────────────────┤
│  📊 TODAY'S GOAL                │
│  You have 12 words to review    │
│  [ START LEARNING ] →           │
├─────────────────────────────────┤
│  📖 LATEST ARTICLE              │
│  [Beginner] Weekend Plans       │
│  8 new words • 5 min read       │
│  [ READ NOW ] →                 │
├─────────────────────────────────┤
│  📈 YOUR PROGRESS               │
│  • 350 Words Mastered           │
│  • 7 Days Streak 🔥             │
│  • HSK 2 Level                  │
└─────────────────────────────────┘
```

**API接口**:
- `GET /api/user/dashboard` - 获取仪表盘数据
- `GET /api/user/stats` - 获取学习统计

---

### 2.2 每日一文 (Daily Articles)

**目标**: 通过阅读真实语境学习词汇

**核心功能**:
1. **文章列表页**
   - 难度筛选 (Beginner/Intermediate/Advanced)
   - 卡片式布局，显示：标题、难度、新词数、阅读时间
   
2. **文章详情页**
   ```
   ┌─────────────────────────────────┐
   │  [Audio Player] 🔊 1.0x         │
   │  我的周末计划 (My Weekend Plans) │
   │  Beginner • 8 new words         │
   ├─────────────────────────────────┤
   │  这个周末我打算去爬山...         │
   │  [Show English] ▼               │
   │                                 │
   │  点击任意词汇 → 右侧弹出词卡     │
   ├─────────────────────────────────┤
   │  📝 New Words in This Article   │
   │  • 周末 zhōumò (weekend)        │
   │  • 打算 dǎsuàn (plan to)        │
   │  [ ADD ALL TO WORD BANK ]       │
   ├─────────────────────────────────┤
   │  ❓ Reading Quiz                │
   │  1. 作者周末打算做什么？         │
   │     (A) 看电影 (B) 爬山 (C) 学习│
   └─────────────────────────────────┘
   ```

3. **点击查词功能**
   - 点击文章中任意词汇 → 右侧滑出精简词卡
   - 显示：单词、拼音、发音按钮、核心释义、例句
   - 操作：[添加到词库] [查看完整详情]

**API接口**:
- `GET /api/articles?level=beginner&page=1` - 文章列表
- `GET /api/articles/:id` - 文章详情
- `POST /api/articles/:id/view` - 增加阅读计数
- `POST /api/user/words` - 添加词汇到词库

**SEO优化**:
- URL: `/articles/my-weekend-plans-chinese-learning`
- Meta Title: "我的周末计划 - Learn Chinese Through Reading | ChineseMaster"
- Meta Description: "Read authentic Chinese article about weekend plans. Learn 8 HSK 2 vocabulary words with pinyin, audio, and translation."
- Schema.org: Article markup

---

### 2.3 文本分析器 (Text Analyzer)

**目标**: 将任意中文文本转化为学习材料

**工作流程**:
```
1. 用户粘贴文本 (最多1000字)
   ↓
2. 点击"Analyze Text"
   ↓
3. 后端使用 node-jieba 分词
   ↓
4. 对比用户词库，识别未知词
   ↓
5. 查询HSK数据库，获取词汇详情
   ↓
6. 返回结果：
   - 原文高亮显示生词
   - 右侧生词列表（按HSK级别排序）
   - 每个词可点击查看详情
   - 支持批量添加到词库
```

**界面设计**:
```
┌──────────────────┬──────────────┐
│  Input Area      │  Results     │
│  [Paste text]    │  📊 Analysis │
│                  │              │
│  这个周末我打算   │  Found:      │
│  去爬山...       │  • 5 new words│
│                  │  • HSK 2-3   │
│  [ANALYZE]       │              │
│                  │  Word List:  │
├──────────────────┤  1. 周末     │
│  Analyzed Text:  │  2. 打算     │
│  这个周末我打算   │  3. 爬山     │
│  去爬山...       │              │
│  (生词高亮显示)   │  [ADD ALL]   │
└──────────────────┴──────────────┘
```

**API接口**:
- `POST /api/text/analyze` - 分析文本
  ```json
  Request: { "text": "这个周末我打算去爬山" }
  Response: {
    "segmented": ["这个", "周末", "我", "打算", "去", "爬山"],
    "newWords": [
      { "word": "周末", "pinyin": "zhōumò", "hsk": 2, ... }
    ],
    "knownWords": [...],
    "difficulty": "HSK 2-3"
  }
  ```

---

### 2.4 学习中心 (Learn Center)

**定位**: 间隔重复记忆引擎（参考Anki）

**学习流程**:
```
用户点击"开始学习"
  ↓
系统智能选择10个词汇:
  - 优先级1: 今日到期复习的词
  - 优先级2: "学习中"状态的词
  - 优先级3: "新增"状态的词
  ↓
进入学习会话 (Session)
  ↓
逐个展示闪卡 (Flashcard)
```

**闪卡设计** (双卡系统):
```
【正面 - 先思考】
┌─────────────────────┐
│                     │
│      热情           │  ← 大字，清晰
│    rè qíng          │
│   🔊 [Play]         │
│                     │
│  [Show Answer]      │  ← 点击翻转
└─────────────────────┘

【背面 - 查看答案】
┌─────────────────────┐
│   热情 (rè qíng)     │
│  enthusiasm; passion│
│                     │
│  例: 他对工作充满热情。│
│  He is passionate   │
│  about his work.    │
│                     │
│  💡 记忆技巧:        │
│  热(hot)+情(emotion)│
│                     │
│  How well did you   │
│  remember this?     │
│  [😣Again] [😐Hard] │
│  [😊Good] [🎉Easy]  │
└─────────────────────┘
```

**评分系统** (SuperMemo SM-2算法):
- **Again (再来一次)**: 完全不记得 → 重置间隔，今天内再次复习
- **Hard (困难)**: 勉强记得 → 间隔×1.2
- **Good (良好)**: 正确回忆 → 间隔×2.5
- **Easy (简单)**: 轻松回忆 → 间隔×3.0

**学习统计**:
```
Today's Session
━━━━━━━━━░░  8/10

• 3 words mastered 🎉
• 5 words need review
• 2 new words learned

[Continue] [End Session]
```

**API接口**:
- `GET /api/learn/due-words?limit=10` - 获取待复习词汇
- `POST /api/learn/review` - 提交复习结果
  ```json
  {
    "wordId": "uuid",
    "quality": 4,  // 0-5评分
    "timeSpent": 5000  // 毫秒
  }
  ```

---

### 2.5 我的词库 (Word Bank)

**定位**: 个人词汇资产管理器

**状态系统**:
```
新增 (New) → 学习中 (Learning) → 已掌握 (Mastered)
   ↑                                      ↓
   └──────── 唤醒复习 (V2+) ───────────────┘
```

**界面布局**:
```
┌─────────────────────────────────────┐
│  [New: 5] [Learning: 12] [Mastered: 30] [Favorites] │
├─────────────────────────────────────┤
│  You have 5 new words to learn!    │
│  [ START LEARNING ] →               │
├──────────────────┬──────────────────┤
│  Word List       │  Word Details    │
│  ────────────    │  ─────────────   │
│  ☐ 热情 rèqíng   │  热情 (rè qíng)  │
│  ☐ 学习 xuéxí    │  enthusiasm      │
│  ☐ 努力 nǔlì     │                  │
│                  │  🔊 [Play]       │
│  [HSK ▼] [⚙]    │                  │
│                  │  例句1...        │
│  [ Add Words ]   │  例句2...        │
│                  │                  │
│                  │  [Move to...▼]   │
│                  │  [⭐ Favorite]   │
│                  │  [🗑 Delete]     │
└──────────────────┴──────────────────┘
```

**核心功能**:
1. **状态筛选**: 按"新增/学习中/已掌握/收藏"查看
2. **HSK筛选**: 按HSK级别筛选
3. **搜索**: 按汉字/拼音/英文搜索
4. **批量操作**: 批量移动状态/删除
5. **学习触发**: "新增"列表顶部显示"开始学习"按钮

**API接口**:
- `GET /api/user/words?status=new&hsk=2` - 获取词库列表
- `PATCH /api/user/words/:id` - 更新词汇状态
- `DELETE /api/user/words/:id` - 删除词汇
- `POST /api/user/words/batch` - 批量操作

---

### 2.6 HSK词库 (HSK Library)

**目标**: SEO流量入口 + 系统化学习路径

**层级结构**:
```
/hsk
  /level1 (150词)
  /level2 (300词)
  /level3 (600词)
  /level4 (1200词)
  /level5 (2500词)
  /level6 (5000词)
```

**列表页** (`/hsk/level2`):
```
┌─────────────────────────────────────┐
│  HSK Level 2 - 300 Essential Words  │
│  Master these words to pass HSK 2   │
├─────────────────────────────────────┤
│  [Search: 搜索词汇...]              │
│  Progress: 45/300 words in your bank│
├─────────────────────────────────────┤
│  Grid View:                         │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │学习  │ │热情  │ │努力  │       │
│  │xuéxí │ │rèqíng│ │nǔlì  │       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  [ ADD ALL TO WORD BANK ]           │
└─────────────────────────────────────┘
```

**词汇详情页** (`/hsk/level2/xue-xi`):
- 完整的SEO优化页面（见前面的HTML示例）
- 静态HTML生成，极快加载速度
- 丰富内容：拼音、释义、例句、汉字拆解、相关词、FAQ

**批量添加功能**:
```
点击"ADD ALL TO WORD BANK"
  ↓
弹窗提示：
┌─────────────────────────────────┐
│  Add 300 words to your bank?    │
│                                 │
│  Recommended:                   │
│  ○ Add 20 words now             │
│  ○ Add all 300 words            │
│                                 │
│  [Cancel] [Add Selected]        │
└─────────────────────────────────┘
```

**API接口**:
- `GET /api/hsk/levels` - 获取所有级别
- `GET /api/hsk/level/:level/words` - 获取指定级别词汇
- `GET /api/hsk/words/:slug` - 获取词汇详情（用于SSG）

---

### 2.7 用户中心 (Profile)

**功能模块**:
1. **个人信息**
   - 头像、用户名、邮箱
   - 修改密码
   
2. **学习统计**
   ```
   📊 Your Learning Stats
   ─────────────────────
   • Words Mastered: 350
   • Total Study Time: 25h 30m
   • Study Streak: 7 days 🔥
   • HSK Level: 2 (In Progress)
   
   [Chart: Weekly Progress]
   ```

3. **设置**
   - 界面语言 (English/日本語/한국어)
   - 音频设置
   - 通知偏好
   - 隐私设置

4. **订阅管理** (V2)
   - 当前计划：Free / Premium
   - 升级选项
   - 账单历史

**API接口**:
- `GET /api/user/profile` - 获取个人信息
- `PATCH /api/user/profile` - 更新个人信息
- `GET /api/user/stats` - 获取学习统计

---

## 🛠️ 三、管理端功能设计

### 3.1 登录与权限

**登录界面**:
```
┌─────────────────────────┐
│   ChineseMaster Admin   │
│                         │
│   Email:    [________]  │
│   Password: [________]  │
│                         │
│   [ LOGIN ]             │
└─────────────────────────┘
```

**权限系统** (V1):
- 单一管理员角色
- V2扩展：内容编辑、运营、超级管理员

---

### 3.2 仪表盘 (Dashboard)

**数据概览**:
```
┌─────────────────────────────────────┐
│  Welcome, Admin! 👋                 │
├─────────────────────────────────────┤
│  📊 Quick Stats                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ │
│  │ Users  │ │Articles│ │  Words │ │
│  │ 1,234  │ │  156   │ │ 5,420  │ │
│  │ +12%   │ │  +8    │ │  +120  │ │
│  └────────┘ └────────┘ └────────┘ │
├─────────────────────────────────────┤
│  📈 This Week's Growth              │
│  [Chart: Article Views]             │
├─────────────────────────────────────┤
│  📝 Recent Activities               │
│  • User "Alice" mastered 10 words   │
│  • Article "Weekend Plans" published│
│  • 50 new user registrations        │
└─────────────────────────────────────┘
```

---

### 3.3 AI文章生成器 ⭐核心功能

**界面设计**:
```
┌─────────────────────────────────────┐
│  📝 Daily Article AI Generator      │
├─────────────────────────────────────┤
│  Step 1: Input Topic                │
│  ┌─────────────────────────────┐   │
│  │ Topic/Keywords:             │   │
│  │ [Weekend activities, hiking]│   │
│  │                             │   │
│  │ Or paste English reference: │   │
│  │ [Text area...]              │   │
│  └─────────────────────────────┘   │
│                                     │
│  Step 2: Configure Settings         │
│  • Difficulty: ○ Beginner ● Intermediate ○ Advanced │
│  • Length: [300] characters         │
│  • AI Model: [GLM-4 ▼]             │
│                                     │
│  [ GENERATE WITH AI ] 🤖            │
├─────────────────────────────────────┤
│  Step 3: Preview & Edit             │
│  Generated Content:                 │
│  ┌─────────────────────────────┐   │
│  │ 我的周末计划                 │   │
│  │                             │   │
│  │ 这个周末我打算去爬山...      │   │
│  │ [Rich Text Editor]          │   │
│  └─────────────────────────────┘   │
│                                     │
│  Extracted New Words:               │
│  • 周末 (zhōumò) - weekend         │
│  • 打算 (dǎsuàn) - plan to         │
│  • 爬山 (páshān) - hiking          │
│                                     │
│  Generated Quiz:                    │
│  1. 作者周末打算做什么？            │
│     A) 看电影 B) 爬山 C) 学习      │
│                                     │
│  Step 4: SEO Optimization           │
│  • URL Slug: [weekend-plans]       │
│  • Meta Title: [Auto-generated]    │
│  • Meta Description: [Edit...]     │
│                                     │
│  [ SAVE AS DRAFT ] [ PUBLISH ]      │
└─────────────────────────────────────┘
```

**AI Prompt设计** (后端自动构建):
```javascript
const articlePrompt = `
You are a Chinese language teacher creating learning content.

Task: Generate a beginner-level Chinese reading article.

Topic: ${userTopic}
Difficulty: Beginner (HSK 1-2 vocabulary)
Length: 300 characters

Requirements:
1. Write a natural, engaging Chinese article about the topic
2. Use simple grammar structures suitable for beginners
3. Include 6-8 HSK 1-2 level new vocabulary words
4. Provide pinyin and English translation for each paragraph
5. Extract the key vocabulary with pinyin and English meanings
6. Create 2 multiple-choice comprehension questions

Output format (JSON):
{
  "title": "Chinese title",
  "titleEn": "English title",
  "content": [
    {"cn": "段落1", "en": "Paragraph 1", "pinyin": "..."}
  ],
  "newWords": [
    {"word": "周末", "pinyin": "zhōumò", "meaning": "weekend", "hsk": 2}
  ],
  "quiz": [
    {"question": "...", "options": ["A", "B", "C"], "answer": 1}
  ]
}
`;
```

**API接口**:
- `POST /api/admin/articles/generate` - AI生成文章
- `POST /api/admin/articles` - 保存/发布文章
- `GET /api/admin/ai/models` - 获取可用AI模型

---

### 3.4 HSK词汇页面生成器 ⭐SEO核心

**批量生成界面**:
```
┌─────────────────────────────────────┐
│  📚 HSK Vocabulary Page Generator   │
├─────────────────────────────────────┤
│  Step 1: Input Words                │
│  ┌─────────────────────────────┐   │
│  │ Enter Chinese words:        │   │
│  │ 学习                        │   │
│  │ 热情                        │   │
│  │ 努力                        │   │
│  │ (one per line)              │   │
│  └─────────────────────────────┘   │
│                                     │
│  HSK Level: [2 ▼]                  │
│  AI Model: [GLM-4 ▼]               │
│                                     │
│  Step 2: Select Content Modules     │
│  ☑ Pinyin & Core Definition         │
│  ☑ Example Sentences (5)            │
│  ☑ Character Breakdown              │
│  ☑ Related Words                    │
│  ☑ Common Collocations              │
│  ☑ FAQ (SEO-optimized)              │
│                                     │
│  [ GENERATE PAGES ] 🤖              │
├─────────────────────────────────────┤
│  Step 3: Review Generated Pages     │
│  ┌─────────────────────────────┐   │
│  │ 1/3: 学习 (xuéxí)           │   │
│  │ ───────────────────────────  │   │
│  │ to learn; to study          │   │
│  │                             │   │
│  │ 5 Example Sentences ✓       │   │
│  │ Character Breakdown ✓       │   │
│  │ 3 FAQs ✓                    │   │
│  │                             │   │
│  │ SEO Score: 85/100 🟢        │   │
│  │                             │   │
│  │ [< Prev] [Edit] [Next >]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  [ PUBLISH ALL (3) ] [ SAVE DRAFT ] │
└─────────────────────────────────────┘
```

**AI Prompt优化**:
```javascript
const vocabPrompt = `
Create comprehensive, SEO-optimized content for the Chinese word: ${word}

Requirements:
1. Generate 5 example sentences:
   - Vary difficulty (beginner to advanced)
   - Cover different contexts
   - Include both spoken and written styles
   
2. Character breakdown:
   - Pinyin and meaning for each character
   - Etymology and historical evolution
   - Radical analysis
   
3. Related vocabulary:
   - 3 synonyms
   - 3 common collocations
   - 2 antonyms (if applicable)
   
4. FAQ section (critical for SEO):
   - "How to pronounce ${word}?"
   - "What's the difference between ${word} and [similar word]?"
   - "How to use ${word} in a sentence?"
   - "What HSK level is ${word}?"
   - Generate 2 more unique questions
   
Output JSON format: {...}
`;
```

**发布后触发** (Webhook):
```javascript
// 保存到数据库后，自动触发Vercel重新构建
async function publishWord(wordData) {
  await db.hskWords.create(wordData);
  
  // 触发Vercel构建
  await fetch('https://api.vercel.com/v1/integrations/deploy/...', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${VERCEL_TOKEN}` }
  });
  
  // 5分钟后，静态HTML页面上线
  return { status: 'published', url: `/hsk/level2/${wordData.slug}` };
}
```

---

### 3.5 文章管理

**列表页**:
```
┌─────────────────────────────────────┐
│  📝 Article Management              │
│  [+ New Article] [Filters ▼]       │
├──┬────────────┬────────┬──────┬────┤
│▢ │Title      │Difficulty│Status│Actions│
├──┼────────────┼────────┼──────┼────┤
│☐ │Weekend    │Beginner │✓Pub  │Edit│
│☐ │Shopping   │Beginner │✓Pub  │Edit│
│☐ │Tea Culture│Inter.   │Draft │Edit│
└──┴────────────┴────────┴──────┴────┘
Showing 1-20 of 156 articles
```

**编辑页**:
- 富文本编辑器
- 实时预览
- SEO元数据编辑
- 词汇高亮标记

---

### 3.6 词汇管理

**功能**:
- 搜索/筛选词汇
- 编辑词汇详情
- 批量导入（CSV/JSON）
- 发布/下线词汇页面

---

### 3.7 用户管理

**功能**:
- 用户列表（搜索/筛选）
- 查看用户学习数据
- 禁用/启用账户
- 导出用户报告

---

### 3.8 AI配置管理 ⭐创新功能

**界面**:
```
┌─────────────────────────────────────┐
│  🤖 AI Model Configuration          │
├─────────────────────────────────────┤
│  Available Models:                  │
│  ○ GLM-4 (智谱AI)                   │
│    API Key: [***************]  [Test]│
│    Cost: ¥0.03/1K tokens           │
│    Speed: ⚡⚡⚡                     │
│                                     │
│  ○ GLM-4-Flash                      │
│    API Key: [Not configured]       │
│    Cost: ¥0.01/1K tokens           │
│    Speed: ⚡⚡⚡⚡                    │
│                                     │
│  ○ GPT-3.5-Turbo (OpenAI)          │
│    API Key: [Optional]             │
│    Cost: $0.002/1K tokens          │
│    Speed: ⚡⚡⚡                     │
│                                     │
│  Default Model: [GLM-4 ▼]          │
│  Fallback Model: [GLM-4-Flash ▼]   │
│                                     │
│  [ SAVE CONFIGURATION ]             │
├─────────────────────────────────────┤
│  Usage Statistics (This Month):     │
│  • Tokens Used: 2.5M               │
│  • Articles Generated: 45          │
│  • Vocabulary Pages: 120           │
│  • Estimated Cost: ¥75             │
└─────────────────────────────────────┘
```

---

## 🏗️ 四、技术架构设计

### 4.1 整体架构

```
┌──────────────────────────────────────────────┐
│          用户端 (Next.js 14 SSG)              │
│  • /hsk/level1/ni-hao (静态HTML, Vercel托管) │
│  • /articles/* (ISR增量静态生成)             │
│  • /learn (客户端渲染)                       │
└────────────────┬─────────────────────────────┘
                 │ REST API
                 ↓
┌──────────────────────────────────────────────┐
│      后端API (Node.js + Express)             │
│  • JWT认证                                   │
│  • RESTful API                               │
│  • node-jieba分词                            │
│  • GLM AI集成                                │
│  Railway部署 (免费$5/月)                     │
└────────────────┬─────────────────────────────┘
                 │
         ┌───────┴────────┐
         ↓                ↓
┌────────────────┐ ┌─────────────┐
│  PostgreSQL    │ │  Redis      │
│  (Railway)     │ │  (Upstash)  │
│  • 用户数据    │ │  • Session  │
│  • 词汇库      │ │  • Cache    │
│  • 文章内容    │ │             │
└────────────────┘ └─────────────┘
         ↓
┌──────────────────────────────────────────────┐
│       管理后台 (React + Vite)                │
│  • AI生成器                                  │
│  • 内容管理                                  │
│  • 数据分析                                  │
│  Vercel部署                                  │
└──────────────────────────────────────────────┘
```

### 4.2 数据库Schema (PostgreSQL)

详见下方Prisma Schema定义

### 4.3 技术栈

**前端**:
- Next.js 14 (App Router + SSG)
- React 18
- Tailwind CSS + shadcn/ui
- Zustand (状态管理)
- React Query (数据获取)

**后端**:
- Node.js 20+
- Express.js
- Prisma ORM
- node-jieba (中文分词)
- JWT + bcrypt (认证)

**数据库**:
- PostgreSQL 15
- Redis (缓存)

**AI服务**:
- 智谱AI GLM-4 (主力)
- 可配置OpenAI/Claude

**部署**:
- 前端: Vercel (SSG + ISR)
- 后端: Railway
- 数据库: Railway PostgreSQL
- CDN: Vercel Edge Network

---

## 📊 五、SEO策略详解

### 5.1 内容SEO

**HSK词汇页面优化**:
- ✅ 10000+独立落地页
- ✅ 每页1500-2000字原创内容
- ✅ FAQ捕获长尾搜索
- ✅ Schema.org结构化数据
- ✅ 内部链接网络
- ✅ 多语言版本

**目标关键词**:
```
Primary: 
- "学习 chinese meaning"
- "xue xi pronunciation"
- "HSK 2 vocabulary"

Long-tail:
- "how to pronounce 学习"
- "difference between 学习 and 学"
- "学习 example sentences"
```

### 5.2 技术SEO

**URL结构**:
```
✅ /hsk/level2/xue-xi
❌ /word?id=123
```

**元数据模板**:
```html
<title>{word} ({pinyin}) - {meaning} | HSK {level} Chinese Word</title>
<meta name="description" content="Master {word} ({pinyin}) meaning '{meaning}'. Complete guide with pronunciation, examples, character breakdown. HSK {level} vocabulary.">
```

**Sitemap生成**:
- 自动生成XML sitemap
- 分级sitemap (HSK 1-6)
- 每日更新文章sitemap
- 提交到Google Search Console

### 5.3 性能优化

**目标指标**:
- Lighthouse Score: 95+
- LCP (最大内容绘制): < 2.5s
- FID (首次输入延迟): < 100ms
- CLS (累积布局偏移): < 0.1

**优化措施**:
- 静态HTML预渲染
- 图片懒加载 + WebP格式
- 关键CSS内联
- CDN全球加速
- Gzip/Brotli压缩

---

## 🎯 六、核心API接口文档

### 6.1 认证接口

```
POST /api/auth/register
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "username": "Alice"
}
Response:
{
  "user": { "id": "...", "email": "...", "username": "..." },
  "token": "eyJhbGc..."
}

POST /api/auth/login
Request:
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
{
  "user": {...},
  "token": "eyJhbGc..."
}

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response:
{
  "user": {...}
}
```

### 6.2 词汇接口

```
GET /api/words/:slug
GET /api/words?level=2&page=1
POST /api/user/words
PATCH /api/user/words/:id
DELETE /api/user/words/:id
GET /api/user/words?status=new
```

### 6.3 文章接口

```
GET /api/articles?level=beginner&page=1
GET /api/articles/:id
POST /api/articles/:id/view
```

### 6.4 学习接口

```
GET /api/learn/due-words?limit=10
POST /api/learn/review
{
  "wordId": "uuid",
  "quality": 4,
  "timeSpent": 5000
}
```

### 6.5 管理端接口

```
POST /api/admin/articles/generate
POST /api/admin/words/generate
POST /api/admin/trigger-build
GET /api/admin/stats
```

---

## 💰 七、成本预估

| 服务 | 方案 | 月成本 |
|------|------|--------|
| 前端托管 | Vercel | $0 |
| 后端API | Railway | $0-5 |
| 数据库 | Railway PG | $0 |
| Redis | Upstash | $0 |
| AI调用 | GLM-4 | ¥30-100 |
| CDN | Vercel | $0 |
| **总计** | | **$5-15/月** |

---

## 📈 八、发展路线图

### V1 (当前版本) - MVP
- ✅ 核心学习功能
- ✅ AI内容生成
- ✅ SEO优化
- ✅ 基础数据统计

### V2 (3个月后)
- [ ] 高级SRS算法
- [ ] 社区功能（讨论区）
- [ ] 移动端App
- [ ] 订阅付费系统

### V3 (6个月后)
- [ ] AI语音对话
- [ ] 视频课程
- [ ] 证书系统
- [ ] 多语言界面

---

## 🎯 九、成功指标 (KPI)

**用户增长**:
- 月活用户 (MAU): 10,000+
- 注册转化率: 15%+
- 付费转化率: 5%+

**SEO效果**:
- 自然搜索流量: 50,000+ visits/月
- 关键词排名: Top 10位 100+
- 页面索引: 10,000+

**学习效果**:
- 词汇掌握率: 70%+
- 日均学习时长: 15分钟
- 连续学习天数: 7天+

---

**文档版本**: V2.0  
**最后更新**: 2025年10月18日  
**状态**: ✅ 已确认，开始实施






