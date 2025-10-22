# 🎓 ChineseMaster - AI-Powered Chinese Learning Platform

一个完整的中文学习平台，包含用户端、管理端和后端 API，支持 AI 内容生成、间隔复习、SEO 优化等功能。

[![Status](https://img.shields.io/badge/status-ready-brightgreen)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## ✨ 核心功能

### 用户端
- 🔐 完整的用户认证系统
- 📚 HSK 1-6 词汇库 (10,000+ 词汇)
- 📰 每日文章 (带拼音标注和测验)
- 🔍 智能文本分析器
- 🧠 SuperMemo 2 间隔复习系统
- 📊 学习统计和进度追踪
- 🎯 个性化词库管理
- 🌐 完整 SEO 优化

### 管理端
- 📝 AI 文章生成器
- 📖 AI 词汇生成器
- 📁 内容管理系统
- 👥 用户管理
- ⚙️ AI 配置管理
- 📈 数据统计仪表盘

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- pnpm / npm
- SQLite (开发环境)

### 1. 克隆项目

```bash
git clone <repository-url>
cd chinese-learning-platform
```

### 2. 安装依赖

```bash
# 后端
cd backend
npm install

# 用户端
cd ../frontend-user
npm install

# 管理端
cd ../admin
npm install
```

### 3. 配置环境变量

```bash
# 后端 (backend/.env)
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
GLM_API_KEY="your-glm-api-key"  # 可选：用于 AI 生成

# 用户端 (frontend-user/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000

# 管理端 (admin/.env)
VITE_API_URL=http://localhost:3000
```

### 4. 初始化数据库

```bash
cd backend
npx prisma migrate dev
npm run seed
```

### 5. 启动服务

```bash
# 终端 1 - 后端
cd backend
npm run dev

# 终端 2 - 用户端
cd frontend-user
npm run dev

# 终端 3 - 管理端
cd admin
npm run dev
```

### 6. 访问应用

- 🌐 **用户端**: http://localhost:3001
- 🔧 **管理端**: http://localhost:3002
- 🚀 **API**: http://localhost:3000

### 默认账号

- **管理员**: admin@demo.com / admin123
- **普通用户**: user@demo.com / user123

---

## 📚 技术栈

### 前端
- **框架**: Next.js 15, React 19, Vite
- **样式**: Tailwind CSS 4, shadcn/ui
- **状态**: Zustand, React Query
- **图表**: Recharts
- **动画**: Framer Motion

### 后端
- **框架**: Node.js, Express.js
- **数据库**: SQLite (dev), PostgreSQL (prod)
- **ORM**: Prisma
- **认证**: JWT, bcryptjs
- **AI**: GLM-4 (智谱AI)

---

## 📖 文档

- [完整 PRD](./PRD-COMPLETE.md) - 产品需求文档
- [任务清单](./TASKS.md) - 370+ 详细任务
- [进度追踪](./PROGRESS.md) - 开发进度
- [完成报告](./COMPLETION-REPORT.md) - 项目总结
- [快速开始](./QUICKSTART.md) - 详细指南

---

## 🏗️ 项目结构

```
chinese-learning-platform/
├── frontend-user/     # Next.js 用户端
├── admin/             # Vite 管理端
├── backend/           # Express 后端
├── _archived/         # 历史代码
└── docs/              # 文档
```

---

## 🎯 核心特性

### SuperMemo 2 算法
科学的间隔复习系统，根据记忆曲线自动调整复习时间。

### AI 内容生成
集成 GLM-4，支持自动生成文章和词汇，包含拼音、翻译、例句等。

### SEO 优化
- Schema.org 结构化数据
- 自动生成 sitemap
- Meta 标签优化
- Open Graph 支持

### 90天学习热力图
GitHub 风格的活动热力图，可视化学习连续性。

---

## 🔧 开发指南

### 添加新功能

1. 在 `TASKS.md` 中定义任务
2. 创建对应的组件/页面
3. 添加 API 接口
4. 更新类型定义
5. 测试功能
6. 更新文档

### 数据库操作

```bash
# 创建迁移
npx prisma migrate dev --name your-migration

# 查看数据
npx prisma studio

# 重置数据库
npx prisma migrate reset
```

### 构建生产版本

```bash
# 用户端
cd frontend-user
npm run build

# 管理端
cd admin
npm run build

# 后端
cd backend
npm run build
```

---

## 🧪 测试

```bash
# 运行测试
npm test

# 覆盖率报告
npm run test:coverage
```

---

## 📦 部署

### Docker

```bash
docker-compose up -d
```

### 手动部署

详见 [部署指南](./docs/DEPLOYMENT.md)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

## 📄 License

MIT License

---

## 🙏 致谢

感谢所有贡献者和支持者！

---

## 📞 联系

- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Email: support@chinesemaster.com

---

**Happy Learning! 加油！💪**

