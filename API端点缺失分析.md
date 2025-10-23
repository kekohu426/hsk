# API端点缺失分析报告

基于"管理后台和用户端显示什么 → 数据从哪来 → 后端API需要提供什么数据"的思维方式进行系统性检查。

---

## 📱 用户端页面需求分析

### 1. dashboard.html（用户仪表盘）

#### 显示的数据
- ✅ 用户基本信息（用户名、等级、XP）
- ✅ 连续学习天数（Streak）
- ✅ 今日任务列表（类型、进度、XP奖励、完成状态）
- ✅ 每日复习词汇数量
- ✅ HSK进度概览
- ✅ 词库统计（待学/学习中/已掌握）
- ✅ 最近学习活动时间线
- ✅ 成就展示
- ⚠️ **学习趋势图**（每日学习时长、每日新增词汇 - dashboard中常见）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/users/me | 用户基本信息 | ✅ 已有 |
| GET /api/daily-missions | 今日任务列表 | ✅ 已有 |
| POST /api/daily-missions/:missionId/claim | 领取任务奖励 | ✅ 已有 |
| GET /api/words/due | 待复习词汇 | ✅ 已有 |
| GET /api/users/stats | 用户学习统计 | ✅ 已有 |
| GET /api/users/stats/trends | 学习趋势数据（7天/30天） | ❌ **缺失** |

---

### 2. words.html（我的词库）

#### 显示的数据
- ✅ 词库统计卡片（总数、待学、学习中、已掌握）
- ✅ 筛选器（HSK等级、学习状态）
- ✅ 搜索框
- ✅ 词汇列表（分页）
- ✅ 每个词汇的复习按钮

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/words?hskLevel=&status=&search=&page=&limit= | 词汇列表（带筛选） | ✅ 已有 |
| POST /api/words/:wordId/review | 提交复习结果 | ✅ 已有 |

---

### 3. word-detail.html（词汇详情页）

#### 显示的数据
- ✅ 词汇基本信息（汉字、拼音、英文、HSK等级、词性）
- ✅ Quick Learn内容
- ✅ Deep Dive内容
- ✅ Practice内容
- ✅ 用户学习状态
- ✅ 添加到词库按钮
- ⚠️ **相关词汇推荐**（近义词、反义词、相关词 - 常见功能）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/words/:wordId | 词汇详情 | ✅ 已有 |
| POST /api/words/:wordId/add | 添加到词库 | ✅ 已有 |
| POST /api/words/:wordId/review | 复习词汇 | ✅ 已有 |
| GET /api/words/:wordId/related | 相关词汇推荐 | ❌ **缺失** |

---

### 4. articles.html（文章列表）

#### 显示的数据
- ✅ 文章列表（封面、标题、摘要、作者、阅读时长、浏览量）
- ✅ 筛选器（分类、HSK等级）
- ✅ 收藏状态
- ⚠️ **搜索功能**（按标题、内容搜索）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/articles?category=&hskLevel=&search=&page=&limit= | 文章列表 | ✅ 已有（需确认支持search参数） |

---

### 5. article-detail.html（文章详情页）

#### 显示的数据
- ✅ 文章详情（标题、作者、内容、发布时间）
- ✅ 标注后的内容（每个词可点击查看释义）
- ✅ 收藏按钮
- ✅ 阅读进度自动保存
- ⚠️ **相关文章推荐**（类似主题、相同HSK等级 - 常见功能）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/articles/:slug | 文章详情 | ✅ 已有 |
| POST /api/articles/:articleId/bookmark | 收藏/取消收藏 | ✅ 已有 |
| POST /api/articles/:articleId/progress | 更新阅读进度 | ✅ 已有 |
| GET /api/articles/:articleId/related | 相关文章推荐 | ❌ **缺失** |

---

### 6. hsk-library.html（HSK词库）

#### 显示的数据
- ✅ HSK 1-6每个等级的进度条
- ✅ 每个等级的词汇列表
- ✅ 掌握情况统计

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/hsk/:level/words | 指定HSK等级的词汇列表 | ✅ 已有 |

---

### 7. analyzer.html（文本分析器）

#### 显示的数据
- ✅ 文本输入框
- ✅ 分析结果（提取的词汇、HSK分布、难度评估、标注后的HTML）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| POST /api/text/analyze | 分析中文文本 | ✅ 已有 |

---

### 8. profile.html（用户个人资料）

#### 显示的数据
- ✅ 用户基本信息（头像、用户名、邮箱）
- ✅ 会员状态
- ✅ 账户设置
- ⚠️ **导出学习数据**（常见的数据隐私功能）
- ⚠️ **修改密码**

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/users/me | 用户信息 | ✅ 已有 |
| PUT /api/users/me | 更新用户信息 | ✅ 已有 |
| PUT /api/users/me/password | 修改密码 | ❌ **缺失** |
| GET /api/users/me/export | 导出学习数据 | ❌ **缺失** |

---

