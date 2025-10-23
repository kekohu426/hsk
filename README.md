# ChineseMaster UI Demo

这是 ChineseMaster 重新设计方案的静态 HTML/CSS/JavaScript 演示。

## 📁 文件结构

```
uidemo/
├── index.html              # 首页/Landing Page
├── dashboard.html          # 主仪表盘
├── onboarding.html         # 新手引导流程
├── hsk-library.html        # HSK词库页面
├── word-detail.html        # 词条详情页
├── styles.css              # 全局样式（新设计系统）
├── mock-data.js            # 静态模拟数据
├── app.js                  # 交互逻辑
└── README.md               # 本文件
```

## 🚀 快速开始

### 方法1：直接打开（推荐）

1. 在文件管理器中找到 `uidemo` 文件夹
2. 双击 `index.html` 即可在浏览器中打开
3. 点击页面上的链接浏览不同页面

### 方法2：本地服务器（更好的体验）

```bash
cd uidemo

# 使用 Python 启动简单服务器
python3 -m http.server 8080

# 或使用 Node.js
npx serve

# 然后在浏览器访问
http://localhost:8080
```

## 📄 页面说明

### 1. 首页 (index.html)
**展示内容：**
- ✅ 新的 Hero 区设计（目标导向文案）
- ✅ 社会证明（用户头像墙、评价）
- ✅ 互动 Demo 小部件（文本分析器）
- ✅ Why ChineseMaster vs Duolingo 对比
- ✅ 功能展示卡片
- ✅ 用户评价 Testimonials
- ✅ CTA 行动召唤

**新设计亮点：**
- 从"Learn Chinese"改为"Pass HSK 6 in 180 Days"（具体目标）
- 添加 12,847+ 学生的社会证明
- 实时文本分析互动体验
- 明确的价值主张对比

### 2. Dashboard (dashboard.html)
**展示内容：**
- ✅ 考试倒计时卡片（带进度环）
- ✅ 每日任务系统（3个任务 + 进度条）
- ✅ 学习路径可视化（技能树）
- ✅ 快速操作卡片
- ✅ 成就徽章系统（带动画）
- ✅ 最近添加的词汇

**新设计亮点：**
- 顶部显示"87天倒计时"和"64%准备度"
- 每日任务带XP奖励系统
- 可视化的HSK学习路径（1→2→3→4）
- 游戏化成就系统（Common/Rare/Epic/Legendary）

### 3. Onboarding (onboarding.html)
**展示内容：**
- ✅ 4步引导流程（进度条）
- ✅ Step 1: 目标设定（HSK考试/职业/旅游/兴趣）
- ✅ Step 2: 等级评估（快速测验）
- ✅ Step 3: 个性化设置（学习时间/风格/通知）
- ✅ Step 4: 首次成就（学习5个词 + 解锁徽章）

**新设计亮点：**
- 零摩擦入门，每步不超过1分钟
- HSK考试专属选项（等级+日期）
- 即时反馈和鼓励
- 首次成就带动画效果

### 4. HSK Library (hsk-library.html)
**展示内容：**
- ✅ 个性化推荐区（继续学习HSK 3）
- ✅ 跨等级进度可视化
- ✅ 6个HSK等级卡片
- ✅ 解锁机制（完成HSK 3才能学HSK 4）
- ✅ 进度百分比和词汇数统计

**新设计亮点：**
- "Recommended for you"置顶
- 所有等级进度一目了然
- 渐变色区分不同等级
- 锁定状态清晰提示

### 5. Word Detail (word-detail.html)
**展示内容：**
- ✅ Sticky 快速参考栏（始终可见）
- ✅ 三个Tab：Quick Learn / Deep Dive / Practice
- ✅ Quick Learn: 要点+例句+常见错误+快测
- ✅ Deep Dive: 850+字深度内容+目录导航
- ✅ Practice: 写作练习+发音检测

**新设计亮点：**
- 渐进式信息披露（不overwhelming）
- Quick Learn 3分钟速览
- Deep Dive 按需加载
- 互动练习工具

## 🎨 设计系统

### 色彩系统
```css
/* 品牌色 - 现代中国风 */
--brand-red: #DC143C    /* 朱红 */
--brand-ink: #1C1C1C    /* 墨黑 */
--brand-jade: #00A86B   /* 翠玉 */

/* HSK等级色 */
--hsk-1: #93C5FD  /* 天蓝 */
--hsk-2: #86EFAC  /* 浅绿 */
--hsk-3: #FDE047  /* 明黄 */
--hsk-4: #FDBA74  /* 橙色 */
--hsk-5: #F87171  /* 浅红 */
--hsk-6: #C084FC  /* 紫色 */
```

### 字体系统
- 英文：Inter
- 中文：Noto Sans SC
- 代码：Fira Code

### 组件库
- ✅ Button (6种变体)
- ✅ Card (多种样式)
- ✅ Badge (4种稀有度)
- ✅ Progress Ring (圆环进度条)
- ✅ Progress Bar (条形进度条)
- ✅ Achievement Badge (成就徽章)
- ✅ Word Card (词汇卡片)

