# 数据库字段映射问题 - 完整审查报告

## 执行日期
2025-10-20

## 问题概述
通过系统性检查所有控制器和 Prisma Schema，发现多处前端API请求、后端控制器和数据库字段之间的映射不一致问题。

---

## 🐛 已发现的字段映射问题

### 1. ✅ AIConfig 模型 (已修复)

**数据库字段 (schema.prisma:209)**:
```prisma
model AIConfig {
  modelName     String   @unique
  // ...
}
```

**问题**: 
- 前端使用 `model` 字段
- 后端控制器直接使用 `model` 更新数据库
- Prisma 找不到 `model` 字段

**修复** (`adminController.js`):
```javascript
// getAIConfig: 映射 modelName → model
const safeConfigs = configs.map(config => ({
  ...config,
  model: config.modelName,  // 添加映射
  apiKey: config.apiKey ? '***' + config.apiKey.slice(-4) : ''
}));

// updateAIConfig: 映射 model → modelName
data: { 
  modelName: model,  // 添加映射
  apiKey 
}
```

---

### 2. ⚠️ ArticleView 模型 - 字段不一致

**数据库字段 (schema.prisma:168-184)**:
```prisma
model ArticleView {
  id            String   @id @default(uuid())
  userId        String?
  articleId     String
  
  readProgress  Int      @default(0)  // ← 注意这个字段名
  completedQuiz Boolean  @default(false)
  quizScore     Int?
  
  createdAt     DateTime @default(now())
  // ...
}
```

**问题 1** (`articleController.js:87-92`):
- 代码尝试查询 `progress`, `completedAt`, `viewedAt` 字段
- 但数据库中是 `readProgress`, `createdAt`（没有 `completedAt` 和 `viewedAt`）

```javascript
// ❌ 错误的查询
select: {
  progress: true,      // 数据库中是 readProgress
  completedAt: true,   // 数据库中没有此字段
  viewedAt: true       // 数据库中没有此字段
}
```

**问题 2** (`articleController.js:164-178`):
- 使用不存在的字段更新

```javascript
// ❌ 错误的更新
create: {
  progress: readProgress || 0,  // 应该是 readProgress
  // ...
},
update: {
  progress: readProgress,       // 应该是 readProgress
  completedAt: new Date(),      // 数据库中没有此字段
  viewedAt: new Date(),         // 数据库中没有此字段
  // ...
}
```

**需要修复**:
- 选项 A: 修改代码使用正确的字段名（readProgress）
- 选项 B: 修改数据库 schema 添加缺失字段（completedAt, viewedAt）并重命名 readProgress → progress

---

### 3. ⚠️ Article 模型 - 前端期望字段不匹配

**数据库字段 (schema.prisma:121-165)**:
```prisma
model Article {
  title             String
  titleEn           String?
  slug              String   @unique
  content           String   // JSON
  excerpt           String
  level             String   // "BEGINNER", "INTERMEDIATE", "ADVANCED"
  hskLevel          String?
  readTime          Int
  wordCount         Int
  newWords          String   // JSON
  quiz              String?  // JSON
  status            String   @default("DRAFT")  // "DRAFT", "PUBLISHED", "ARCHIVED"
  viewCount         Int      @default(0)
  // ...
}
```

**前端期望 (admin/src/types/index.ts:27-40)**:
```typescript
export interface Article {
  id: string;
  title: string;
  slug: string;
  chineseContent: string;     // ← 数据库中是 content
  pinyinContent?: string;     // ← 数据库中没有
  englishTranslation?: string; // ← 数据库中没有
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';  // ← 数据库是 level
  newWords?: any[];
  quiz?: any[];
  views: number;              // ← 数据库中是 viewCount
  status: 'draft' | 'published'; // ← 大小写不一致
  createdAt: string;
}
```

**问题**:
- `chineseContent` vs `content`
- `difficulty` vs `level`
- `views` vs `viewCount`
- `status` 大小写不一致 ('draft' vs 'DRAFT')
- 缺少 `pinyinContent` 和 `englishTranslation` 字段（但这可能是JSON的一部分）

