# 前端测试计划与文档

**最后更新**: 2025-10-20  
**项目**: ChineseMaster 中文学习平台  
**状态**: 🟡 进行中 (15% 完成度)

## 📋 测试概览

### 测试目标
- 确保所有前端页面正常渲染
- 验证用户交互功能正常工作
- 测试API集成和数据流
- 确保SRS算法正确性
- 验证表单验证逻辑

### 测试工具
- **Testing Library**: React组件测试 ✅ 已配置
- **Jest**: 单元测试框架 ✅ 已配置
- **Playwright**: E2E测试 ✅ 已配置在根目录

### 当前进度
- ✅ 测试框架已配置
- ✅ 3个测试套件已创建
- ✅ 23个测试用例通过
- ⏳ 约80%功能待测试

---

## 🎯 测试范围

### 1. 认证页面测试

#### 登录页面 (`/login`)
**文件**: `__tests__/pages/login.test.tsx` ✅

测试用例：
- [x] 渲染登录表单
- [x] 测试账号自动填充
- [x] 显示测试模式标识
- [x] 空字段验证错误
- [x] 登录API调用
- [x] 登录失败错误显示

#### 注册页面 (`/register`)
**文件**: `__tests__/pages/register.test.tsx` ⏳

测试用例：
- [ ] 渲染注册表单
- [ ] 表单字段验证
- [ ] 密码强度检查
- [ ] 注册API调用
- [ ] 成功注册后跳转

### 2. Dashboard页面测试

#### 主Dashboard (`/dashboard`)
**文件**: `__tests__/pages/dashboard.test.tsx` ⏳

测试用例：
- [ ] 渲染欢迎信息
- [ ] 显示学习统计
- [ ] 渲染快速操作卡片
- [ ] 获取学习数据
- [ ] 最近学习词汇列表

#### 文章页面 (`/dashboard/articles`)
**文件**: `__tests__/pages/articles.test.tsx` ⏳

测试用例：
- [ ] 渲染文章列表
- [ ] 难度筛选
- [ ] 文章详情页导航
- [ ] 阅读进度保存

#### 词库页面 (`/dashboard/words`)
**文件**: `__tests__/pages/words.test.tsx` ⏳

测试用例：
- [ ] 显示用户词汇
- [ ] 状态筛选 (NEW/LEARNING/MASTERED)
- [ ] 搜索功能
- [ ] 删除词汇
- [ ] 标记收藏

#### 学习页面 (`/dashboard/learn`)
**文件**: `__tests__/pages/learn.test.tsx` ⏳

测试用例：
- [ ] 显示待复习词汇数
- [ ] 开始学习会话
- [ ] 答题界面
- [ ] 评分系统 (Again/Hard/Good/Perfect)
- [ ] SRS算法应用

#### HSK词库 (`/dashboard/hsk-library`)
**文件**: `__tests__/pages/hsk-library.test.tsx` ⏳

测试用例：
- [ ] HSK级别导航
- [ ] 词汇列表渲染
- [ ] 添加到我的词库
- [ ] 词汇详情页

#### 文本分析器 (`/dashboard/analyzer`)
**文件**: `__tests__/pages/analyzer.test.tsx` ⏳

测试用例：
- [ ] 文本输入
- [ ] 分析API调用
- [ ] 词汇识别
- [ ] 已知/新词汇分类
- [ ] 批量添加词汇

#### 统计页面 (`/dashboard/stats`)
**文件**: `__tests__/pages/stats.test.tsx` ⏳

测试用例：
- [ ] 学习统计图表
- [ ] 90天热力图
- [ ] 词汇掌握进度
- [ ] 学习时间统计

### 3. 组件测试

#### UI组件
**目录**: `__tests__/components/ui/`

测试文件：
- [ ] `button.test.tsx` - 按钮组件
- [ ] `card.test.tsx` - 卡片组件
- [ ] `input.test.tsx` - 输入框组件
- [ ] `select.test.tsx` - 选择器组件
- [ ] `progress.test.tsx` - 进度条组件

#### 业务组件
**目录**: `__tests__/components/`

测试文件：
- [ ] `StatsCard.test.tsx` - 统计卡片
- [ ] `PinyinText.test.tsx` - 拼音文本渲染

### 4. 工具函数测试

#### SRS算法 (`lib/srs.ts`)
**文件**: `__tests__/lib/srs.test.ts` ✅

测试用例：
- [x] SuperMemo 2算法正确性
- [x] 间隔计算
- [x] Ease Factor调整
- [x] 复习质量评分
- [x] 间隔文本显示

#### API客户端 (`lib/api.ts`)
**文件**: `__tests__/lib/api.test.ts` ⏳

测试用例：
- [ ] API基础配置
- [ ] 请求拦截器 (添加token)
- [ ] 响应拦截器 (处理401)
- [ ] 各API方法调用