### 9. 认证相关

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| POST /api/auth/register | 注册 | ✅ 已有 |
| POST /api/auth/login | 登录 | ✅ 已有 |
| POST /api/auth/logout | 登出 | ❌ **缺失** |
| POST /api/auth/forgot-password | 忘记密码 | ❌ **缺失** |
| POST /api/auth/reset-password | 重置密码 | ❌ **缺失** |

---

## 🔧 管理后台页面需求分析

### 1. DashboardPage（管理后台仪表盘）

#### 显示的数据
- ✅ 总用户数
- ✅ 总词汇数
- ✅ 总文章数
- ✅ 活跃用户数（今日/本周/本月）
- ✅ 新增用户趋势
- ✅ AI生成进度
- ✅ 最近活动日志
- ⚠️ **系统状态**（数据库、Redis、队列健康状态）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/dashboard/stats | 仪表盘统计数据 | ✅ 已有（需补充完整字段定义） |
| GET /api/admin/system/status | 系统健康状态 | ❌ **缺失** |

---

### 2. WordManagement（词汇管理）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/word-entries | 词汇列表 | ✅ 已有 |
| POST /api/admin/word-entries/import | 导入CSV | ✅ 已有 |
| POST /api/admin/generation/batch | 批量生成 | ✅ 已有 |
| PUT /api/admin/word-entries/:wordId | 更新词汇 | ✅ 已有 |
| DELETE /api/admin/word-entries/:wordId | 删除词汇 | ✅ 已有 |
| POST /api/admin/word-entries/:wordId/publish | 发布词汇 | ✅ 已有 |

---

### 3. ArticleManagement（文章管理）

#### 显示的数据
- ✅ 文章列表
- ✅ 创建/编辑/删除功能
- ✅ AI生成功能

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/articles | 文章列表 | ✅ 已有 |
| GET /api/admin/articles/:articleId | 文章详情 | ✅ 已有 |
| POST /api/admin/articles | 创建文章 | ✅ 已有 |
| PUT /api/admin/articles/:articleId | 更新文章 | ✅ 已有 |
| DELETE /api/admin/articles/:articleId | 删除文章 | ✅ 已有 |
| POST /api/admin/articles/:articleId/generate | 为已有文章生成内容 | ✅ 已有 |
| POST /api/admin/articles/generate-content | 基于prompt生成新文章（返回文本不创建记录） | ❌ **缺失** |

---

### 4. UserManagement（用户管理）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/users | 用户列表 | ✅ 已有 |
| GET /api/admin/users/:userId/stats | 用户详细统计 | ✅ 已有 |
| PUT /api/admin/users/:userId | 更新用户信息（如设置会员） | ❌ **缺失** |
| DELETE /api/admin/users/:userId | 删除用户 | ❌ **缺失** |

---

### 5. DailyMissionManagement（每日任务管理）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/daily-missions | 任务模板列表 | ✅ 已有 |
| POST /api/admin/daily-missions | 创建任务 | ✅ 已有 |
| PUT /api/admin/daily-missions/:missionId | 更新任务 | ✅ 已有 |
| DELETE /api/admin/daily-missions/:missionId | 删除任务 | ✅ 已有 |
| GET /api/admin/daily-missions/stats | 任务完成率统计 | ❌ **缺失** |

---

### 6. AchievementManagement（成就管理）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/achievements | 成就列表 | ✅ 已有 |
| POST /api/admin/achievements | 创建成就 | ✅ 已有 |
| PUT /api/admin/achievements/:achievementId | 更新成就 | ✅ 已有 |
| DELETE /api/admin/achievements/:achievementId | 删除成就 | ✅ 已有 |
| GET /api/admin/achievements/stats | 成就获得统计 | ❌ **缺失** |

---

### 7. WordPreviewPage（词汇预览编辑）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/word-entries/:wordId/content | 获取词汇内容 | ✅ 已有 |
| PUT /api/admin/word-entries/:wordId/content | 更新词汇内容 | ✅ 已有 |
| POST /api/admin/word-entries/:wordId/publish | 发布词汇 | ✅ 已有 |

---

### 8. ArticleEditorPage（文章编辑器）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/articles/:articleId | 获取文章 | ✅ 已有 |
| PUT /api/admin/articles/:articleId | 更新文章 | ✅ 已有 |
| POST /api/admin/articles/annotate | 词汇标注 | ✅ 已有 |
| POST /api/admin/articles/generate-content | 基于prompt生成内容 | ❌ **缺失** |

---

### 9. StaticPageManagement（静态页面管理）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/static/pages | 页面列表和状态 | ✅ 已有 |
| POST /api/admin/static/generate-all | 批量生成所有 | ✅ 已有 |
| POST /api/admin/static/regenerate/:wordId | 重新生成单页 | ✅ 已有 |
| POST /api/admin/static/sitemap | 生成sitemap | ✅ 已有 |

---