**需要修复**:
- 选项 A: 在后端响应时映射字段
- 选项 B: 修改前端 TypeScript 定义匹配数据库

---

### 4. ⚠️ Word 模型 - 查询条件问题

**数据库字段 (schema.prisma:69-70)**:
```prisma
isPublished       Boolean  @default(false)
publishedAt       DateTime?
```

**问题** (`wordController.js:70-71`):
```javascript
// ❌ 错误：where 条件中混用了两个字段
const word = await prisma.word.findUnique({
  where: { id, isPublished: true }  // findUnique 只能用 id 或 unique 字段
});
```

**正确做法**:
```javascript
const word = await prisma.word.findFirst({
  where: { id, isPublished: true }
});
// 或
const word = await prisma.word.findUnique({ where: { id } });
if (!word || !word.isPublished) {
  throw new AppError('Word not found', 404);
}
```

**需要修复**:
- `wordController.js:70` 和 `wordController.js:110` 的 findUnique 调用

---

### 5. ⚠️ 统计字段不一致

**前端期望 (admin/src/types/index.ts:50-58)**:
```typescript
export interface Stats {
  totalUsers: number;
  totalArticles: number;
  totalWords: number;
  todayActive: number;        // ← 注意字段名
  weeklyArticles: any[];
  userGrowth: any[];
  recentActivity: any[];
}
```

**后端返回 (adminController.js:21-27)**:
```javascript
res.json({
  totalUsers,
  totalArticles,
  totalWords,
  activeUsersToday: todayActive,  // ← 字段名不一致
  recentActivity: []
});
```

**问题**:
- 后端返回 `activeUsersToday`，前端期望 `todayActive`
- 缺少 `weeklyArticles` 和 `userGrowth`

**需要修复**:
- 统一字段名为 `todayActive` 或 `activeUsersToday`
- 实现 `weeklyArticles` 和 `userGrowth` 统计

---

## 📋 修复优先级

### 🔴 高优先级 (影响功能)
1. ✅ **AIConfig.modelName** - 已修复
2. **ArticleView 字段** - 导致文章阅读进度无法正确保存和查询
3. **Word.findUnique 查询错误** - 可能导致500错误

### 🟡 中优先级 (影响体验)
4. **Article 字段映射** - 前端显示可能出错
5. **Stats 字段名不一致** - 统计数据显示不完整

### 🟢 低优先级 (可选优化)
6. 补充缺失的统计功能 (`weeklyArticles`, `userGrowth`)

---

## 🔧 推荐修复策略

### 策略 1: 修复后端控制器（推荐）
**优点**: 
- 不需要修改数据库 schema
- 不需要迁移数据
- 改动范围小

**缺点**:
- 需要在每个控制器方法中添加字段映射

### 策略 2: 修改数据库 schema
**优点**:
- 代码更清晰，字段名统一
- 长期维护更容易

**缺点**:
- 需要数据库迁移
- 可能影响生产环境
- 需要同步更新所有相关代码

---

## 📝 下一步行动

1. [x] 修复 AIConfig.modelName 映射问题
2. [ ] 修复 ArticleView 字段映射
3. [ ] 修复 Word.findUnique 查询错误
4. [ ] 修复 Article 字段映射
5. [ ] 统一 Stats 字段名
6. [ ] 添加自动化测试验证字段映射

---

## 🧪 测试建议

为每个修复创建测试用例：
```javascript
describe('Field Mapping Tests', () => {
  it('should correctly map modelName to model in AIConfig', async () => {
    // 测试 getAIConfig 返回的字段
  });
  
  it('should correctly save article reading progress', async () => {
    // 测试 ArticleView 的 readProgress 字段
  });
  
  // ... 更多测试
});
```

---

**审查完成**: 2025-10-20  
**审查人**: AI Assistant  
**状态**: 1个已修复，4个待修复