## 🎯 交互功能

### 已实现的交互
1. **Landing Page**
   - ✅ 文本分析器实时Demo
   - ✅ 页面滚动动画
   - ✅ 卡片悬停效果

2. **Dashboard**
   - ✅ 进度环动画
   - ✅ 快速添加词汇
   - ✅ 任务进度更新
   - ✅ 成就徽章光效

3. **Onboarding**
   - ✅ 多步骤流程切换
   - ✅ 问卷答题
   - ✅ 闪卡翻转
   - ✅ 进度条动画

4. **Word Detail**
   - ✅ Tab切换
   - ✅ 快测答题
   - ✅ 写作反馈模拟
   - ✅ 发音检测模拟

### Mock数据
所有数据都在 `mock-data.js` 中定义，包括：
- 用户信息
- 学习统计
- 考试目标
- 每日任务
- 成就列表
- 词汇数据
- 评价内容

## 📱 响应式设计

已适配的断点：
- ✅ Desktop: >1024px
- ✅ Tablet: 768px - 1024px
- ✅ Mobile: <768px

移动端特性：
- 底部Tab导航
- 简化的卡片布局
- 触摸友好的按钮尺寸

## 🔧 自定义修改

### 修改颜色
在 `styles.css` 的 `:root` 部分修改CSS变量：
```css
:root {
    --primary: #你的颜色;
    --brand-red: #你的颜色;
}
```

### 修改数据
在 `mock-data.js` 中修改对应的数据对象。

### 添加页面
1. 创建新的 `.html` 文件
2. 复制通用头部和导航
3. 添加页面特定内容
4. 在 `app.js` 中添加初始化逻辑

## 📊 与旧设计对比

| 方面 | 旧设计 | 新设计 |
|------|--------|--------|
| 首页标题 | "Master Chinese with AI" | "Pass HSK 6 in 180 Days" |
| 社会证明 | ❌ 无 | ✅ 12,847+用户 + 评价 |
| Dashboard | 简单数据卡片 | 游戏化任务 + 倒计时 + 成就 |
| 引导流程 | ❌ 无 | ✅ 4步个性化设置 |
| 词条页面 | 一次性展示850字 | Quick/Deep Dive拆分 |
| 成就系统 | ❌ 无 | ✅ 4种稀有度徽章 |
| HSK进度 | 列表展示 | 技能树可视化 |

## 🎓 给团队的建议

### 前端开发参考
1. **组件化**：将这些设计拆分为React/Vue组件
2. **动画库**：考虑使用Framer Motion增强动画
3. **图表库**：Stats页面建议用Recharts
4. **状态管理**：Zustand或Redux管理全局状态

### API对接
主要需要的新API：
```javascript
// 每日任务
GET /api/missions/today
POST /api/missions/:id/complete

// 用户目标
GET /api/user/goal
PUT /api/user/goal

// 成就系统
GET /api/achievements
POST /api/achievements/:id/claim

// 推荐系统
GET /api/recommendations/words
GET /api/recommendations/articles
```

### 设计师参考
1. 所有间距使用8px网格系统
2. 色彩对比度符合WCAG 2.1 AA标准
3. 字体大小范围：12px - 48px
4. 圆角：4px/8px/12px/16px
5. 阴影：3个等级(sm/md/lg)

## 🐛 已知限制

这是一个**静态演示**，以下功能仅为视觉展示：
- ⚠️ 音频播放（只有按钮动画）
- ⚠️ 实际数据更新（前端模拟）
- ⚠️ 用户认证（直接跳转）
- ⚠️ 语音识别（模拟反馈）

## 📞 反馈与讨论

使用这个demo时，请关注：
1. **用户体验**：流程是否流畅？
2. **视觉设计**：配色和排版是否舒适？
3. **功能完整性**：是否缺少关键功能？
4. **性能**：页面加载和动画是否流畅？

有任何建议或问题，请记录下来供团队讨论！

---

## 🔍 SEO Ops Note (2025-10-22)
- 提交域名至 Google Search Console & Bing Webmaster，验证 sitemap `/sitemap.xml` 与 robots.txt
- 依次发布 HSK 级别落地页、工具介绍页，并在 `<head>` 中保持 canonical、结构化数据一致
- 站外信号：
  - 与 HSK 论坛、语言学习博客建立互换链接或投稿
  - 输出可下载 PDF（学习计划、词汇表）吸引引用链接
  - 每季度整理成功案例，联系教育类媒体投稿
  - 新增 HSK 3 Roadmap 页面，用于投放与站外引流
- 监测指标（Looker Studio/GA4）：自然流量、文章停留时长、工具转化率、邮箱收集量
- 每次新增导航项、CTA 需同步更新 README，以便团队掌握内容矩阵

**版本：** 1.0.0  
**创建日期：** 2025-01-15  
**设计者：** Claude (AI Assistant)  
**状态：** ✅ 完成 - 可用于演示和讨论