### 10. AIConfigPage（AI配置）

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/ai-config | 获取AI配置 | ✅ 已有 |
| PUT /api/admin/ai-config | 更新AI配置 | ✅ 已有 |
| POST /api/admin/ai-config/test | 测试AI连接 | ❌ **缺失** |

---

### 11. 管理员活动日志

#### 需要的API端点
| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/admin/activity-logs | 管理员操作日志 | ❌ **缺失** |

---

## 🚨 系统级API

### 健康检查和监控

| 端点 | 用途 | 状态 |
|------|------|------|
| GET /api/health | 基础健康检查 | ❌ **缺失** |
| GET /api/admin/system/status | 详细系统状态（Redis、DB、Queue） | ❌ **缺失** |

---

## 📊 遗漏的API端点汇总

### 用户端（9个缺失）

1. ❌ **GET /api/users/stats/trends** - 学习趋势数据（7天/30天）
   - 返回：每日学习时长、每日新增词汇数、每日XP获得等

2. ❌ **GET /api/words/:wordId/related** - 相关词汇推荐
   - 返回：近义词、反义词、相关词汇列表（最多10个）

3. ❌ **GET /api/articles/:articleId/related** - 相关文章推荐
   - 返回：类似主题或相同HSK等级的文章（最多5篇）

4. ❌ **PUT /api/users/me/password** - 修改密码
   - 请求：{ oldPassword, newPassword }

5. ❌ **GET /api/users/me/export** - 导出学习数据
   - 返回：JSON或CSV格式的用户学习数据

6. ❌ **POST /api/auth/logout** - 登出
   - 可选：将token加入黑名单（如使用Redis）

7. ❌ **POST /api/auth/forgot-password** - 忘记密码
   - 请求：{ email }
   - 发送重置密码邮件

8. ❌ **POST /api/auth/reset-password** - 重置密码
   - 请求：{ token, newPassword }

9. **GET /api/articles** - 需要确认是否支持 `search` 参数

---

### 管理后台（10个缺失）

10. ❌ **POST /api/admin/articles/generate-content** - 基于prompt生成文章内容
    - 请求：{ prompt, hskLevel, category }
    - 返回：生成的文章文本（不创建数据库记录）

11. ❌ **PUT /api/admin/users/:userId** - 更新用户信息
    - 用于设置会员状态、修改用户等级等

12. ❌ **DELETE /api/admin/users/:userId** - 删除用户
    - 软删除或硬删除

13. ❌ **GET /api/admin/daily-missions/stats** - 任务完成率统计
    - 返回：每个任务的总完成次数、完成率等

14. ❌ **GET /api/admin/achievements/stats** - 成就获得统计
    - 返回：每个成就的获得人数、获得率等

15. ❌ **POST /api/admin/ai-config/test** - 测试AI连接
    - 测试GLM API密钥是否有效

16. ❌ **GET /api/admin/activity-logs** - 管理员操作日志
    - 返回：管理员的所有操作记录（分页）

17. ❌ **GET /api/admin/system/status** - 系统状态监控
    - 返回：Redis状态、数据库状态、队列状态、内存使用等

18. ❌ **GET /api/health** - 基础健康检查
    - 返回：{ status: "ok", timestamp }

19. **GET /api/admin/dashboard/stats** - 需要补充完整的返回字段定义

---

## 📝 需要澄清的API端点

### 1. 文章搜索功能
- `GET /api/articles` - 需要确认是否支持 `search` 查询参数
- 如果支持，需要在文档中明确说明

### 2. 仪表盘统计数据
- `GET /api/admin/dashboard/stats` - 需要详细列出返回的所有字段
- 应该包含：
  - 总用户数、活跃用户数（今日/本周/本月）
  - 新增用户数（今日/本周/本月）
  - 总词汇数、已生成词汇数
  - 总文章数、已发布文章数
  - 当前活跃的生成任务

---

## 💡 建议优先级

### P0（必须立即添加）
1. POST /api/auth/logout
2. GET /api/users/stats/trends
3. POST /api/admin/articles/generate-content
4. GET /api/health

### P1（重要，应该添加）
5. GET /api/words/:wordId/related
6. GET /api/articles/:articleId/related
7. PUT /api/users/me/password
8. GET /api/admin/system/status
9. PUT /api/admin/users/:userId

### P2（次要，可以后续添加）
10. GET /api/users/me/export
11. POST /api/auth/forgot-password
12. POST /api/auth/reset-password
13. DELETE /api/admin/users/:userId
14. GET /api/admin/daily-missions/stats
15. GET /api/admin/achievements/stats
16. POST /api/admin/ai-config/test
17. GET /api/admin/activity-logs

---

## ✅ 下一步行动

1. ✅ 补充上述缺失的API端点到 `02-后端API设计.md`
2. ✅ 完善 `GET /api/admin/dashboard/stats` 的返回字段定义
3. ✅ 明确 `GET /api/articles` 的search参数支持
4. ⚠️ 更新管理后台和用户端代码以使用新增的API端点
