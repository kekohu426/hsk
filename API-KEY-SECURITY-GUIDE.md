# 🔐 API密钥安全配置指南

## ✅ 配置完成状态

**GLM API密钥**: ✅ 已配置  
**配置文件**: `backend/.env`  
**配置日期**: 2025-10-19

---

## 🎯 已完成的配置

### 1. 环境配置文件
创建了以下文件：
- ✅ `backend/.env` - 实际配置文件（已包含您的API密钥）
- ✅ `backend/.env.example` - 示例文件（不含真实密钥）
- ✅ `.gitignore` - 防止敏感文件被提交

### 2. GLM API配置
```bash
GLM_API_KEY=f507e29a94a649b68bbf75bb0c5d58da.71yJynl907vJq6tT
GLM_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
GLM_MODEL=glm-4
```

### 3. 安全措施
- ✅ `.env`文件已添加到`.gitignore`，不会被Git追踪
- ✅ JWT_SECRET已设置
- ✅ CORS配置已设置

---

## 🔒 安全最佳实践

### ⚠️ 重要提醒

1. **永远不要将.env文件提交到Git**
   ```bash
   # 已在.gitignore中配置，但请再次确认
   git status  # 确保.env不在列表中
   ```

2. **不要在代码中硬编码API密钥**
   ```javascript
   // ❌ 错误做法
   const apiKey = "f507e29a94a649b68bbf75bb0c5d58da.71yJynl907vJq6tT";
   
   // ✅ 正确做法
   const apiKey = process.env.GLM_API_KEY;
   ```

3. **不要在日志中打印API密钥**
   ```javascript
   // ❌ 错误做法
   console.log('API Key:', process.env.GLM_API_KEY);
   
   // ✅ 正确做法
   console.log('API Key:', process.env.GLM_API_KEY ? '***已配置***' : '未配置');
   ```

4. **定期轮换API密钥**
   - 建议每3-6个月更换一次
   - 如果怀疑泄露，立即更换

5. **不同环境使用不同密钥**
   - 开发环境：当前配置的密钥
   - 生产环境：使用单独的密钥
   - 测试环境：可以使用mock（已配置）

---

## 📋 如何使用配置

### 1. 启动开发服务器
```bash
cd backend
npm run dev
```

服务器会自动加载`.env`文件中的配置。

### 2. 测试AI功能
现在您可以测试AI相关的功能：

#### 测试文章生成
```bash
# 登录为管理员
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'

# 使用返回的token生成文章
curl -X POST http://localhost:3000/api/admin/ai/generate-article \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "topic": "春节习俗",
    "difficulty": "Beginner",
    "wordCount": 300
  }'
```

#### 测试词汇生成
```bash
curl -X POST http://localhost:3000/api/admin/ai/generate-vocab \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "hskLevel": 1,
    "count": 10,
    "prompt": "常用打招呼用语"
  }'
```

### 3. 在测试环境中
测试环境会自动使用mock数据，不会调用真实API：
```bash
npm test
```

---

## 🚀 部署到生产环境

### 步骤1: 创建生产环境配置
```bash
# 不要直接复制.env，创建新的.env.production
cd backend
cp .env.example .env.production
```

### 步骤2: 编辑生产配置
```bash
# 编辑.env.production
nano .env.production
```

修改以下配置：
```bash
NODE_ENV=production

# 生成强随机密钥
JWT_SECRET=<使用crypto生成的64字符随机字符串>

# 生产环境的API密钥（建议使用新密钥）
GLM_API_KEY=<生产环境专用密钥>

# 生产环境的域名
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com
```

### 步骤3: 生成强JWT密钥
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 步骤4: 验证配置
```bash
# 启动生产模式
NODE_ENV=production npm start

# 检查健康状态
curl http://localhost:3000/health
```

---

## 🔍 故障排查

### 问题1: AI功能不工作
**症状**: 调用AI接口返回错误

**检查步骤**:
```bash
# 1. 确认API密钥已设置
grep GLM_API_KEY backend/.env

# 2. 检查API密钥格式是否正确（应包含.）
# 正确格式: xxxxxxxx.yyyyyyyy

# 3. 测试API密钥是否有效
curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer f507e29a94a649b68bbf75bb0c5d58da.71yJynl907vJq6tT" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### 问题2: .env文件不生效
**原因**: 需要重启服务器

**解决**:
```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 问题3: API密钥泄露了怎么办
**立即行动**:
1. 登录GLM控制台: https://open.bigmodel.cn/
2. 撤销当前API密钥
3. 生成新的API密钥
4. 更新`.env`文件中的密钥
5. 重启应用

---

## 📊 API使用监控

### 查看AI服务调用日志
应用会记录AI服务的调用情况：
```bash
# 查看最近的日志
tail -f logs/app.log | grep "AI Service"
```

### 监控API配额
建议定期检查GLM API的使用情况：
1. 登录 https://open.bigmodel.cn/
2. 查看控制台 → API使用情况
3. 监控剩余配额

---

## 🎓 开发团队配置指南

### 新成员加入时
1. 克隆代码仓库
2. 复制配置示例：
   ```bash
   cd backend
   cp .env.example .env
   ```
3. 联系项目管理员获取开发环境API密钥
4. 更新`.env`文件中的`GLM_API_KEY`

### 不要共享的信息
- ❌ 不要通过邮件、聊天工具发送API密钥
- ❌ 不要将API密钥写在文档中
- ❌ 不要截图包含API密钥的屏幕

### 安全共享方式
- ✅ 使用密码管理器（如1Password、LastPass）
- ✅ 使用安全的密钥管理服务
- ✅ 面对面口头传达（小团队）

---

## 📝 配置文件说明

### backend/.env
**作用**: 实际使用的环境变量配置  
**包含**: 真实的API密钥和密码  
**Git状态**: ✅ 已忽略（不会提交）  
**分享**: ❌ 不要分享给任何人

### backend/.env.example
**作用**: 配置文件的模板  
**包含**: 占位符，不含真实密钥  
**Git状态**: ✅ 已提交（可以提交）  
**分享**: ✅ 可以安全分享

### .gitignore
**作用**: 告诉Git哪些文件不要追踪  
**包含**: .env、日志文件、node_modules等  
**Git状态**: ✅ 已提交

---

## ✅ 验证清单

在开始使用前，请确认：

- [x] ✅ `.env`文件已创建
- [x] ✅ GLM_API_KEY已正确配置
- [x] ✅ JWT_SECRET已设置
- [x] ✅ `.gitignore`包含`.env`
- [x] ✅ Git状态中不包含`.env`文件
- [ ] ⏳ 已测试AI文章生成功能
- [ ] ⏳ 已测试AI词汇生成功能
- [ ] ⏳ 已设置生产环境配置（部署时）

---

## 🆘 需要帮助？

### 常见问题
1. **Q: 我可以在多个项目中使用同一个API密钥吗？**
   A: 可以，但建议为不同项目使用不同密钥，便于管理和撤销。

2. **Q: API密钥有使用限制吗？**
   A: 是的，GLM API有配额限制。请查看官方文档了解详情。

3. **Q: 如何知道API密钥是否有效？**
   A: 启动应用后，尝试调用AI功能。如果成功返回结果，说明密钥有效。

4. **Q: 测试环境会消耗API配额吗？**
   A: 不会。测试环境使用mock数据，不会调用真实API。

---

**配置日期**: 2025-10-19  
**最后更新**: 2025-10-19  
**负责人**: ChineseMaster项目团队

🎉 **配置完成！您现在可以使用完整的AI功能了！**

