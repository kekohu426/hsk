# 🚀 快速启动指南

## 第一步：启动数据库

```bash
# 在项目根目录执行
docker-compose up -d

# 检查容器状态
docker-compose ps

# 应该看到postgres和redis都在运行
```

## 第二步：配置环境变量

```bash
cd backend

# 如果还没有.env文件，需要创建一个
# 复制以下内容到 backend/.env

DATABASE_URL="postgresql://chinesemaster:chinesemaster123@localhost:5432/chinesemaster?schema=public"
JWT_SECRET="local-dev-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
GLM_API_KEY="你的GLM-API密钥"
GLM_API_URL="https://open.bigmodel.cn/api/paas/v4/chat/completions"
GLM_MODEL="glm-4"
REDIS_URL="redis://localhost:6379"
FRONTEND_URL="http://localhost:3001"
ADMIN_URL="http://localhost:3002"
```

**⚠️ 重要**: 请将`GLM_API_KEY`替换为您的真实API密钥

## 第三步：安装依赖并初始化数据库

```bash
# 确保在backend目录下
cd backend

# 安装依赖
npm install

# 生成Prisma Client
npm run prisma:generate

# 运行数据库迁移（创建表结构）
npm run prisma:migrate

# 填充种子数据（创建测试用户和示例数据）
npm run db:seed
```

## 第四步：启动后端服务器

```bash
# 开发模式（自动重启）
npm run dev

# 你应该看到：
# 🚀 Server running on http://localhost:3000
# 📝 Environment: development
# ✅ Health check: http://localhost:3000/health
```

## 第五步：测试API

打开另一个终端窗口，测试以下命令：

```bash
# 1. 健康检查
curl http://localhost:3000/health

# 2. 使用测试账号登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# 复制返回的token（后续请求需要）

# 3. 获取HSK词汇列表
curl http://localhost:3000/api/words?level=2

# 4. 获取文章列表
curl http://localhost:3000/api/articles

# 5. 使用管理员账号登录（测试AI生成功能）
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chinesemaster.com",
    "password": "admin123"
  }'

# 6. 测试AI文章生成（需要有效的GLM API Key）
curl -X POST http://localhost:3000/api/admin/generate/article \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "topic": "going to the supermarket",
    "level": "BEGINNER",
    "length": 300
  }'
```

## 🎉 成功！

如果以上步骤都顺利完成，你的后端API已经在运行了！

## 📊 查看数据库

```bash
# 启动Prisma Studio（数据库可视化工具）
cd backend
npm run prisma:studio

# 浏览器会自动打开 http://localhost:5555
# 你可以查看和编辑数据库中的所有数据
```

## 🧪 测试账号

### 管理员账号（可以使用所有功能）
- **Email**: admin@chinesemaster.com
- **Password**: admin123

### 普通用户账号
- **Email**: test@example.com
- **Password**: test123

## 🔍 常见问题

### 1. 端口被占用

如果3000端口被占用，修改`backend/.env`中的`PORT`：
```bash
PORT=3001
```

### 2. 数据库连接失败

确保Docker容器正在运行：
```bash
docker-compose ps
docker-compose logs postgres
```

### 3. Prisma迁移失败

重置数据库：
```bash
npm run prisma:migrate reset
npm run db:seed
```

### 4. AI生成失败

检查`.env`文件中的`GLM_API_KEY`是否正确设置。

## 📝 下一步

1. **前端开发**: 创建Next.js前端连接API
2. **管理后台**: 创建React管理后台
3. **部署**: 部署到Railway和Vercel

查看完整PRD文档：[PRD-COMPLETE.md](./PRD-COMPLETE.md)

## 🛑 停止服务

```bash
# 停止后端服务器：Ctrl + C

# 停止Docker容器
docker-compose down

# 停止并删除所有数据
docker-compose down -v
```

---

**祝你开发顺利！** 🎊





