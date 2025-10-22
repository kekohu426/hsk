# ChineseMaster Backend API

AI驱动的中文学习平台后端服务

## 🚀 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 启动数据库

使用Docker Compose启动PostgreSQL和Redis：

```bash
# 在项目根目录（chinese-learning-platform）执行
docker-compose up -d
```

### 3. 配置环境变量

复制`.env.local`为`.env`并填入您的配置：

```bash
cp .env.local .env
```

**重要**：请在`.env`中设置您的GLM API密钥：
```
GLM_API_KEY="your-actual-glm-api-key-here"
```

### 4. 初始化数据库

```bash
# 生成Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 填充种子数据
npm run db:seed
```

### 5. 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务器将在 http://localhost:3000 启动

## 📚 API文档

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 词汇接口
- `GET /api/words` - 获取词汇列表（支持筛选）
- `GET /api/words/:slug` - 获取词汇详情
- `GET /api/words/hsk/levels` - 获取HSK级别统计

### 用户词库
- `GET /api/user/words` - 获取我的词库
- `POST /api/user/words` - 添加词汇到词库
- `PATCH /api/user/words/:id` - 更新词汇状态
- `DELETE /api/user/words/:id` - 删除词汇
- `GET /api/user/stats` - 获取学习统计

### 文章接口
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `POST /api/articles/:id/view` - 记录阅读进度

### 学习接口
- `GET /api/learn/due-words` - 获取待复习词汇
- `POST /api/learn/review` - 提交复习结果
- `POST /api/learn/session/start` - 开始学习会话
- `POST /api/learn/session/:id/end` - 结束学习会话

### 文本分析
- `POST /api/text/analyze` - 分析中文文本

### 管理端接口（需要ADMIN权限）
- `GET /api/admin/dashboard/stats` - 仪表盘统计
- `POST /api/admin/generate/article` - AI生成文章
- `POST /api/admin/generate/vocab` - AI生成词汇页面
- `GET /api/admin/articles` - 文章管理
- `GET /api/admin/words` - 词汇管理
- `GET /api/admin/users` - 用户管理
- `GET /api/admin/ai/configs` - AI配置管理

## 🧪 测试账号

运行种子脚本后，您可以使用以下账号登录：

**管理员账号：**
- Email: `admin@chinesemaster.com`
- Password: `admin123`

**普通用户：**
- Email: `test@example.com`
- Password: `test123`

## 🛠️ 技术栈

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: JWT + bcrypt
- **AI Service**: 智谱AI GLM-4
- **NLP**: node-jieba (中文分词)

## 📁 项目结构

```
backend/
├── prisma/
│   └── schema.prisma          # 数据库Schema
├── src/
│   ├── controllers/           # 业务逻辑控制器
│   ├── routes/                # API路由定义
│   ├── middleware/            # 中间件（认证、错误处理等）
│   ├── services/              # 服务层（AI、外部API等）
│   ├── utils/                 # 工具函数
│   ├── scripts/               # 脚本（种子数据等）
│   └── server.js              # 服务器入口
├── .env                       # 环境变量（不提交）
├── .env.local                 # 本地环境变量模板
├── package.json               # 项目配置
└── README.md                  # 本文件
```

## 🔧 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生成Prisma Client
npm run prisma:generate

# 创建数据库迁移
npm run prisma:migrate

# 打开Prisma Studio（数据库GUI）
npm run prisma:studio

# 填充种子数据
npm run db:seed
```

## 🐳 Docker部署

使用Docker Compose一键启动所有服务：

```bash
# 启动（后台运行）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除数据
docker-compose down -v
```

## 📝 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL连接字符串 | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | JWT签名密钥 | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | JWT过期时间 | `7d` |
| `PORT` | 服务器端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` / `production` |
| `GLM_API_KEY` | 智谱AI API密钥 | `your-glm-api-key` |
| `GLM_API_URL` | 智谱AI API地址 | `https://open.bigmodel.cn/api/paas/v4/chat/completions` |
| `GLM_MODEL` | 使用的模型 | `glm-4` / `glm-4-flash` |
| `REDIS_URL` | Redis连接地址 | `redis://localhost:6379` |
| `FRONTEND_URL` | 前端地址（CORS） | `http://localhost:3001` |
| `ADMIN_URL` | 管理后台地址（CORS） | `http://localhost:3002` |

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 License

ISC