#### 表单验证 (`lib/validation.ts`)
**文件**: `__tests__/lib/validation.test.ts` ⏳

测试用例：
- [ ] 邮箱格式验证
- [ ] 密码强度验证
- [ ] 用户名验证
- [ ] 错误消息生成

### 5. Store测试

#### Zustand Store (`lib/store.ts`)
**文件**: `__tests__/lib/store.test.ts` ⏳

测试用例：
- [ ] 用户认证状态管理
- [ ] 登录/登出操作
- [ ] Token存储
- [ ] 状态持久化

---

## 🏃 运行测试

### 单元测试
```bash
cd frontend-user

# 运行所有测试
npm test

# 监听模式
npm test -- --watch

# 覆盖率报告
npm test -- --coverage
```

### E2E测试
```bash
cd /Users/keko/Downloads/chinese-learning-platform

# 运行所有E2E测试
npm run test:e2e

# UI模式
npm run test:e2e:ui

# 查看测试报告
npm run test:report
```

---

## 📊 测试覆盖率目标

| 类型 | 目标覆盖率 | 当前状态 |
|------|-----------|---------|
| 语句覆盖 | 80% | ⏳ 待测试 |
| 分支覆盖 | 75% | ⏳ 待测试 |
| 函数覆盖 | 85% | ⏳ 待测试 |
| 行覆盖 | 80% | ⏳ 待测试 |

---

## ✅ 已完成的测试 (3/20 = 15%)

1. **登录页面测试** ✅ (7个测试用例)
   - 所有基本功能已测试
   - 自动填充功能验证
   - API集成测试
   - 文件: `__tests__/pages/login.test.tsx`

2. **Dashboard页面测试** ✅ (7个测试用例)
   - 页面渲染测试
   - 数据加载测试
   - 统计显示测试
   - 文件: `__tests__/pages/dashboard.test.tsx`

3. **SRS算法测试** ✅ (9个测试用例)
   - SuperMemo 2算法验证
   - 边界条件测试
   - 间隔计算测试
   - 文件: `__tests__/lib/srs.test.ts`

---

## 📝 待补充的测试

### 高优先级
1. Dashboard主页测试
2. 词汇学习流程测试
3. 文章阅读功能测试
4. API客户端测试

### 中优先级
1. HSK词库浏览测试
2. 文本分析器测试
3. 用户配置页面测试
4. 统计页面测试

### 低优先级
1. UI组件单元测试
2. 工具函数测试
3. 性能测试
4. 可访问性测试

---

## 🐛 已发现并修复的问题

### BUG-013: 导入语句错误 ✅
- **严重程度**: 🔴 Critical
- **状态**: ✅ 已修复
- **问题**: 5个核心页面文件存在错误的导入语句 `'@tantml:parameter>'`
- **影响文件**:
  - `app/dashboard/analyzer/page.tsx`
  - `app/dashboard/learn/page.tsx`
  - `app/dashboard/words/page.tsx`
  - `app/dashboard/learn/review/page.tsx`
  - `app/dashboard/articles/[slug]/page.tsx`
- **修复**: 已全部修复为 `'@tanstack/react-query'`
- **修复时间**: 2025-10-20

### BUG-014: 测试基础设施缺失 ✅
- **严重程度**: 🟡 High
- **状态**: ✅ 已修复
- **问题**: 项目完全没有前端测试文件和配置
- **修复方案**:
  - 创建 jest.config.js 配置
  - 创建 jest.setup.js 环境设置
  - 添加测试脚本到 package.json
  - 创建 __tests__ 目录结构
  - 创建3个初始测试套件
- **修复时间**: 2025-10-20

---

## 🔄 持续集成

### 建议的CI流程
```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend-user && npm install
      - run: cd frontend-user && npm test -- --coverage
      - run: cd frontend-user && npm run lint
```

---

## 📖 测试最佳实践

1. **每个页面至少包含**:
   - 渲染测试
   - 用户交互测试
   - API调用测试
   - 错误处理测试

2. **组件测试原则**:
   - 测试用户可见的行为
   - 避免测试实现细节
   - 使用语义化查询

3. **Mock策略**:
   - Mock外部API调用
   - Mock路由导航
   - Mock状态管理

4. **代码组织**:
   - 测试文件与源文件对应
   - 使用describe分组
   - 清晰的测试名称

---

## 📅 更新日志

- **2025-10-20**: 创建测试计划文档
- **2025-10-20**: 完成登录页面测试
- **2025-10-20**: 完成SRS算法测试
- **2025-10-20**: 修复所有前端导入错误

---

**状态**: 🟡 进行中
**完成度**: 10% (2/20 主要测试文件)
**下一步**: 补充Dashboard和学习流程测试

