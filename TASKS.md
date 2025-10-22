# 🎯 ChineseMaster 详细任务清单

**总览**: 300+个具体任务，精确到文件级别

---

## 📦 阶段 0: 后端完善与测试 (剩余工作)

### Task 0.1: 修复数据库连接问题
- [ ] 0.1.1 选择数据库方案（PostgreSQL云服务 或 本地PostgreSQL）
- [ ] 0.1.2 获取数据库连接字符串
- [ ] 0.1.3 更新 `backend/.env` 文件
- [ ] 0.1.4 运行 `npx prisma generate`
- [ ] 0.1.5 运行 `npx prisma migrate dev --name init`
- [ ] 0.1.6 检查数据库表是否创建成功
- [ ] 0.1.7 运行 `npm run db:seed` 填充种子数据
- [ ] 0.1.8 验证数据：使用 `npx prisma studio` 查看

**预计时间**: 1小时

### Task 0.2: 启动并测试后端API
- [ ] 0.2.1 运行 `npm run dev` 启动服务器
- [ ] 0.2.2 测试健康检查：`curl http://localhost:3000/health`
- [ ] 0.2.3 测试用户注册：POST `/api/auth/register`
- [ ] 0.2.4 测试用户登录：POST `/api/auth/login`
- [ ] 0.2.5 获取JWT Token并保存
- [ ] 0.2.6 测试获取当前用户：GET `/api/auth/me`
- [ ] 0.2.7 测试获取词汇列表：GET `/api/words`
- [ ] 0.2.8 测试获取文章列表：GET `/api/articles`
- [ ] 0.2.9 测试添加词汇到词库：POST `/api/user/words`
- [ ] 0.2.10 测试文本分析：POST `/api/text/analyze`
- [ ] 0.2.11 记录所有API响应格式到文档

**预计时间**: 2小时

### Task 0.3: 准备种子数据
- [ ] 0.3.1 准备HSK 1级词汇（50个）- 编写到 `backend/src/scripts/hsk1-words.json`
- [ ] 0.3.2 准备HSK 2级词汇（100个）- 编写到 `backend/src/scripts/hsk2-words.json`
- [ ] 0.3.3 准备HSK 3级词汇（100个）- 编写到 `backend/src/scripts/hsk3-words.json`
- [ ] 0.3.4 准备HSK 4级词汇（100个）
- [ ] 0.3.5 准备HSK 5级词汇（75个）
- [ ] 0.3.6 准备HSK 6级词汇（75个）
- [ ] 0.3.7 准备5篇Beginner文章
- [ ] 0.3.8 准备3篇Intermediate文章
- [ ] 0.3.9 准备2篇Advanced文章
- [ ] 0.3.10 更新 `backend/src/scripts/seed.js` 批量导入
- [ ] 0.3.11 运行种子脚本

**预计时间**: 6小时

---

## 🎨 阶段 1: 用户端前端开发

---

### Module 1.0: 项目初始化

#### Task 1.0.1: 创建Next.js项目
- [ ] 1.0.1.1 运行 `npx create-next-app@latest frontend --typescript --tailwind --app`
- [ ] 1.0.1.2 选择配置：
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: Yes
  - `src/` directory: Yes
  - App Router: Yes
  - Import alias: @/*
- [ ] 1.0.1.3 进入目录：`cd frontend`
- [ ] 1.0.1.4 测试运行：`npm run dev`
- [ ] 1.0.1.5 验证 http://localhost:3001 可访问

**预计时间**: 15分钟

#### Task 1.0.2: 安装核心依赖
```bash
npm install axios @tanstack/react-query zustand
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
npm install @radix-ui/react-select @radix-ui/react-toast @radix-ui/react-progress
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install zod react-hook-form @hookform/resolvers
npm install framer-motion
```

- [ ] 1.0.2.1 安装API请求库
- [ ] 1.0.2.2 安装状态管理库
- [ ] 1.0.2.3 安装UI组件库（Radix UI）
- [ ] 1.0.2.4 安装图标库
- [ ] 1.0.2.5 安装表单验证库
- [ ] 1.0.2.6 安装动画库
- [ ] 1.0.2.7 验证所有依赖安装成功

**预计时间**: 10分钟

#### Task 1.0.3: 配置shadcn/ui
- [ ] 1.0.3.1 运行 `npx shadcn-ui@latest init`
- [ ] 1.0.3.2 安装需要的组件：
  ```bash
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add input
  npx shadcn-ui@latest add label
  npx shadcn-ui@latest add dialog
  npx shadcn-ui@latest add dropdown-menu
  npx shadcn-ui@latest add tabs
  npx shadcn-ui@latest add badge
  npx shadcn-ui@latest add progress
  npx shadcn-ui@latest add toast
  npx shadcn-ui@latest add select
  npx shadcn-ui@latest add popover
  npx shadcn-ui@latest add avatar
  npx shadcn-ui@latest add skeleton
  ```
- [ ] 1.0.3.3 验证组件文件生成到 `src/components/ui/`

**预计时间**: 20分钟

#### Task 1.0.4: 创建项目结构
创建以下目录和基础文件：

```
frontend/src/
├── app/
│   ├── layout.tsx                    # 根布局
│   ├── page.tsx                      # 首页（重定向到/dashboard）
│   ├── (auth)/
│   │   ├── layout.tsx                # 认证布局（居中、简洁）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── (dashboard)/
│       ├── layout.tsx                # 主应用布局（导航栏）
│       ├── dashboard/
│       │   └── page.tsx              # 首页仪表盘
│       ├── daily-article/
│       │   ├── page.tsx              # 文章列表
│       │   └── [id]/
│       │       └── page.tsx          # 文章详情
│       ├── text-analyzer/
│       │   └── page.tsx
│       ├── learn/
│       │   └── page.tsx
│       ├── word-bank/
│       │   └── page.tsx
│       ├── hsk-library/
│       │   ├── page.tsx              # HSK级别列表
│       │   ├── level/
│       │   │   └── [level]/
│       │   │       └── page.tsx      # 某级别词汇列表
│       │   └── word/
│       │       └── [slug]/
│       │           └── page.tsx      # 词汇详情（SSG）
│       └── profile/
│           └── page.tsx
├── components/
│   ├── ui/                           # shadcn组件
│   ├── layout/
│   │   ├── Navbar.tsx                # 导航栏
│   │   ├── Sidebar.tsx               # 侧边栏（可选）
│   │   └── Footer.tsx                # 页脚
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── word/
│   │   │   ├── WordCard.tsx          # 词汇卡片
│   │   │   ├── WordDetailPanel.tsx   # 词汇详情面板
│   │   │   └── WordList.tsx          # 词汇列表
│   │   ├── article/
│   │   │   ├── ArticleCard.tsx       # 文章卡片
│   │   │   ├── ArticleContent.tsx    # 文章内容渲染
│   │   │   └── ArticleQuiz.tsx       # 文章测验
│   │   ├── learn/
│   │   │   ├── Flashcard.tsx         # 闪卡组件
│   │   │   ├── ReviewButton.tsx      # 复习评分按钮
│   │   │   └── SessionSummary.tsx    # 学习总结
│   │   └── stats/
│   │       ├── StatsCard.tsx         # 统计卡片
│   │       └── ProgressChart.tsx     # 进度图表
│   └── shared/
│       ├── Loading.tsx               # 加载状态
│       ├── ErrorBoundary.tsx         # 错误边界
│       └── Pagination.tsx            # 分页组件
├── lib/
│   ├── api/
│   │   ├── client.ts                 # Axios配置
│   │   ├── auth.ts                   # 认证API
│   │   ├── words.ts                  # 词汇API
│   │   ├── articles.ts               # 文章API
│   │   ├── learn.ts                  # 学习API
│   │   ├── user.ts                   # 用户API
│   │   └── text.ts                   # 文本分析API
│   ├── store/
│   │   ├── authStore.ts              # 认证状态（Zustand）
│   │   └── uiStore.ts                # UI状态
│   ├── hooks/
│   │   ├── useAuth.ts                # 认证Hook
│   │   ├── useWords.ts               # 词汇Hook
│   │   └── useArticles.ts            # 文章Hook
│   └── utils/
│       ├── cn.ts                     # className合并
│       ├── formatters.ts             # 格式化工具
│       └── constants.ts              # 常量定义
├── types/
│   ├── index.ts                      # 全局类型
│   ├── api.ts                        # API响应类型
│   └── models.ts                     # 数据模型类型
└── styles/
    └── globals.css                   # 全局样式
```

- [ ] 1.0.4.1 创建所有目录
- [ ] 1.0.4.2 创建所有占位文件（空文件或最小实现）
- [ ] 1.0.4.3 验证目录结构正确

**预计时间**: 30分钟

#### Task 1.0.5: 配置环境变量和API Client
**文件**: `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ChineseMaster
```

**文件**: `frontend/src/lib/api/client.ts`
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

- [ ] 1.0.5.1 创建 `.env.local` 文件
- [ ] 1.0.5.2 实现 `client.ts`
- [ ] 1.0.5.3 配置请求/响应拦截器
- [ ] 1.0.5.4 实现Token自动刷新逻辑

**预计时间**: 30分钟

#### Task 1.0.6: 创建类型定义
**文件**: `frontend/src/types/models.ts`
```typescript
// User相关
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  preferredLang: string;
  isPremium: boolean;
  premiumUntil?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Word相关
export interface Word {
  id: string;
  chinese: string;
  pinyin: string;
  pinyinNumeric?: string;
  englishDefinition: string;
  hskLevel: number;
  slug: string;
  audioUrl?: string;
  exampleSentences: ExampleSentence[];
  characterBreakdown?: Record<string, CharacterInfo>;
  relatedWords?: RelatedWords;
  faqs?: FAQ[];
}

export interface ExampleSentence {
  cn: string;
  pinyin: string;
  en: string;
}

export interface CharacterInfo {
  pinyin: string;
  meaning: string;
  radical?: string;
  strokes?: number;
}

export interface RelatedWords {
  synonyms: WordRef[];
  antonyms: WordRef[];
  collocations: WordRef[];
}

export interface WordRef {
  word: string;
  pinyin: string;
  meaning: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// UserWord相关
export interface UserWord {
  id: string;
  userId: string;
  wordId: string;
  status: 'NEW' | 'LEARNING' | 'MASTERED';
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReview: string;
  isFavorite: boolean;
  notes?: string;
  source?: string;
  correctCount: number;
  wrongCount: number;
  totalTime: number;
  addedAt: string;
  lastReviewAt?: string;
  word: Word;
}

// Article相关
export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  content: ArticleContent[];
  excerpt: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  hskLevel?: string;
  readTime: number;
  wordCount: number;
  newWords: ArticleWord[];
  quiz?: QuizQuestion[];
  coverImage?: string;
  audioUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
}

export interface ArticleContent {
  type: 'paragraph' | 'dialogue';
  cn: string;
  pinyin: string;
  en: string;
}

export interface ArticleWord {
  wordId?: string;
  word: string;
  pinyin: string;
  meaning: string;
  hsk: number;
  example?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

// Learning Session相关
export interface LearningSession {
  id: string;
  userId: string;
  wordsReviewed: number;
  wordsCorrect: number;
  wordsWrong: number;
  totalTime: number;
  startedAt: string;
  endedAt?: string;
}

// Stats相关
export interface UserStats {
  totalWords: number;
  newWords: number;
  learningWords: number;
  masteredWords: number;
  dueWordsCount: number;
  studyStreak: number;
  totalStudyTime: number;
}
```

**文件**: `frontend/src/types/api.ts`
```typescript
import { User, Word, UserWord, Article, UserStats, LearningSession } from './models';

// API响应通用格式
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 认证相关
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// 词汇相关
export interface GetWordsParams {
  level?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetUserWordsParams {
  status?: 'NEW' | 'LEARNING' | 'MASTERED';
  hskLevel?: number;
  isFavorite?: boolean;
  page?: number;
  limit?: number;
}

export interface AddWordRequest {
  wordId: string;
  source?: string;
}

export interface UpdateUserWordRequest {
  status?: 'NEW' | 'LEARNING' | 'MASTERED';
  isFavorite?: boolean;
  notes?: string;
}

// 文章相关
export interface GetArticlesParams {
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  page?: number;
  limit?: number;
  search?: string;
}

// 学习相关
export interface SubmitReviewRequest {
  userWordId: string;
  quality: 0 | 1 | 2 | 3;
  timeSpent?: number;
}

// 文本分析相关
export interface AnalyzeTextRequest {
  text: string;
}

export interface AnalyzeTextResponse {
  segmented: string[];
  analysis: {
    totalSegments: number;
    uniqueChineseWords: number;
    wordsInDatabase: number;
    knownWords: number;
    newWords: number;
    difficulty: string;
  };
  knownWords: Word[];
  newWords: Word[];
}
```

- [ ] 1.0.6.1 创建 `models.ts`（数据模型）
- [ ] 1.0.6.2 创建 `api.ts`（API类型）
- [ ] 1.0.6.3 创建 `index.ts`（导出所有类型）
- [ ] 1.0.6.4 确保与后端API响应格式一致

**预计时间**: 1小时

#### Task 1.0.7: 创建认证Store（Zustand）
**文件**: `frontend/src/lib/store/authStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/models';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

- [ ] 1.0.7.1 实现认证Store
- [ ] 1.0.7.2 配置持久化存储
- [ ] 1.0.7.3 实现login/logout/updateUser方法

**预计时间**: 30分钟

#### Task 1.0.8: 创建API Service层
**文件**: `frontend/src/lib/api/auth.ts`
```typescript
import apiClient from './client';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';
import { User } from '@/types/models';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};
```

**文件**: `frontend/src/lib/api/words.ts`
```typescript
import apiClient from './client';
import { GetWordsParams, PaginatedResponse } from '@/types/api';
import { Word } from '@/types/models';

export const wordsApi = {
  getWords: async (params: GetWordsParams): Promise<PaginatedResponse<Word>> => {
    const response = await apiClient.get('/api/words', { params });
    return response.data;
  },

  getWordBySlug: async (slug: string): Promise<{ word: Word }> => {
    const response = await apiClient.get(`/api/words/${slug}`);
    return response.data;
  },

  getHSKLevels: async () => {
    const response = await apiClient.get('/api/words/hsk/levels');
    return response.data;
  },
};
```

- [ ] 1.0.8.1 实现 `auth.ts`（认证API）
- [ ] 1.0.8.2 实现 `words.ts`（词汇API）
- [ ] 1.0.8.3 实现 `articles.ts`（文章API）
- [ ] 1.0.8.4 实现 `user.ts`（用户词库API）
- [ ] 1.0.8.5 实现 `learn.ts`（学习API）
- [ ] 1.0.8.6 实现 `text.ts`（文本分析API）

**预计时间**: 2小时

**阶段1.0总预计时间**: 6小时

---

### Module 1.1: 认证功能

#### Task 1.1.1: 创建登录页面
**文件**: `frontend/src/app/(auth)/login/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, token } = await authApi.login({ email, password });
      login(user, token);
      toast({ title: 'Login successful!' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.error || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to continue learning Chinese</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
```

- [ ] 1.1.1.1 创建登录页面组件
- [ ] 1.1.1.2 实现表单UI（email + password）
- [ ] 1.1.1.3 实现表单提交逻辑
- [ ] 1.1.1.4 连接认证Store
- [ ] 1.1.1.5 实现错误处理和Toast提示
- [ ] 1.1.1.6 实现加载状态
- [ ] 1.1.1.7 登录成功后跳转到dashboard

**预计时间**: 1.5小时

#### Task 1.1.2: 创建注册页面
**文件**: `frontend/src/app/(auth)/register/page.tsx`
类似登录页面，增加username字段

- [ ] 1.1.2.1 创建注册页面组件
- [ ] 1.1.2.2 实现表单UI（email + username + password + confirm password）
- [ ] 1.1.2.3 实现表单验证（密码匹配、邮箱格式等）
- [ ] 1.1.2.4 实现表单提交逻辑
- [ ] 1.1.2.5 注册成功后自动登录并跳转

**预计时间**: 1.5小时

#### Task 1.1.3: 创建认证路由守卫
**文件**: `frontend/src/components/auth/AuthGuard.tsx`
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}
```

- [ ] 1.1.3.1 创建AuthGuard组件
- [ ] 1.1.3.2 在dashboard layout中使用
- [ ] 1.1.3.3 实现未登录自动跳转

**预计时间**: 30分钟

**Module 1.1总预计时间**: 3.5小时

---

### Module 1.2: 首页仪表盘

#### Task 1.2.1: 创建Dashboard布局
**文件**: `frontend/src/app/(dashboard)/dashboard/page.tsx`

- [ ] 1.2.1.1 创建页面组件骨架
- [ ] 1.2.1.2 使用Grid布局（3列，响应式）
- [ ] 1.2.1.3 创建欢迎区域
- [ ] 1.2.1.4 创建今日目标卡片区
- [ ] 1.2.1.5 创建统计卡片区
- [ ] 1.2.1.6 创建最新文章推荐区
- [ ] 1.2.1.7 创建快速链接区

**预计时间**: 30分钟

#### Task 1.2.2: 实现欢迎卡片组件
**文件**: `frontend/src/components/features/dashboard/WelcomeCard.tsx`

```typescript
interface WelcomeCardProps {
  username: string;
}

export function WelcomeCard({ username }: WelcomeCardProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Hi {username}, Welcome Back! 👋</CardTitle>
        <CardDescription>Ready to continue your Chinese learning journey?</CardDescription>
      </CardHeader>
    </Card>
  );
}
```

- [ ] 1.2.2.1 创建WelcomeCard组件
- [ ] 1.2.2.2 接收username props
- [ ] 1.2.2.3 添加问候语和时间判断（早上/下午/晚上）
- [ ] 1.2.2.4 添加动画效果（fade-in）

**预计时间**: 30分钟

#### Task 1.2.3: 实现今日学习目标卡片
**文件**: `frontend/src/components/features/dashboard/TodayGoalCard.tsx`

```typescript
interface TodayGoalCardProps {
  dueWordsCount: number;
  onStartLearning: () => void;
}

export function TodayGoalCard({ dueWordsCount, onStartLearning }: TodayGoalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 TODAY'S GOAL</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          You have <span className="font-bold text-blue-600">{dueWordsCount} words</span> to review
        </p>
        <Button onClick={onStartLearning} className="w-full">
          START LEARNING →
        </Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.2.3.1 创建TodayGoalCard组件
- [ ] 1.2.3.2 接收dueWordsCount和onStartLearning props
- [ ] 1.2.3.3 显示待复习词汇数量
- [ ] 1.2.3.4 添加"开始学习"按钮
- [ ] 1.2.3.5 按钮点击跳转到学习中心
- [ ] 1.2.3.6 如果没有待复习词汇，显示祝贺信息

**预计时间**: 45分钟

#### Task 1.2.4: 实现统计卡片组件
**文件**: `frontend/src/components/features/dashboard/StatsCards.tsx`

```typescript
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  subtitle?: string;
}

export function StatCard({ icon, label, value, color, subtitle }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  masteredWords: number;
  studyStreak: number;
  currentHSK: string;
}

export function StatsCards({ masteredWords, studyStreak, currentHSK }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon="📚"
        label="Words Mastered"
        value={masteredWords}
        color="text-green-600"
      />
      <StatCard
        icon="🔥"
        label="Study Streak"
        value={`${studyStreak} days`}
        color="text-orange-600"
      />
      <StatCard
        icon="🎓"
        label="HSK Level"
        value={currentHSK}
        color="text-blue-600"
        subtitle="In Progress"
      />
    </div>
  );
}
```

- [ ] 1.2.4.1 创建StatCard通用组件
- [ ] 1.2.4.2 创建StatsCards容器组件
- [ ] 1.2.4.3 显示已掌握词汇数
- [ ] 1.2.4.4 显示学习连续天数（带火焰图标）
- [ ] 1.2.4.5 显示当前HSK级别
- [ ] 1.2.4.6 添加进度条（可选）
- [ ] 1.2.4.7 添加悬停动画效果

**预计时间**: 1小时

#### Task 1.2.5: 实现最新文章推荐卡片
**文件**: `frontend/src/components/features/dashboard/LatestArticleCard.tsx`

```typescript
interface LatestArticleCardProps {
  article: Article | null;
}

export function LatestArticleCard({ article }: LatestArticleCardProps) {
  if (!article) {
    return <Card><CardContent>No articles available</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📖 LATEST ARTICLE</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="outline">{article.level}</Badge>
        <h3 className="mt-2 font-semibold">{article.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{article.excerpt}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span>{article.newWords.length} new words</span>
          <span>•</span>
          <span>{article.readTime} min read</span>
        </div>
        <Button asChild className="mt-4 w-full">
          <Link href={`/daily-article/${article.id}`}>READ NOW →</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.2.5.1 创建LatestArticleCard组件
- [ ] 1.2.5.2 接收article prop
- [ ] 1.2.5.3 显示文章标题、难度徽章
- [ ] 1.2.5.4 显示文章摘要
- [ ] 1.2.5.5 显示新词数和阅读时间
- [ ] 1.2.5.6 添加"立即阅读"按钮
- [ ] 1.2.5.7 处理无文章的情况

**预计时间**: 45分钟

#### Task 1.2.6: 实现快速链接组件
**文件**: `frontend/src/components/features/dashboard/QuickLinks.tsx`

```typescript
const quickLinks = [
  { icon: BookOpen, label: 'Word Bank', href: '/word-bank', color: 'bg-blue-100 text-blue-600' },
  { icon: Library, label: 'HSK Library', href: '/hsk-library', color: 'bg-green-100 text-green-600' },
  { icon: Search, label: 'Text Analyzer', href: '/text-analyzer', color: 'bg-purple-100 text-purple-600' },
  { icon: FileText, label: 'Daily Articles', href: '/daily-article', color: 'bg-orange-100 text-orange-600' },
];

export function QuickLinks() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`flex flex-col items-center p-4 rounded-lg ${link.color} hover:opacity-80 transition`}>
                <link.icon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">{link.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.2.6.1 创建QuickLinks组件
- [ ] 1.2.6.2 定义快速链接数组（词库、HSK库、文本分析、文章）
- [ ] 1.2.6.3 使用图标库（Lucide React）
- [ ] 1.2.6.4 实现网格布局
- [ ] 1.2.6.5 添加悬停效果
- [ ] 1.2.6.6 响应式设计（移动端2列）

**预计时间**: 30分钟

#### Task 1.2.7: 集成Dashboard数据获取
**文件**: `frontend/src/app/(dashboard)/dashboard/page.tsx`（完整版）

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { userApi } from '@/lib/api/user';
import { learnApi } from '@/lib/api/learn';
import { articlesApi } from '@/lib/api/articles';
import { WelcomeCard } from '@/components/features/dashboard/WelcomeCard';
import { TodayGoalCard } from '@/components/features/dashboard/TodayGoalCard';
import { StatsCards } from '@/components/features/dashboard/StatsCards';
import { LatestArticleCard } from '@/components/features/dashboard/LatestArticleCard';
import { QuickLinks } from '@/components/features/dashboard/QuickLinks';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState(null);
  const [dueWords, setDueWords] = useState([]);
  const [latestArticle, setLatestArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, dueWordsRes, articlesRes] = await Promise.all([
          userApi.getStats(),
          learnApi.getDueWords({ limit: 1 }),
          articlesApi.getArticles({ limit: 1 }),
        ]);
        setStats(statsRes.stats);
        setDueWords(dueWordsRes.words);
        setLatestArticle(articlesRes.articles[0] || null);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <WelcomeCard username={user?.username || 'Guest'} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TodayGoalCard
          dueWordsCount={dueWords.length}
          onStartLearning={() => router.push('/learn')}
        />
        <div className="md:col-span-2">
          <LatestArticleCard article={latestArticle} />
        </div>
      </div>

      <StatsCards
        masteredWords={stats?.masteredWords || 0}
        studyStreak={stats?.studyStreak || 0}
        currentHSK="HSK 2"
      />

      <QuickLinks />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40 col-span-2" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
```

- [ ] 1.2.7.1 实现数据获取逻辑（useEffect）
- [ ] 1.2.7.2 同时获取：用户统计、待复习词汇、最新文章
- [ ] 1.2.7.3 实现加载骨架屏
- [ ] 1.2.7.4 处理错误情况
- [ ] 1.2.7.5 组装所有子组件
- [ ] 1.2.7.6 测试响应式布局

**预计时间**: 1小时

**Module 1.2总预计时间**: 5小时

---

### Module 1.3: 每日一文功能

#### Task 1.3.1: 创建文章列表页面
**文件**: `frontend/src/app/(dashboard)/daily-article/page.tsx`

- [ ] 1.3.1.1 创建页面组件骨架
- [ ] 1.3.1.2 实现顶部标题和描述
- [ ] 1.3.1.3 实现筛选器（难度级别）
- [ ] 1.3.1.4 实现搜索框
- [ ] 1.3.1.5 实现文章网格布局
- [ ] 1.3.1.6 实现分页组件
- [ ] 1.3.1.7 实现加载状态
- [ ] 1.3.1.8 实现空状态

**预计时间**: 1小时

#### Task 1.3.2: 创建文章卡片组件
**文件**: `frontend/src/components/features/article/ArticleCard.tsx`

```typescript
interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      {article.coverImage && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={getLevelVariant(article.level)}>{article.level}</Badge>
          <Badge variant="outline">HSK {article.hskLevel}</Badge>
        </div>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        {article.titleEn && <p className="text-sm text-gray-500">{article.titleEn}</p>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span>📚 {article.newWords.length} new words</span>
            <span>⏱️ {article.readTime} min</span>
          </div>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/daily-article/${article.id}`}>Read Article →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

- [ ] 1.3.2.1 创建ArticleCard组件
- [ ] 1.3.2.2 显示封面图（如果有）
- [ ] 1.3.2.3 显示标题（中英文）
- [ ] 1.3.2.4 显示难度和HSK级别徽章
- [ ] 1.3.2.5 显示摘要（截断2行）
- [ ] 1.3.2.6 显示新词数、阅读时间、发布日期
- [ ] 1.3.2.7 添加"阅读文章"按钮
- [ ] 1.3.2.8 添加悬停动画效果

**预计时间**: 1.5小时

#### Task 1.3.3: 实现文章列表数据获取
**文件**: `frontend/src/app/(dashboard)/daily-article/page.tsx`（数据层）

- [ ] 1.3.3.1 使用React Query获取文章列表
- [ ] 1.3.3.2 实现筛选逻辑（按难度）
- [ ] 1.3.3.3 实现搜索逻辑（防抖处理）
- [ ] 1.3.3.4 实现分页逻辑
- [ ] 1.3.3.5 处理加载和错误状态
- [ ] 1.3.3.6 实现URL查询参数同步

**预计时间**: 1.5小时

#### Task 1.3.4: 创建文章详情页面布局
**文件**: `frontend/src/app/(dashboard)/daily-article/[id]/page.tsx`

- [ ] 1.3.4.1 创建详情页组件骨架
- [ ] 1.3.4.2 实现面包屑导航
- [ ] 1.3.4.3 实现主内容区（左侧70%）
- [ ] 1.3.4.4 实现侧边栏（右侧30%）
- [ ] 1.3.4.5 实现返回按钮
- [ ] 1.3.4.6 实现加载骨架屏
- [ ] 1.3.4.7 响应式布局（移动端单列）

**预计时间**: 1小时

#### Task 1.3.5: 实现文章头部组件
**文件**: `frontend/src/components/features/article/ArticleHeader.tsx`

```typescript
interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={getLevelVariant(article.level)}>{article.level}</Badge>
        <Badge variant="outline">{article.hskLevel}</Badge>
        <span className="text-sm text-gray-500">•</span>
        <span className="text-sm text-gray-500">{article.viewCount} views</span>
        <span className="text-sm text-gray-500">•</span>
        <span className="text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
      </div>
      <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
      {article.titleEn && <p className="text-xl text-gray-600">{article.titleEn}</p>}
    </div>
  );
}
```

- [ ] 1.3.5.1 创建ArticleHeader组件
- [ ] 1.3.5.2 显示文章标题（中英文）
- [ ] 1.3.5.3 显示难度、HSK级别、浏览量、日期
- [ ] 1.3.5.4 添加分享按钮（可选）

**预计时间**: 30分钟

#### Task 1.3.6: 实现音频播放器组件
**文件**: `frontend/src/components/features/article/AudioPlayer.tsx`

```typescript
interface AudioPlayerProps {
  audioUrl: string | undefined;
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSpeed = (rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  if (!audioUrl) {
    return <div className="text-sm text-gray-500">Audio not available</div>;
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <audio ref={audioRef} src={audioUrl} />
        <div className="flex items-center gap-4">
          <Button size="icon" variant="outline" onClick={togglePlay}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1">
            <p className="text-sm font-medium">Article Audio</p>
            <p className="text-xs text-gray-500">Native speaker pronunciation</p>
          </div>
          <Select value={playbackRate.toString()} onValueChange={(v) => changeSpeed(parseFloat(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1.0">1.0x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.3.6.1 创建AudioPlayer组件
- [ ] 1.3.6.2 实现播放/暂停功能
- [ ] 1.3.6.3 实现播放速度调节（0.75x, 1.0x, 1.25x, 1.5x）
- [ ] 1.3.6.4 显示播放进度条（可选）
- [ ] 1.3.6.5 处理音频URL不存在的情况
- [ ] 1.3.6.6 添加键盘快捷键（空格播放/暂停）

**预计时间**: 1.5小时

#### Task 1.3.7: 实现文章内容渲染组件
**文件**: `frontend/src/components/features/article/ArticleContent.tsx`

```typescript
interface ArticleContentProps {
  content: ArticleContent[];
  showPinyin: boolean;
  showTranslation: boolean;
  onWordClick: (word: string) => void;
}

export function ArticleContent({ content, showPinyin, showTranslation, onWordClick }: ArticleContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      {content.map((paragraph, index) => (
        <div key={index} className="mb-6">
          {/* 中文 */}
          <p className="text-lg leading-relaxed mb-2">
            {segmentText(paragraph.cn).map((segment, i) => (
              <span
                key={i}
                className="cursor-pointer hover:bg-yellow-100 transition"
                onClick={() => onWordClick(segment)}
              >
                {segment}
              </span>
            ))}
          </p>
          
          {/* 拼音 */}
          {showPinyin && (
            <p className="text-sm text-gray-500 italic mb-1">{paragraph.pinyin}</p>
          )}
          
          {/* 英文翻译 */}
          {showTranslation && (
            <p className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3">{paragraph.en}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] 1.3.7.1 创建ArticleContent组件
- [ ] 1.3.7.2 渲染文章段落（段落式）
- [ ] 1.3.7.3 实现拼音显示切换
- [ ] 1.3.7.4 实现翻译显示切换
- [ ] 1.3.7.5 实现单词点击高亮
- [ ] 1.3.7.6 实现单词点击弹出Popover
- [ ] 1.3.7.7 支持对话式内容的特殊渲染

**预计时间**: 2小时

#### Task 1.3.8: 实现单词Popover组件
**文件**: `frontend/src/components/features/word/WordPopover.tsx`

```typescript
interface WordPopoverProps {
  word: Word;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export function WordPopover({ word, isOpen, onClose, position }: WordPopoverProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToBank = async () => {
    setIsAdding(true);
    try {
      await userApi.addWord({ wordId: word.id });
      toast({ title: 'Added to word bank!' });
    } catch (error) {
      toast({ title: 'Failed to add', variant: 'destructive' });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverContent
        className="w-80"
        style={{ position: 'absolute', left: position.x, top: position.y }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">{word.chinese}</h4>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{word.pinyin}</span>
            <Button size="icon" variant="ghost" onClick={() => playAudio(word.audioUrl)}>
              <Volume2 className="w-4 h-4" />
            </Button>
            <Badge variant="outline">HSK {word.hskLevel}</Badge>
          </div>

          <p className="text-sm">{word.englishDefinition}</p>

          {word.exampleSentences.length > 0 && (
            <div className="text-xs text-gray-600 border-t pt-2">
              <p className="font-medium mb-1">Example:</p>
              <p>{word.exampleSentences[0].cn}</p>
              <p className="text-gray-500">{word.exampleSentences[0].en}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={handleAddToBank} disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add to Word Bank'}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/hsk-library/word/${word.slug}`}>Full Details</Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

- [ ] 1.3.8.1 创建WordPopover组件
- [ ] 1.3.8.2 显示单词、拼音、释义
- [ ] 1.3.8.3 显示发音按钮
- [ ] 1.3.8.4 显示1个例句
- [ ] 1.3.8.5 实现"添加到词库"按钮
- [ ] 1.3.8.6 实现"查看完整详情"链接
- [ ] 1.3.8.7 实现定位逻辑（跟随鼠标点击位置）

**预计时间**: 1.5小时

#### Task 1.3.9: 实现侧边栏生词列表
**文件**: `frontend/src/components/features/article/NewWordsSidebar.tsx`

```typescript
interface NewWordsSidebarProps {
  words: ArticleWord[];
  onAddAll: () => void;
}

export function NewWordsSidebar({ words, onAddAll }: NewWordsSidebarProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">📝 New Words ({words.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {words.map((word, index) => (
            <div key={index} className="pb-3 border-b last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{word.word}</span>
                <Badge variant="outline" className="text-xs">HSK {word.hsk}</Badge>
              </div>
              <p className="text-xs text-gray-600">{word.pinyin}</p>
              <p className="text-sm text-gray-700">{word.meaning}</p>
            </div>
          ))}
        </div>
        <Button className="w-full" onClick={onAddAll}>
          Add All to Word Bank
        </Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.3.9.1 创建NewWordsSidebar组件
- [ ] 1.3.9.2 显示生词列表（可滚动）
- [ ] 1.3.9.3 每个词显示：汉字、拼音、释义、HSK级别
- [ ] 1.3.9.4 实现"全部添加到词库"按钮
- [ ] 1.3.9.5 添加sticky定位（跟随滚动）

**预计时间**: 1小时

#### Task 1.3.10: 实现文章测验组件
**文件**: `frontend/src/components/features/article/ArticleQuiz.tsx`

```typescript
interface ArticleQuizProps {
  quiz: QuizQuestion[];
}

export function ArticleQuiz({ quiz }: ArticleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const question = quiz[currentQuestion];

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedAnswer === question.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>❓ Reading Quiz ({currentQuestion + 1}/{quiz.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium mb-4">{question.question}</p>
        
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !isSubmitted && setSelectedAnswer(index)}
              disabled={isSubmitted}
              className={`w-full p-3 text-left border rounded-lg transition ${
                isSubmitted
                  ? index === question.answer
                    ? 'border-green-500 bg-green-50'
                    : index === selectedAnswer
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                  : selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {String.fromCharCode(65 + index)}) {option}
            </button>
          ))}
        </div>

        {isSubmitted && question.explanation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">{question.explanation}</p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={currentQuestion === quiz.length - 1}>
              Next Question →
            </Button>
          )}
        </div>

        {currentQuestion === quiz.length - 1 && isSubmitted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-lg font-semibold">Quiz Complete!</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              Score: {score}/{quiz.length}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.3.10.1 创建ArticleQuiz组件
- [ ] 1.3.10.2 实现题目显示（一次一题）
- [ ] 1.3.10.3 实现选项选择（单选）
- [ ] 1.3.10.4 实现答案提交
- [ ] 1.3.10.5 显示正确/错误反馈（绿色/红色）
- [ ] 1.3.10.6 显示解释（如果有）
- [ ] 1.3.10.7 实现下一题功能
- [ ] 1.3.10.8 显示最终得分

**预计时间**: 2小时

#### Task 1.3.11: 集成文章详情页所有组件
**文件**: `frontend/src/app/(dashboard)/daily-article/[id]/page.tsx`（完整版）

- [ ] 1.3.11.1 实现数据获取（文章详情）
- [ ] 1.3.11.2 实现阅读进度跟踪（滚动百分比）
- [ ] 1.3.11.3 自动保存阅读进度到后端
- [ ] 1.3.11.4 组装所有子组件
- [ ] 1.3.11.5 实现拼音/翻译切换按钮
- [ ] 1.3.11.6 实现单词点击→Popover显示逻辑
- [ ] 1.3.11.7 测试所有功能

**预计时间**: 2小时

**Module 1.3总预计时间**: 16小时

---

### Module 1.4: 文本分析器

#### Task 1.4.1: 创建文本分析器页面布局
**文件**: `frontend/src/app/(dashboard)/text-analyzer/page.tsx`

- [ ] 1.4.1.1 创建左右分栏布局（左40%输入，右60%结果）
- [ ] 1.4.1.2 实现响应式布局（移动端上下排列）
- [ ] 1.4.1.3 添加页面标题和说明
- [ ] 1.4.1.4 创建空状态提示

**预计时间**: 30分钟

#### Task 1.4.2: 实现文本输入区组件
**文件**: `frontend/src/components/features/text-analyzer/TextInput.tsx`

```typescript
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  maxLength: number;
}

export function TextInput({ value, onChange, onAnalyze, isAnalyzing, maxLength }: TextInputProps) {
  const charCount = value.length;
  const isValid = charCount > 0 && charCount <= maxLength;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Text</CardTitle>
        <CardDescription>Paste or type Chinese text to analyze (max {maxLength} characters)</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="粘贴或输入中文文本..."
          className="min-h-[300px] text-lg font-serif"
          maxLength={maxLength}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-sm ${charCount > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount} / {maxLength} characters
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onChange('')} disabled={charCount === 0}>
              Clear
            </Button>
            <Button onClick={onAnalyze} disabled={!isValid || isAnalyzing}>
              {isAnalyzing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <>Analyze Text →</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.4.2.1 创建TextInput组件
- [ ] 1.4.2.2 实现大文本框（300px高度）
- [ ] 1.4.2.3 显示字符计数
- [ ] 1.4.2.4 实现最大长度限制（1000字）
- [ ] 1.4.2.5 实现"清空"按钮
- [ ] 1.4.2.6 实现"分析"按钮（带Loading状态）
- [ ] 1.4.2.7 禁用逻辑（空文本或超长）

**预计时间**: 1小时

#### Task 1.4.3: 实现分析结果摘要卡片
**文件**: `frontend/src/components/features/text-analyzer/AnalysisSummary.tsx`

```typescript
interface AnalysisSummaryProps {
  analysis: {
    totalSegments: number;
    uniqueChineseWords: number;
    wordsInDatabase: number;
    knownWords: number;
    newWords: number;
    difficulty: string;
  };
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Analysis Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Words</p>
            <p className="text-2xl font-bold">{analysis.totalSegments}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Unique Words</p>
            <p className="text-2xl font-bold">{analysis.uniqueChineseWords}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">New Words</p>
            <p className="text-2xl font-bold text-red-600">{analysis.newWords}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Known Words</p>
            <p className="text-2xl font-bold text-green-600">{analysis.knownWords}</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium">Difficulty Level</p>
          <p className="text-lg font-bold text-blue-600">{analysis.difficulty}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.4.3.1 创建AnalysisSummary组件
- [ ] 1.4.3.2 显示总词数
- [ ] 1.4.3.3 显示唯一词数
- [ ] 1.4.3.4 显示新词数（红色强调）
- [ ] 1.4.3.5 显示已知词数（绿色强调）
- [ ] 1.4.3.6 显示难度评估（HSK X-Y）
- [ ] 1.4.3.7 使用网格布局

**预计时间**: 45分钟

#### Task 1.4.4: 实现新词列表组件
**文件**: `frontend/src/components/features/text-analyzer/NewWordsList.tsx`

```typescript
interface NewWordsListProps {
  words: Word[];
  onAddWord: (wordId: string) => Promise<void>;
  onAddAll: () => Promise<void>;
}

export function NewWordsList({ words, onAddWord, onAddAll }: NewWordsListProps) {
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());
  const [isAddingAll, setIsAddingAll] = useState(false);

  const handleAddWord = async (wordId: string) => {
    setAddingIds(prev => new Set(prev).add(wordId));
    await onAddWord(wordId);
    setAddingIds(prev => {
      const next = new Set(prev);
      next.delete(wordId);
      return next;
    });
  };

  const handleAddAll = async () => {
    setIsAddingAll(true);
    await onAddAll();
    setIsAddingAll(false);
  };

  // 按HSK级别分组
  const groupedWords = words.reduce((acc, word) => {
    const level = `HSK ${word.hskLevel}`;
    if (!acc[level]) acc[level] = [];
    acc[level].push(word);
    return acc;
  }, {} as Record<string, Word[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>📝 New Words ({words.length})</CardTitle>
          <Button size="sm" onClick={handleAddAll} disabled={isAddingAll || words.length === 0}>
            {isAddingAll ? 'Adding...' : 'Add All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {Object.entries(groupedWords).map(([level, levelWords]) => (
            <div key={level}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{level}</h4>
              <div className="space-y-2">
                {levelWords.map((word) => (
                  <div key={word.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-lg">{word.chinese}</span>
                        <span className="text-sm text-gray-600">{word.pinyin}</span>
                      </div>
                      <p className="text-sm text-gray-700">{word.englishDefinition}</p>
                      {word.exampleSentences[0] && (
                        <p className="text-xs text-gray-500 mt-1 italic">{word.exampleSentences[0].cn}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddWord(word.id)}
                      disabled={addingIds.has(word.id)}
                    >
                      {addingIds.has(word.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.4.4.1 创建NewWordsList组件
- [ ] 1.4.4.2 按HSK级别分组显示
- [ ] 1.4.4.3 显示词汇卡片（汉字、拼音、释义、例句）
- [ ] 1.4.4.4 实现单个添加按钮（带Loading）
- [ ] 1.4.4.5 实现"批量添加"按钮
- [ ] 1.4.4.6 可滚动列表（最大高度600px）
- [ ] 1.4.4.7 添加成功后显示Toast提示

**预计时间**: 1.5小时

#### Task 1.4.5: 实现高亮文本显示组件
**文件**: `frontend/src/components/features/text-analyzer/HighlightedText.tsx`

```typescript
interface HighlightedTextProps {
  text: string;
  segmented: string[];
  knownWords: Set<string>;
  newWords: Set<string>;
  onWordClick: (word: string) => void;
}

export function HighlightedText({ text, segmented, knownWords, newWords, onWordClick }: HighlightedTextProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Highlighted Text</CardTitle>
        <CardDescription>
          <span className="inline-block w-3 h-3 bg-red-200 rounded mr-1"></span> New words
          <span className="inline-block w-3 h-3 bg-green-200 rounded ml-3 mr-1"></span> Known words
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-lg leading-relaxed font-serif">
          {segmented.map((segment, index) => {
            const isNew = newWords.has(segment);
            const isKnown = knownWords.has(segment);
            const className = isNew
              ? 'bg-red-200 hover:bg-red-300 cursor-pointer px-0.5 rounded'
              : isKnown
              ? 'bg-green-200 hover:bg-green-300 cursor-pointer px-0.5 rounded'
              : '';
            
            return (
              <span
                key={index}
                className={className}
                onClick={() => (isNew || isKnown) && onWordClick(segment)}
              >
                {segment}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.4.5.1 创建HighlightedText组件
- [ ] 1.4.5.2 显示分词后的文本
- [ ] 1.4.5.3 新词用红色高亮
- [ ] 1.4.5.4 已知词用绿色高亮
- [ ] 1.4.5.5 点击词汇弹出详情
- [ ] 1.4.5.6 添加图例说明
- [ ] 1.4.5.7 悬停效果

**预计时间**: 1小时

#### Task 1.4.6: 集成文本分析器所有功能
**文件**: `frontend/src/app/(dashboard)/text-analyzer/page.tsx`（完整版）

- [ ] 1.4.6.1 实现数据获取逻辑
- [ ] 1.4.6.2 调用分析API
- [ ] 1.4.6.3 实现防抖处理（避免频繁请求）
- [ ] 1.4.6.4 处理加载和错误状态
- [ ] 1.4.6.5 组装所有子组件
- [ ] 1.4.6.6 实现词汇点击→Popover
- [ ] 1.4.6.7 测试完整流程

**预计时间**: 1.5小时

**Module 1.4总预计时间**: 6小时

---

### Module 1.5: 学习中心（SRS核心）⭐⭐⭐

#### Task 1.5.1: 创建学习会话状态管理
**文件**: `frontend/src/lib/store/learnStore.ts`

```typescript
interface LearnState {
  sessionId: string | null;
  words: UserWord[];
  currentIndex: number;
  isFlipped: boolean;
  results: ReviewResult[];
  startTime: number;
  startSession: (words: UserWord[]) => void;
  endSession: () => void;
  flipCard: () => void;
  submitReview: (quality: 0 | 1 | 2 | 3) => void;
  nextWord: () => void;
}

export const useLearnStore = create<LearnState>()((set, get) => ({
  sessionId: null,
  words: [],
  currentIndex: 0,
  isFlipped: false,
  results: [],
  startTime: 0,
  
  startSession: (words) => set({
    sessionId: crypto.randomUUID(),
    words,
    currentIndex: 0,
    isFlipped: false,
    results: [],
    startTime: Date.now(),
  }),
  
  endSession: () => set({
    sessionId: null,
    words: [],
    currentIndex: 0,
    results: [],
  }),
  
  flipCard: () => set({ isFlipped: true }),
  
  submitReview: (quality) => {
    const state = get();
    const currentWord = state.words[state.currentIndex];
    set({
      results: [...state.results, {
        wordId: currentWord.id,
        quality,
        timeSpent: Date.now() - state.startTime,
      }],
    });
  },
  
  nextWord: () => {
    const state = get();
    set({
      currentIndex: state.currentIndex + 1,
      isFlipped: false,
      startTime: Date.now(),
    });
  },
}));
```

- [ ] 1.5.1.1 创建LearnStore（Zustand）
- [ ] 1.5.1.2 管理会话状态（sessionId、words、currentIndex）
- [ ] 1.5.1.3 管理卡片翻转状态
- [ ] 1.5.1.4 管理复习结果
- [ ] 1.5.1.5 实现startSession方法
- [ ] 1.5.1.6 实现flipCard方法
- [ ] 1.5.1.7 实现submitReview方法
- [ ] 1.5.1.8 实现nextWord方法
- [ ] 1.5.1.9 实现endSession方法

**预计时间**: 1小时

#### Task 1.5.2: 创建学习会话开始页
**文件**: `frontend/src/components/features/learn/SessionStart.tsx`

```typescript
interface SessionStartProps {
  dueWordsCount: number;
  stats: {
    totalWords: number;
    masteredWords: number;
    studyStreak: number;
  };
  onStart: (limit: number) => void;
}

export function SessionStart({ dueWordsCount, stats, onStart }: SessionStartProps) {
  const [selectedLimit, setSelectedLimit] = useState(10);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Ready to Learn?</CardTitle>
          <CardDescription>You have {dueWordsCount} words ready for review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Words</p>
              <p className="text-2xl font-bold">{stats.totalWords}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Mastered</p>
              <p className="text-2xl font-bold text-green-600">{stats.masteredWords}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-bold text-orange-600">{stats.studyStreak}🔥</p>
            </div>
          </div>

          <div className="space-y-3">
            <Label>How many words do you want to review?</Label>
            <div className="flex gap-2">
              {[10, 20, 30].map((limit) => (
                <Button
                  key={limit}
                  variant={selectedLimit === limit ? 'default' : 'outline'}
                  onClick={() => setSelectedLimit(limit)}
                  className="flex-1"
                >
                  {limit} words
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full mt-6"
            size="lg"
            onClick={() => onStart(selectedLimit)}
            disabled={dueWordsCount === 0}
          >
            Start Learning Session →
          </Button>

          {dueWordsCount === 0 && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Great job! No words due for review right now. Check back later! 🎉
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] 1.5.2.1 创建SessionStart组件
- [ ] 1.5.2.2 显示待复习词汇数量
- [ ] 1.5.2.3 显示学习统计（总词数、已掌握、连续天数）
- [ ] 1.5.2.4 实现目标设置（10/20/30词）
- [ ] 1.5.2.5 实现"开始学习"按钮
- [ ] 1.5.2.6 处理无词汇的情况

**预计时间**: 1小时

#### Task 1.5.3: 创建闪卡组件（核心）
**文件**: `frontend/src/components/features/learn/Flashcard.tsx`

```typescript
interface FlashcardProps {
  word: UserWord;
  isFlipped: boolean;
  onFlip: () => void;
  onReview: (quality: 0 | 1 | 2 | 3) => void;
}

export function Flashcard({ word, isFlipped, onFlip, onReview }: FlashcardProps) {
  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative w-full h-[500px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 正面 */}
        <Card
          className={`absolute w-full h-full ${isFlipped ? 'hidden' : ''}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-6xl font-bold mb-6">{word.word.chinese}</h2>
            <p className="text-2xl text-gray-600 mb-4">{word.word.pinyin}</p>
            <Button size="icon" variant="outline" className="mb-8">
              <Volume2 className="w-6 h-6" />
            </Button>
            <Button size="lg" onClick={onFlip} className="mt-auto">
              Show Answer →
            </Button>
          </CardContent>
        </Card>

        {/* 背面 */}
        <Card
          className={`absolute w-full h-full ${!isFlipped ? 'hidden' : ''}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <CardContent className="flex flex-col h-full p-8">
            <div className="text-center mb-4">
              <h3 className="text-4xl font-bold mb-2">{word.word.chinese}</h3>
              <p className="text-xl text-gray-600">{word.word.pinyin}</p>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Meaning</p>
                <p className="text-lg">{word.word.englishDefinition}</p>
              </div>

              {word.word.exampleSentences.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Examples</p>
                  {word.word.exampleSentences.slice(0, 2).map((ex, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-sm">{ex.cn}</p>
                      <p className="text-xs text-gray-600">{ex.en}</p>
                    </div>
                  ))}
                </div>
              )}

              {word.word.characterBreakdown && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">💡 Memory Tip</p>
                  <p className="text-sm text-gray-600">
                    {Object.entries(word.word.characterBreakdown).map(([char, info]: [string, any]) => (
                      <span key={char}>{char} ({info.meaning}) </span>
                    ))}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <p className="text-center text-sm font-medium mb-3">How well did you remember this?</p>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="destructive" onClick={() => onReview(0)} className="flex flex-col py-6">
                  <span className="text-2xl mb-1">😣</span>
                  <span className="text-xs">Again</span>
                </Button>
                <Button variant="outline" onClick={() => onReview(1)} className="flex flex-col py-6 border-orange-300">
                  <span className="text-2xl mb-1">😐</span>
                  <span className="text-xs">Hard</span>
                </Button>
                <Button variant="outline" onClick={() => onReview(2)} className="flex flex-col py-6 border-green-300">
                  <span className="text-2xl mb-1">😊</span>
                  <span className="text-xs">Good</span>
                </Button>
                <Button variant="default" onClick={() => onReview(3)} className="flex flex-col py-6 bg-green-600">
                  <span className="text-2xl mb-1">🎉</span>
                  <span className="text-xs">Easy</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] 1.5.3.1 创建Flashcard组件
- [ ] 1.5.3.2 实现卡片翻转动画（Framer Motion）
- [ ] 1.5.3.3 实现正面显示（汉字、拼音、发音按钮）
- [ ] 1.5.3.4 实现背面显示（释义、例句、记忆技巧）
- [ ] 1.5.3.5 实现"显示答案"按钮
- [ ] 1.5.3.6 实现4个评分按钮（Again/Hard/Good/Easy）
- [ ] 1.5.3.7 添加键盘快捷键（1/2/3/4对应评分）
- [ ] 1.5.3.8 优化动画性能

**预计时间**: 3小时

#### Task 1.5.4: 创建学习进度组件
**文件**: `frontend/src/components/features/learn/LearnProgress.tsx`

```typescript
interface LearnProgressProps {
  current: number;
  total: number;
  results: ReviewResult[];
}

export function LearnProgress({ current, total, results }: LearnProgressProps) {
  const correct = results.filter(r => r.quality >= 2).length;
  const progress = (current / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm text-gray-600">Progress</span>
          <p className="text-2xl font-bold">{current}/{total}</p>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-600">Accuracy</span>
          <p className="text-2xl font-bold text-green-600">
            {results.length > 0 ? Math.round((correct / results.length) * 100) : 0}%
          </p>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
```

- [ ] 1.5.4.1 创建LearnProgress组件
- [ ] 1.5.4.2 显示当前进度（X/Y）
- [ ] 1.5.4.3 显示准确率
- [ ] 1.5.4.4 实现进度条动画
- [ ] 1.5.4.5 根据准确率变化颜色

**预计时间**: 30分钟

#### Task 1.5.5: 创建学习总结组件
**文件**: `frontend/src/components/features/learn/SessionSummary.tsx`

```typescript
interface SessionSummaryProps {
  results: ReviewResult[];
  totalTime: number;
  onContinue: () => void;
  onEnd: () => void;
}

export function SessionSummary({ results, totalTime, onContinue, onEnd }: SessionSummaryProps) {
  const correct = results.filter(r => r.quality >= 2);
  const incorrect = results.filter(r => r.quality < 2);
  const accuracy = Math.round((correct.length / results.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">🎉 Session Complete!</CardTitle>
          <CardDescription>Great job! Here's your summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Words Reviewed</p>
              <p className="text-3xl font-bold text-blue-600">{results.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Correct</p>
              <p className="text-3xl font-bold text-green-600">{correct.length}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Study Time</p>
              <p className="text-3xl font-bold text-orange-600">{Math.round(totalTime / 60)}m</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Accuracy</p>
            <p className="text-4xl font-bold">{accuracy}%</p>
            <Progress value={accuracy} className="mt-2" />
          </div>

          {incorrect.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Words to Review Again ({incorrect.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {incorrect.map((result) => (
                  <div key={result.wordId} className="text-sm p-2 bg-red-50 rounded">
                    {/* Show word info */}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onEnd} className="flex-1">
              End Session
            </Button>
            <Button onClick={onContinue} className="flex-1">
              Continue Learning →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] 1.5.5.1 创建SessionSummary组件
- [ ] 1.5.5.2 显示总结统计（复习数、正确数、时长）
- [ ] 1.5.5.3 显示准确率（百分比 + 进度条）
- [ ] 1.5.5.4 显示需要再次复习的词汇列表
- [ ] 1.5.5.5 实现"继续学习"按钮
- [ ] 1.5.5.6 实现"结束会话"按钮
- [ ] 1.5.5.7 添加庆祝动画（Confetti）

**预计时间**: 1.5小时

#### Task 1.5.6: 集成学习中心完整流程
**文件**: `frontend/src/app/(dashboard)/learn/page.tsx`（完整版）

- [ ] 1.5.6.1 实现状态机（Start → Learning → Summary）
- [ ] 1.5.6.2 获取待复习词汇
- [ ] 1.5.6.3 创建学习会话
- [ ] 1.5.6.4 循环展示闪卡
- [ ] 1.5.6.5 提交每次复习结果到后端
- [ ] 1.5.6.6 结束会话并保存统计
- [ ] 1.5.6.7 实现键盘快捷键
- [ ] 1.5.6.8 测试完整SRS流程

**预计时间**: 2小时

**Module 1.5总预计时间**: 10小时

---

### Module 1.6: 我的词库

#### Task 1.6.1: 创建词库页面布局
**文件**: `frontend/src/app/(dashboard)/word-bank/page.tsx`

- [ ] 1.6.1.1 创建左右分栏布局（60/40）
- [ ] 1.6.1.2 实现响应式（移动端单列）
- [ ] 1.6.1.3 添加页面标题
- [ ] 1.6.1.4 实现空状态提示

**预计时间**: 30分钟

#### Task 1.6.2: 创建词库筛选器组件
**文件**: `frontend/src/components/features/word-bank/WordBankFilters.tsx`

```typescript
interface WordBankFiltersProps {
  statusCounts: {
    NEW: number;
    LEARNING: number;
    MASTERED: number;
    FAVORITES: number;
  };
  selectedStatus: string | null;
  selectedHSK: number | null;
  searchQuery: string;
  onStatusChange: (status: string | null) => void;
  onHSKChange: (level: number | null) => void;
  onSearchChange: (query: string) => void;
}

export function WordBankFilters({ ... }: WordBankFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      <Tabs value={selectedStatus || 'all'} onValueChange={(v) => onStatusChange(v === 'all' ? null : v)}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All ({Object.values(statusCounts).reduce((a, b) => a + b, 0)})</TabsTrigger>
          <TabsTrigger value="NEW">New ({statusCounts.NEW})</TabsTrigger>
          <TabsTrigger value="LEARNING">Learning ({statusCounts.LEARNING})</TabsTrigger>
          <TabsTrigger value="MASTERED">Mastered ({statusCounts.MASTERED})</TabsTrigger>
          <TabsTrigger value="FAVORITES">⭐ ({statusCounts.FAVORITES})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by Chinese or pinyin..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select value={selectedHSK?.toString() || 'all'} onValueChange={(v) => onHSKChange(v === 'all' ? null : parseInt(v))}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="HSK Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All HSK</SelectItem>
            <SelectItem value="1">HSK 1</SelectItem>
            <SelectItem value="2">HSK 2</SelectItem>
            <SelectItem value="3">HSK 3</SelectItem>
            <SelectItem value="4">HSK 4</SelectItem>
            <SelectItem value="5">HSK 5</SelectItem>
            <SelectItem value="6">HSK 6</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(statusCounts.NEW > 0 || statusCounts.LEARNING > 0) && (
        <Button className="w-full" size="lg">
          <Play className="w-4 h-4 mr-2" />
          Start Learning ({statusCounts.NEW + statusCounts.LEARNING} words)
        </Button>
      )}
    </div>
  );
}
```

- [ ] 1.6.2.1 创建WordBankFilters组件
- [ ] 1.6.2.2 实现状态标签（All/New/Learning/Mastered/Favorites）
- [ ] 1.6.2.3 显示每个状态的词汇数量
- [ ] 1.6.2.4 实现搜索框（防抖）
- [ ] 1.6.2.5 实现HSK级别下拉选择
- [ ] 1.6.2.6 实现"开始学习"按钮（仅当有New或Learning词时显示）

**预计时间**: 1小时

#### Task 1.6.3: 创建词汇列表组件
**文件**: `frontend/src/components/features/word-bank/WordList.tsx`

```typescript
interface WordListProps {
  words: UserWord[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function WordList({ words, selectedId, onSelect, onToggleFavorite }: WordListProps) {
  return (
    <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
      {words.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No words found</p>
        </div>
      ) : (
        words.map((userWord) => (
          <div
            key={userWord.id}
            onClick={() => onSelect(userWord.id)}
            className={`p-4 border rounded-lg cursor-pointer transition ${
              selectedId === userWord.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-medium">{userWord.word.chinese}</h4>
                  <Badge variant={getStatusVariant(userWord.status)}>{userWord.status}</Badge>
                  <Badge variant="outline" className="text-xs">HSK {userWord.word.hskLevel}</Badge>
                </div>
                <p className="text-sm text-gray-600">{userWord.word.pinyin}</p>
                <p className="text-sm text-gray-700 mt-1">{userWord.word.englishDefinition}</p>
                
                {userWord.status === 'LEARNING' && (
                  <p className="text-xs text-orange-600 mt-2">
                    Next review: {formatDate(userWord.nextReview)}
                  </p>
                )}
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(userWord.id);
                }}
              >
                {userWord.isFavorite ? (
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
```

- [ ] 1.6.3.1 创建WordList组件
- [ ] 1.6.3.2 显示词汇卡片列表
- [ ] 1.6.3.3 每个卡片显示：汉字、拼音、释义、状态、HSK级别
- [ ] 1.6.3.4 实现选中高亮效果
- [ ] 1.6.3.5 实现收藏按钮（星标）
- [ ] 1.6.3.6 显示下次复习时间（Learning状态）
- [ ] 1.6.3.7 实现可滚动列表
- [ ] 1.6.3.8 实现空状态

**预计时间**: 1.5小时

#### Task 1.6.4: 创建词汇详情面板
**文件**: `frontend/src/components/features/word-bank/WordDetailPanel.tsx`

```typescript
interface WordDetailPanelProps {
  userWord: UserWord;
  onUpdateStatus: (status: WordStatus) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function WordDetailPanel({ userWord, onUpdateStatus, onDelete, onToggleFavorite }: WordDetailPanelProps) {
  const word = userWord.word;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl mb-2">{word.chinese}</CardTitle>
            <div className="flex items-center gap-2">
              <p className="text-lg text-gray-600">{word.pinyin}</p>
              <Button size="icon" variant="ghost">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={onToggleFavorite}>
            {userWord.isFavorite ? (
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="w-5 h-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600">Meaning</Label>
          <p className="text-lg">{word.englishDefinition}</p>
        </div>

        <div>
          <Label className="text-sm text-gray-600">Example Sentences</Label>
          {word.exampleSentences.map((ex, i) => (
            <div key={i} className="mt-2 p-3 bg-gray-50 rounded">
              <p className="text-sm mb-1">{ex.cn}</p>
              <p className="text-xs text-gray-600">{ex.pinyin}</p>
              <p className="text-xs text-gray-500 mt-1">{ex.en}</p>
            </div>
          ))}
        </div>

        {word.characterBreakdown && (
          <div>
            <Label className="text-sm text-gray-600">Character Breakdown</Label>
            <div className="mt-2 space-y-2">
              {Object.entries(word.characterBreakdown).map(([char, info]: [string, any]) => (
                <div key={char} className="flex items-center gap-2 text-sm">
                  <span className="text-lg font-medium">{char}</span>
                  <span className="text-gray-600">({info.pinyin})</span>
                  <span className="text-gray-700">{info.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {word.relatedWords && (
          <div>
            <Label className="text-sm text-gray-600">Related Words</Label>
            {word.relatedWords.synonyms?.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Synonyms:</p>
                <div className="flex flex-wrap gap-1">
                  {word.relatedWords.synonyms.map((w: any, i: number) => (
                    <Badge key={i} variant="secondary">{w.word}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        <div>
          <Label className="text-sm text-gray-600 mb-2 block">Learning Statistics</Label>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">Reviews</p>
              <p className="text-lg font-semibold">{userWord.repetitions}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">Accuracy</p>
              <p className="text-lg font-semibold text-green-600">
                {userWord.correctCount + userWord.wrongCount > 0
                  ? Math.round((userWord.correctCount / (userWord.correctCount + userWord.wrongCount)) * 100)
                  : 0}%
              </p>
            </div>
          </div>
          {userWord.nextReview && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Next review: {formatDate(userWord.nextReview)}
            </p>
          )}
        </div>

        <Separator />

        <div>
          <Label className="text-sm text-gray-600 mb-2 block">Move to...</Label>
          <Select value={userWord.status} onValueChange={(v) => onUpdateStatus(v as WordStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="LEARNING">Learning</SelectItem>
              <SelectItem value="MASTERED">Mastered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/hsk-library/word/${word.slug}`}>
              Full Details →
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Word?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove "{word.chinese}" from your word bank?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={onDelete}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] 1.6.4.1 创建WordDetailPanel组件
- [ ] 1.6.4.2 显示词汇完整信息
- [ ] 1.6.4.3 显示发音按钮
- [ ] 1.6.4.4 显示例句（全部）
- [ ] 1.6.4.5 显示字符拆解
- [ ] 1.6.4.6 显示相关词汇
- [ ] 1.6.4.7 显示学习统计（复习次数、准确率、下次复习）
- [ ] 1.6.4.8 实现状态移动下拉选择
- [ ] 1.6.4.9 实现删除按钮（带确认对话框）
- [ ] 1.6.4.10 实现"查看完整详情"链接

**预计时间**: 2小时

#### Task 1.6.5: 集成词库页面所有功能
**文件**: `frontend/src/app/(dashboard)/word-bank/page.tsx`（完整版）

- [ ] 1.6.5.1 实现数据获取（用户词汇列表）
- [ ] 1.6.5.2 实现筛选逻辑（状态、HSK、搜索）
- [ ] 1.6.5.3 实现词汇选中逻辑
- [ ] 1.6.5.4 实现收藏切换
- [ ] 1.6.5.5 实现状态更新
- [ ] 1.6.5.6 实现删除功能
- [ ] 1.6.5.7 实现批量操作（可选）
- [ ] 1.6.5.8 测试所有交互

**预计时间**: 1.5小时

**Module 1.6总预计时间**: 7小时

---

### Module 1.7: HSK词库与SEO

#### Task 1.7.1: 创建HSK级别列表页
**文件**: `frontend/src/app/(dashboard)/hsk-library/page.tsx`

```typescript
export default function HSKLibraryPage() {
  const levels = [
    { level: 1, words: 150, color: 'bg-blue-500', description: 'Beginner - Daily conversations' },
    { level: 2, words: 300, color: 'bg-green-500', description: 'Elementary - Basic topics' },
    { level: 3, words: 600, color: 'bg-yellow-500', description: 'Intermediate - Complex topics' },
    { level: 4, words: 1200, color: 'bg-orange-500', description: 'Upper Intermediate' },
    { level: 5, words: 2500, color: 'bg-red-500', description: 'Advanced - Fluency' },
    { level: 6, words: 5000, color: 'bg-purple-500', description: 'Proficiency - Native-like' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">HSK Vocabulary Library</h1>
      <p className="text-gray-600 mb-8">
        Comprehensive Chinese vocabulary organized by HSK levels. Each word includes detailed explanations,
        examples, and memory techniques.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Link key={level.level} href={`/hsk-library/level/${level.level}`}>
            <Card className="hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className={`${level.color} text-white`}>
                <CardTitle className="text-3xl">HSK {level.level}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-gray-800 mb-2">{level.words}</p>
                <p className="text-sm text-gray-600 mb-4">words</p>
                <p className="text-sm">{level.description}</p>
                <Button className="w-full mt-4">
                  Browse Words →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] 1.7.1.1 创建HSK级别列表页
- [ ] 1.7.1.2 显示6个级别卡片
- [ ] 1.7.1.3 每个卡片显示词汇数量、描述
- [ ] 1.7.1.4 添加悬停动画
- [ ] 1.7.1.5 点击跳转到该级别词汇列表

**预计时间**: 1小时

#### Task 1.7.2: 创建某级别词汇列表页
**文件**: `frontend/src/app/(dashboard)/hsk-library/level/[level]/page.tsx`

```typescript
export default async function HSKLevelPage({ params }: { params: { level: string } }) {
  const level = parseInt(params.level);
  const { words, pagination } = await wordsApi.getWords({ level, limit: 50 });

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb />
      
      <h1 className="text-3xl font-bold mb-2">HSK {level} Vocabulary</h1>
      <p className="text-gray-600 mb-6">
        {words.length} words at this level
      </p>

      <div className="flex gap-3 mb-6">
        <Input placeholder="Search by Chinese or pinyin..." />
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frequency">Frequency</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="length">Word Length</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {words.map((word) => (
          <Link key={word.id} href={`/hsk-library/word/${word.slug}`}>
            <Card className="hover:border-blue-500 transition cursor-pointer">
              <CardContent className="pt-4">
                <h3 className="text-2xl font-bold mb-1">{word.chinese}</h3>
                <p className="text-sm text-gray-600 mb-2">{word.pinyin}</p>
                <p className="text-sm line-clamp-2">{word.englishDefinition}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination className="mt-6" />
    </div>
  );
}
```

- [ ] 1.7.2.1 创建级别词汇列表页（SSR）
- [ ] 1.7.2.2 实现搜索功能
- [ ] 1.7.2.3 实现排序功能
- [ ] 1.7.2.4 网格展示词汇卡片
- [ ] 1.7.2.5 实现分页
- [ ] 1.7.2.6 面包屑导航

**预计时间**: 2小时

#### Task 1.7.3: 创建词汇详情页（SSG，SEO重点）⭐⭐⭐
**文件**: `frontend/src/app/(dashboard)/hsk-library/word/[slug]/page.tsx`

```typescript
// 静态生成所有词汇页面
export async function generateStaticParams() {
  const words = await wordsApi.getAllWords();
  return words.map((word) => ({
    slug: word.slug,
  }));
}

// 生成SEO元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { word } = await wordsApi.getWordBySlug(params.slug);
  
  return {
    title: `${word.chinese} (${word.pinyin}) - HSK ${word.hskLevel} | ChineseMaster`,
    description: `Learn ${word.chinese} meaning, pronunciation, example sentences, and more. ${word.englishDefinition}`,
    keywords: [word.chinese, word.pinyin, `HSK ${word.hskLevel}`, 'Chinese vocabulary', 'learn Chinese'],
    openGraph: {
      title: `${word.chinese} - ${word.englishDefinition}`,
      description: `HSK ${word.hskLevel} Chinese word with examples and breakdown`,
      type: 'article',
    },
    alternates: {
      canonical: `https://yoursite.com/hsk-library/word/${word.slug}`,
    },
  };
}

export default async function WordDetailPage({ params }: { params: { slug: string } }) {
  const { word } = await wordsApi.getWordBySlug(params.slug);

  // 结构化数据 (Schema.org)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.chinese,
    description: word.englishDefinition,
    inDefinedTermSet: `HSK ${word.hskLevel}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <article className="container max-w-4xl mx-auto py-8">
        {/* 面包屑导航 */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2">
            <li><Link href="/hsk-library">HSK Library</Link></li>
            <li>/</li>
            <li><Link href={`/hsk-library/level/${word.hskLevel}`}>HSK {word.hskLevel}</Link></li>
            <li>/</li>
            <li className="text-gray-600">{word.chinese}</li>
          </ol>
        </nav>

        {/* 主标题区 */}
        <header className="mb-8 text-center">
          <h1 className="text-6xl font-bold mb-4">{word.chinese}</h1>
          <div className="flex items-center justify-center gap-4 mb-3">
            <p className="text-3xl text-gray-600">{word.pinyin}</p>
            <Button size="icon" variant="outline">
              <Volume2 className="w-6 h-6" />
            </Button>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            HSK {word.hskLevel}
          </Badge>
        </header>

        {/* 定义 */}
        <section className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">DEFINITION</h2>
          <p className="text-2xl">{word.englishDefinition}</p>
        </section>

        {/* 拼音详解 */}
        {word.pinyinNumeric && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">Pinyin with Tones</h2>
            <p className="text-lg">
              <span className="font-mono">{word.pinyinNumeric}</span>
              <span className="ml-3 text-gray-600">(numeric)</span>
            </p>
          </section>
        )}

        {/* 字符拆解 */}
        {word.characterBreakdown && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">📝 Character Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(word.characterBreakdown).map(([char, info]: [string, any]) => (
                <Card key={char}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-4xl font-bold">{char}</span>
                      <div>
                        <p className="text-lg text-gray-600">{info.pinyin}</p>
                        <p className="text-sm text-gray-500">
                          {info.strokes && `${info.strokes} strokes`}
                          {info.radical && ` • Radical: ${info.radical}`}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">{info.meaning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* 例句 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">💬 Example Sentences</h2>
          <div className="space-y-4">
            {word.exampleSentences.map((example, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <p className="text-lg font-medium mb-1">{example.cn}</p>
                  <p className="text-sm text-gray-600 italic mb-2">{example.pinyin}</p>
                  <p className="text-sm text-gray-700 border-l-2 border-blue-400 pl-3">
                    {example.en}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 相关词汇 */}
        {word.relatedWords && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">🔗 Related Words</h2>
            
            {word.relatedWords.synonyms?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {word.relatedWords.synonyms.map((w: any, i: number) => (
                    <Link key={i} href={`/hsk-library/word/${w.slug || '#'}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300">
                        {w.word} ({w.pinyin})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {word.relatedWords.antonyms?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Antonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {word.relatedWords.antonyms.map((w: any, i: number) => (
                    <Badge key={i} variant="outline">
                      {w.word} ({w.pinyin})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {word.relatedWords.collocations?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Common Collocations</h3>
                <div className="flex flex-wrap gap-2">
                  {word.relatedWords.collocations.map((w: any, i: number) => (
                    <Badge key={i} variant="outline">
                      {w.word} ({w.pinyin})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        {word.faqs && word.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">❓ Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
              {word.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* 操作按钮 */}
        <section className="flex gap-3 justify-center">
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add to My Word Bank
          </Button>
          <Button size="lg" variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </section>

        {/* 内部链接（SEO） */}
        <nav className="mt-12 pt-6 border-t">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">EXPLORE MORE</h3>
          <div className="flex flex-wrap gap-2">
            <Link href={`/hsk-library/level/${word.hskLevel}`}>
              <Badge variant="outline">More HSK {word.hskLevel} Words</Badge>
            </Link>
            <Link href="/daily-article">
              <Badge variant="outline">Daily Articles</Badge>
            </Link>
            <Link href="/learn">
              <Badge variant="outline">Start Learning</Badge>
            </Link>
          </div>
        </nav>
      </article>
    </>
  );
}
```

- [ ] 1.7.3.1 创建词汇详情页（SSG模式）
- [ ] 1.7.3.2 实现generateStaticParams（预渲染所有词汇）
- [ ] 1.7.3.3 实现generateMetadata（动态SEO）
- [ ] 1.7.3.4 添加Schema.org结构化数据
- [ ] 1.7.3.5 显示字符拆解（可视化）
- [ ] 1.7.3.6 显示例句（多个）
- [ ] 1.7.3.7 显示相关词汇（同义词、反义词、搭配）
- [ ] 1.7.3.8 实现FAQ折叠面板
- [ ] 1.7.3.9 添加面包屑导航
- [ ] 1.7.3.10 添加内部链接（SEO）
- [ ] 1.7.3.11 实现"添加到词库"功能
- [ ] 1.7.3.12 实现分享功能
- [ ] 1.7.3.13 优化页面加载性能

**预计时间**: 4小时

#### Task 1.7.4: SEO优化
- [ ] 1.7.4.1 配置`next-sitemap`生成Sitemap
- [ ] 1.7.4.2 创建`robots.txt`
- [ ] 1.7.4.3 配置Canonical URLs
- [ ] 1.7.4.4 添加hreflang标签（多语言）
- [ ] 1.7.4.5 优化图片alt文本
- [ ] 1.7.4.6 验证Core Web Vitals

**预计时间**: 1小时

**Module 1.7总预计时间**: 8小时

---

### Module 1.8: 用户中心

#### Task 1.8.1: 创建个人信息页面
**文件**: `frontend/src/app/(dashboard)/profile/page.tsx`

- [ ] 1.8.1.1 显示用户头像、用户名、邮箱
- [ ] 1.8.1.2 实现头像上传（可选）
- [ ] 1.8.1.3 编辑用户名
- [ ] 1.8.1.4 修改密码表单
- [ ] 1.8.1.5 保存按钮

**预计时间**: 1.5小时

#### Task 1.8.2: 实现学习统计面板
- [ ] 1.8.2.1 获取用户统计数据
- [ ] 1.8.2.2 显示总学习时间
- [ ] 1.8.2.3 显示连续天数日历热力图
- [ ] 1.8.2.4 显示词汇掌握进度图表
- [ ] 1.8.2.5 显示HSK级别分布
- [ ] 1.8.2.6 显示最近7天学习曲线

**预计时间**: 2小时

#### Task 1.8.3: 实现学习历史列表
- [ ] 1.8.3.1 显示学习会话列表
- [ ] 1.8.3.2 每条记录显示：日期、复习数、时长、准确率
- [ ] 1.8.3.3 实现分页
- [ ] 1.8.3.4 点击查看详情

**预计时间**: 30分钟

**Module 1.8总预计时间**: 4小时

---

### Module 1.9: 全局功能与优化

#### Task 1.9.1: 创建导航栏组件
**文件**: `frontend/src/components/layout/Navbar.tsx`

- [ ] 1.9.1.1 创建Navbar组件
- [ ] 1.9.1.2 显示Logo和网站名称
- [ ] 1.9.1.3 主导航链接（Dashboard、Articles、Library、Learn等）
- [ ] 1.9.1.4 用户下拉菜单（Profile、Settings、Logout）
- [ ] 1.9.1.5 响应式（移动端汉堡菜单）
- [ ] 1.9.1.6 高亮当前页面

**预计时间**: 1.5小时

#### Task 1.9.2: 实现Toast通知系统
- [ ] 1.9.2.1 集成Sonner或React Hot Toast
- [ ] 1.9.2.2 创建useToast Hook
- [ ] 1.9.2.3 在所有页面使用统一Toast
- [ ] 1.9.2.4 成功/错误/警告样式

**预计时间**: 30分钟

#### Task 1.9.3: 实现全局Loading状态
- [ ] 1.9.3.1 创建GlobalLoading组件
- [ ] 1.9.3.2 在路由切换时显示Loading
- [ ] 1.9.3.3 使用NProgress或自定义Loading Bar

**预计时间**: 30分钟

#### Task 1.9.4: 实现全局错误处理
- [ ] 1.9.4.1 创建Error Boundary
- [ ] 1.9.4.2 创建404页面
- [ ] 1.9.4.3 创建500错误页面
- [ ] 1.9.4.4 实现错误日志上报（可选）

**预计时间**: 30分钟

**Module 1.9总预计时间**: 3小时

---

**🎉 阶段1用户端总计: 约68小时（已完成所有详细任务）**

---

## 📦 阶段 2: 管理端前端开发

### Module 2.0: 管理端项目初始化

#### Task 2.0.1: 创建React+Vite项目
- [ ] 2.0.1.1 运行 `npm create vite@latest admin -- --template react-ts`
- [ ] 2.0.1.2 `cd admin && npm install`
- [ ] 2.0.1.3 运行 `npm run dev` 测试

**预计时间**: 10分钟

#### Task 2.0.2: 配置Tailwind CSS
- [ ] 2.0.2.1 `npm install -D tailwindcss postcss autoprefixer`
- [ ] 2.0.2.2 `npx tailwindcss init -p`
- [ ] 2.0.2.3 配置`tailwind.config.js`
- [ ] 2.0.2.4 在`index.css`中导入Tailwind

**预计时间**: 10分钟

#### Task 2.0.3: 安装shadcn/ui
- [ ] 2.0.3.1 `npx shadcn-ui@latest init`
- [ ] 2.0.3.2 安装常用组件（button、card、input、table等）
- [ ] 2.0.3.3 验证组件可用

**预计时间**: 15分钟

#### Task 2.0.4: 安装核心依赖
```bash
npm install react-router-dom axios zustand recharts
npm install @tanstack/react-table zod react-hook-form
npm install lucide-react date-fns
```

- [ ] 2.0.4.1 安装路由
- [ ] 2.0.4.2 安装状态管理和API库
- [ ] 2.0.4.3 安装图表库
- [ ] 2.0.4.4 安装表单和工具库

**预计时间**: 5分钟

#### Task 2.0.5: 创建项目结构
- [ ] 2.0.5.1 创建`src/pages/`目录及文件
- [ ] 2.0.5.2 创建`src/components/`目录及文件
- [ ] 2.0.5.3 创建`src/lib/`目录（api、store、utils）
- [ ] 2.0.5.4 创建`src/types/index.ts`

**预计时间**: 15分钟

#### Task 2.0.6: 配置React Router
**文件**: `admin/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ArticleGenerator } from './pages/ArticleGenerator';
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="article-generator" element={<ArticleGenerator />} />
          <Route path="vocab-generator" element={<VocabGenerator />} />
          <Route path="articles" element={<ArticleManagement />} />
          <Route path="vocabulary" element={<VocabManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="ai-config" element={<AIConfig />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] 2.0.6.1 配置路由结构
- [ ] 2.0.6.2 创建所有页面占位组件
- [ ] 2.0.6.3 配置AdminLayout嵌套路由
- [ ] 2.0.6.4 测试路由跳转

**预计时间**: 30分钟

#### Task 2.0.7: 创建API Client
**文件**: `admin/src/lib/api/client.ts`

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

- [ ] 2.0.7.1 创建API Client
- [ ] 2.0.7.2 配置拦截器
- [ ] 2.0.7.3 创建`.env.local`文件

**预计时间**: 15分钟

**Module 2.0总预计时间**: 1.5小时

---

### Module 2.1: 管理员登录与布局

#### Task 2.1.1: 创建登录页面
**文件**: `admin/src/pages/LoginPage.tsx`

```typescript
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await apiClient.post('/api/auth/login', { email, password });
      
      // 验证是ADMIN权限
      if (data.user.role !== 'ADMIN') {
        toast.error('Access denied: Admin privileges required');
        return;
      }
      
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ChineseMaster Admin</CardTitle>
          <CardDescription>Sign in to manage your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] 2.1.1.1 创建登录页面UI
- [ ] 2.1.1.2 实现表单提交逻辑
- [ ] 2.1.1.3 验证ADMIN权限
- [ ] 2.1.1.4 保存Token到localStorage
- [ ] 2.1.1.5 跳转到Dashboard

**预计时间**: 1小时

#### Task 2.1.2: 创建侧边栏布局
**文件**: `admin/src/components/layout/AdminLayout.tsx`

```typescript
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Article Generator', path: '/article-generator' },
  { icon: BookOpen, label: 'Vocab Generator', path: '/vocab-generator' },
  { icon: FileEdit, label: 'Articles', path: '/articles' },
  { icon: Library, label: 'Vocabulary', path: '/vocabulary' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Settings, label: 'AI Config', path: '/ai-config' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all`}>
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold">CM Admin</h1>}
          <Button size="icon" variant="ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 ${
                location.pathname === item.path ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Welcome, Admin</h2>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] 2.1.2.1 创建侧边栏布局
- [ ] 2.1.2.2 实现菜单项列表
- [ ] 2.1.2.3 高亮当前页面
- [ ] 2.1.2.4 实现侧边栏折叠功能
- [ ] 2.1.2.5 实现顶部栏（欢迎语、退出按钮）
- [ ] 2.1.2.6 实现退出登录功能
- [ ] 2.1.2.7 响应式设计

**预计时间**: 1.5小时

**Module 2.1总预计时间**: 2.5小时

---

### Module 2.2: 仪表盘

#### Task 2.2.1: 创建统计卡片
**文件**: `admin/src/pages/DashboardPage.tsx`

```typescript
export function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalWords: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // 获取统计数据
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change="+12%"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Articles"
          value={stats.totalArticles}
          change="+8"
          icon={FileText}
          color="green"
        />
        <StatCard
          title="Total Words"
          value={stats.totalWords}
          change="+120"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Active Today"
          value={stats.activeUsers}
          change="+23%"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ArticlePublishChart />
        <UserGrowthChart />
      </div>

      {/* 最近活动 */}
      <RecentActivity />
    </div>
  );
}
```

- [ ] 2.2.1.1 创建Dashboard页面骨架
- [ ] 2.2.1.2 创建StatCard组件
- [ ] 2.2.1.3 获取统计数据
- [ ] 2.2.1.4 显示4个统计卡片
- [ ] 2.2.1.5 添加增长百分比和图标

**预计时间**: 1小时

#### Task 2.2.2: 实现图表组件
**文件**: `admin/src/components/dashboard/ArticlePublishChart.tsx`

```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ArticlePublishChart() {
  const data = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 5 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 7 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 6 },
    { day: 'Sun', count: 3 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Publishes This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

- [ ] 2.2.2.1 安装并配置Recharts
- [ ] 2.2.2.2 创建文章发布柱状图
- [ ] 2.2.2.3 创建用户增长折线图
- [ ] 2.2.2.4 实现响应式图表

**预计时间**: 1.5小时

#### Task 2.2.3: 实现最近活动列表
- [ ] 2.2.3.1 创建RecentActivity组件
- [ ] 2.2.3.2 获取最近活动数据
- [ ] 2.2.3.3 显示活动列表（用户学习、文章发布等）
- [ ] 2.2.3.4 添加时间戳

**预计时间**: 30分钟

**Module 2.2总预计时间**: 3小时

---

### Module 2.3: AI文章生成器 ⭐⭐⭐（核心功能）

#### Task 2.3.1: 创建生成表单
**文件**: `admin/src/pages/ArticleGenerator.tsx`

- [ ] 2.3.1.1 创建页面骨架（左侧表单、右侧预览）
- [ ] 2.3.1.2 主题输入框（必填）
- [ ] 2.3.1.3 难度级别选择（Beginner/Intermediate/Advanced）
- [ ] 2.3.1.4 文章长度滑块（200-1000字）
- [ ] 2.3.1.5 关键词输入（可选，逗号分隔）
- [ ] 2.3.1.6 AI模型选择下拉框
- [ ] 2.3.1.7 生成数量选择（1-5篇）
- [ ] 2.3.1.8 "生成文章"按钮

**预计时间**: 1小时

#### Task 2.3.2: 实现AI生成逻辑
- [ ] 2.3.2.1 调用后端 `/api/admin/ai/generate-article` API
- [ ] 2.3.2.2 显示Loading动画（带进度指示）
- [ ] 2.3.2.3 处理生成错误（API Key无效、超时等）
- [ ] 2.3.2.4 保存生成结果到状态
- [ ] 2.3.2.5 Toast成功提示

**预计时间**: 1小时

#### Task 2.3.3: 实现预览和编辑
- [ ] 2.3.3.1 在右侧显示生成的文章内容
- [ ] 2.3.3.2 集成富文本编辑器（Tiptap或TinyMCE）
- [ ] 2.3.3.3 允许编辑标题
- [ ] 2.3.3.4 允许编辑文章内容
- [ ] 2.3.3.5 显示生词列表（可编辑）
- [ ] 2.3.3.6 显示测验题（可编辑、添加、删除）

**预计时间**: 2小时

#### Task 2.3.4: 实现SEO配置区域
- [ ] 2.3.4.1 URL Slug输入框（自动生成，可编辑）
- [ ] 2.3.4.2 Meta Title输入框
- [ ] 2.3.4.3 Meta Description文本框
- [ ] 2.3.4.4 "自动生成SEO"按钮
- [ ] 2.3.4.5 SEO评分显示（0-100分）

**预计时间**: 1小时

#### Task 2.3.5: 实现保存和发布
- [ ] 2.3.5.1 "保存为草稿"按钮
- [ ] 2.3.5.2 "立即发布"按钮
- [ ] 2.3.5.3 "重新生成"按钮
- [ ] 2.3.5.4 调用 `/api/admin/articles` API
- [ ] 2.3.5.5 成功后显示Toast并清空表单
- [ ] 2.3.5.6 失败处理

**预计时间**: 1小时

**Module 2.3总预计时间**: 6小时

---

### Module 2.4: HSK词汇生成器 ⭐⭐⭐（核心功能）

#### Task 2.4.1: 创建词汇输入表单
**文件**: `admin/src/pages/VocabGenerator.tsx`

- [ ] 2.4.1.1 创建页面布局
- [ ] 2.4.1.2 多行文本框（每行一个中文词汇）
- [ ] 2.4.1.3 词汇验证（检查是否为中文）
- [ ] 2.4.1.4 批量限制提示（建议10-20个）
- [ ] 2.4.1.5 HSK级别选择（1-6）
- [ ] 2.4.1.6 AI模型选择

**预计时间**: 1小时

#### Task 2.4.2: 实现内容模块选择
- [ ] 2.4.2.1 多选框：例句（3-5个）
- [ ] 2.4.2.2 多选框：字符拆解
- [ ] 2.4.2.3 多选框：相关词汇（同义词、反义词）
- [ ] 2.4.2.4 多选框：FAQ（3-5个）
- [ ] 2.4.2.5 多选框：记忆技巧
- [ ] 2.4.2.6 "全选/全不选"快捷按钮

**预计时间**: 30分钟

#### Task 2.4.3: 实现批量生成
- [ ] 2.4.3.1 "开始生成"按钮
- [ ] 2.4.3.2 调用 `/api/admin/ai/generate-vocab-batch` API
- [ ] 2.4.3.3 显示生成进度（X/10 completed）
- [ ] 2.4.3.4 显示每个词的状态（✓成功 / ❌失败）
- [ ] 2.4.3.5 处理部分失败情况
- [ ] 2.4.3.6 允许重试失败的词汇

**预计时间**: 1.5小时

#### Task 2.4.4: 实现结果预览
- [ ] 2.4.4.1 逐个预览生成的词汇（带翻页）
- [ ] 2.4.4.2 显示完整内容（汉字、拼音、释义、例句等）
- [ ] 2.4.4.3 SEO评分显示
- [ ] 2.4.4.4 允许编辑每个词汇的内容
- [ ] 2.4.4.5 "上一个"/"下一个"按钮
- [ ] 2.4.4.6 词汇缩略图导航

**预计时间**: 2小时

#### Task 2.4.5: 实现批量发布
- [ ] 2.4.5.1 "全部发布"按钮
- [ ] 2.4.5.2 "保存为草稿"按钮
- [ ] 2.4.5.3 "导出为JSON"按钮
- [ ] 2.4.5.4 调用 `/api/admin/words` API批量创建
- [ ] 2.4.5.5 显示成功统计（X/Y published）
- [ ] 2.4.5.6 Toast提示

**预计时间**: 1小时

**Module 2.4总预计时间**: 6小时

---

### Module 2.5: 文章管理

#### Task 2.5.1: 创建文章列表页面
**文件**: `admin/src/pages/ArticleManagement.tsx`

- [ ] 2.5.1.1 创建页面布局
- [ ] 2.5.1.2 使用@tanstack/react-table创建表格
- [ ] 2.5.1.3 表格列：标题、难度、状态、浏览量、发布日期、操作
- [ ] 2.5.1.4 实现筛选器（难度、状态）
- [ ] 2.5.1.5 实现搜索框（按标题）
- [ ] 2.5.1.6 实现排序功能
- [ ] 2.5.1.7 实现分页

**预计时间**: 2小时

#### Task 2.5.2: 实现操作功能
- [ ] 2.5.2.1 编辑按钮→跳转到编辑页面
- [ ] 2.5.2.2 删除按钮（带确认对话框）
- [ ] 2.5.2.3 查看按钮→前台预览（新标签页）
- [ ] 2.5.2.4 发布/取消发布切换
- [ ] 2.5.2.5 批量操作（批量删除、批量发布）

**预计时间**: 1.5小时

**Module 2.5总预计时间**: 3.5小时

---

### Module 2.6: 词汇管理

#### Task 2.6.1: 创建词汇列表页面
**文件**: `admin/src/pages/VocabManagement.tsx`

- [ ] 2.6.1.1 创建表格（汉字、拼音、HSK级别、来源、状态、操作）
- [ ] 2.6.1.2 实现筛选器（HSK级别、来源、状态）
- [ ] 2.6.1.3 实现搜索功能（汉字/拼音）
- [ ] 2.6.1.4 实现分页

**预计时间**: 2小时

#### Task 2.6.2: 实现批量导入
- [ ] 2.6.2.1 "批量导入"按钮
- [ ] 2.6.2.2 CSV文件上传（拖拽或选择）
- [ ] 2.6.2.3 JSON文件上传
- [ ] 2.6.2.4 格式验证（显示错误行）
- [ ] 2.6.2.5 预览导入数据
- [ ] 2.6.2.6 "确认导入"按钮
- [ ] 2.6.2.7 显示导入进度和结果

**预计时间**: 2小时

#### Task 2.6.3: 实现操作功能
- [ ] 2.6.3.1 编辑按钮→编辑对话框
- [ ] 2.6.3.2 删除按钮（带确认）
- [ ] 2.6.3.3 查看按钮→前台词汇详情页
- [ ] 2.6.3.4 发布/取消发布切换
- [ ] 2.6.3.5 批量操作

**预计时间**: 1小时

**Module 2.6总预计时间**: 5小时

---

### Module 2.7: 用户管理

#### Task 2.7.1: 创建用户列表
**文件**: `admin/src/pages/UserManagement.tsx`

- [ ] 2.7.1.1 创建表格（用户名、邮箱、注册日期、学习词汇数、连续天数、状态）
- [ ] 2.7.1.2 实现筛选器（状态：活跃/不活跃）
- [ ] 2.7.1.3 实现搜索功能（用户名/邮箱）
- [ ] 2.7.1.4 实现分页

**预计时间**: 1.5小时

#### Task 2.7.2: 实现用户详情
- [ ] 2.7.2.1 点击用户名→打开详情对话框
- [ ] 2.7.2.2 显示用户基本信息
- [ ] 2.7.2.3 显示学习统计（词汇数、学习时长、连续天数）
- [ ] 2.7.2.4 显示最近活动列表
- [ ] 2.7.2.5 禁用/启用用户按钮

**预计时间**: 1.5小时

**Module 2.7总预计时间**: 3小时

---

### Module 2.8: AI配置管理

#### Task 2.8.1: 创建模型配置界面
**文件**: `admin/src/pages/AIConfig.tsx`

- [ ] 2.8.1.1 创建模型列表（GLM-4、GLM-4-Flash、GPT-3.5-turbo等）
- [ ] 2.8.1.2 每个模型的配置卡片
- [ ] 2.8.1.3 API Key输入框（密码显示）
- [ ] 2.8.1.4 API URL输入框（可编辑）
- [ ] 2.8.1.5 激活/停用切换开关
- [ ] 2.8.1.6 设置默认模型单选按钮
- [ ] 2.8.1.7 "保存配置"按钮

**预计时间**: 2小时

#### Task 2.8.2: 实现测试连接
- [ ] 2.8.2.1 每个模型的"测试连接"按钮
- [ ] 2.8.2.2 调用 `/api/admin/ai/test` API
- [ ] 2.8.2.3 显示测试结果（成功/失败+响应时间）
- [ ] 2.8.2.4 显示错误信息

**预计时间**: 30分钟

#### Task 2.8.3: 实现使用统计
- [ ] 2.8.3.1 显示本月Token使用量
- [ ] 2.8.3.2 显示生成文章数量
- [ ] 2.8.3.3 显示生成词汇数量
- [ ] 2.8.3.4 显示预估成本
- [ ] 2.8.3.5 使用量图表（折线图，按天）

**预计时间**: 1.5小时

**Module 2.8总预计时间**: 4小时

---

**🎉 阶段2管理端总计: 约31小时（已完成所有详细任务）**

---

## 🔗 阶段 3: 集成与测试

### Task 3.1: 前后端集成

#### Task 3.1.1: 用户端API集成
- [ ] 3.1.1.1 测试所有用户端API调用（20+个接口）
- [ ] 3.1.1.2 修复API响应格式不匹配问题
- [ ] 3.1.1.3 实现Token刷新机制
- [ ] 3.1.1.4 配置全局错误处理
- [ ] 3.1.1.5 测试身份验证流程

**预计时间**: 2小时

#### Task 3.1.2: 管理端API集成
- [ ] 3.1.2.1 测试所有管理端API调用（15+个接口）
- [ ] 3.1.2.2 测试AI生成API（文章、词汇）
- [ ] 3.1.2.3 测试文件上传API
- [ ] 3.1.2.4 修复所有API问题

**预计时间**: 2小时

**Task 3.1总计**: 4小时

---

### Task 3.2: 端到端功能测试

#### Task 3.2.1: 用户注册→登录流程
- [ ] 3.2.1.1 测试注册功能（正常+异常）
- [ ] 3.2.1.2 测试登录功能
- [ ] 3.2.1.3 测试Token持久化
- [ ] 3.2.1.4 测试自动跳转

**预计时间**: 30分钟

#### Task 3.2.2: 学习流程测试
- [ ] 3.2.2.1 添加词汇到词库
- [ ] 3.2.2.2 开始学习会话
- [ ] 3.2.2.3 复习10个词汇
- [ ] 3.2.2.4 提交评分
- [ ] 3.2.2.5 查看学习总结
- [ ] 3.2.2.6 验证SRS算法（间隔时间、easeFactor）
- [ ] 3.2.2.7 连续多天学习，验证连续天数

**预计时间**: 2小时

#### Task 3.2.3: 文章阅读流程
- [ ] 3.2.3.1 浏览文章列表
- [ ] 3.2.3.2 打开文章详情
- [ ] 3.2.3.3 点击生词→查看详情
- [ ] 3.2.3.4 添加生词到词库
- [ ] 3.2.3.5 完成测验
- [ ] 3.2.3.6 验证阅读进度保存

**预计时间**: 1小时

#### Task 3.2.4: 文本分析流程
- [ ] 3.2.4.1 输入中文文本
- [ ] 3.2.4.2 点击分析
- [ ] 3.2.4.3 查看分析结果
- [ ] 3.2.4.4 批量添加新词到词库
- [ ] 3.2.4.5 验证高亮显示

**预计时间**: 30分钟

#### Task 3.2.5: 管理端文章生成流程
- [ ] 3.2.5.1 输入主题和参数
- [ ] 3.2.5.2 点击生成（测试真实GLM API）
- [ ] 3.2.5.3 等待生成结果
- [ ] 3.2.5.4 编辑内容
- [ ] 3.2.5.5 配置SEO
- [ ] 3.2.5.6 发布文章
- [ ] 3.2.5.7 在用户端验证文章显示

**预计时间**: 1小时

#### Task 3.2.6: 管理端词汇生成流程
- [ ] 3.2.6.1 输入10个中文词汇
- [ ] 3.2.6.2 选择内容模块
- [ ] 3.2.6.3 批量生成（测试真实GLM API）
- [ ] 3.2.6.4 预览和编辑
- [ ] 3.2.6.5 批量发布
- [ ] 3.2.6.6 在用户端HSK Library验证

**预计时间**: 1小时

**Task 3.2总计**: 6小时

---

### Task 3.3: 数据准备

#### Task 3.3.1: 准备HSK词汇数据
- [ ] 3.3.1.1 收集HSK 1级词汇列表（150个）
- [ ] 3.3.1.2 为每个词添加拼音、释义
- [ ] 3.3.1.3 使用AI生成器批量生成（例句、拆解、FAQ）
- [ ] 3.3.1.4 人工审核和优化
- [ ] 3.3.1.5 导入到数据库
- [ ] 3.3.1.6 重复HSK 2-6级（约500个词汇）

**预计时间**: 8小时

#### Task 3.3.2: 准备文章数据
- [ ] 3.3.2.1 使用AI生成器生成10篇文章（3个难度）
- [ ] 3.3.2.2 人工审核文章质量
- [ ] 3.3.2.3 优化生词标注
- [ ] 3.3.2.4 编写测验题
- [ ] 3.3.2.5 配置SEO信息
- [ ] 3.3.2.6 发布文章

**预计时间**: 2小时

**Task 3.3总计**: 10小时

---

### Task 3.4: UI/UX优化

#### Task 3.4.1: 响应式设计测试
- [ ] 3.4.1.1 在iPhone（375px）测试所有页面
- [ ] 3.4.1.2 在iPad（768px）测试所有页面
- [ ] 3.4.1.3 在桌面（1920px）测试所有页面
- [ ] 3.4.1.4 修复布局问题

**预计时间**: 2小时

#### Task 3.4.2: 加载状态优化
- [ ] 3.4.2.1 为所有数据获取添加Skeleton
- [ ] 3.4.2.2 为所有按钮添加Loading状态
- [ ] 3.4.2.3 为长时间操作添加进度指示
- [ ] 3.4.2.4 优化首次加载体验

**预计时间**: 2小时

#### Task 3.4.3: 动画和交互优化
- [ ] 3.4.3.1 添加页面切换动画
- [ ] 3.4.3.2 优化闪卡翻转动画
- [ ] 3.4.3.3 添加Toast动画
- [ ] 3.4.3.4 优化按钮hover效果

**预计时间**: 1小时

#### Task 3.4.4: 性能优化
- [ ] 3.4.4.1 实现图片懒加载
- [ ] 3.4.4.2 代码分割（按路由）
- [ ] 3.4.4.3 优化包大小（去除未使用代码）
- [ ] 3.4.4.4 使用React.memo优化组件渲染
- [ ] 3.4.4.5 优化列表渲染（虚拟滚动）

**预计时间**: 1小时

**Task 3.4总计**: 6小时

---

### Task 3.5: Bug修复与最终测试

- [ ] 3.5.1 修复测试中发现的所有Bug（预留）
- [ ] 3.5.2 代码审查和重构
- [ ] 3.5.3 最终回归测试（所有功能）
- [ ] 3.5.4 性能测试（Lighthouse评分）
- [ ] 3.5.5 安全测试（XSS、CSRF防护）

**预计时间**: 4小时

---

**🎉 阶段3总计: 约30小时**

---

## 🚀 阶段 4: 部署与上线

### Task 4.1: 后端部署（Railway）

#### Task 4.1.1: 准备Railway项目
- [ ] 4.1.1.1 注册Railway账号
- [ ] 4.1.1.2 连接GitHub仓库
- [ ] 4.1.1.3 创建新项目（选择backend目录）

**预计时间**: 15分钟

#### Task 4.1.2: 配置PostgreSQL
- [ ] 4.1.2.1 在Railway添加PostgreSQL服务
- [ ] 4.1.2.2 获取DATABASE_URL
- [ ] 4.1.2.3 测试连接

**预计时间**: 15分钟

#### Task 4.1.3: 配置环境变量
- [ ] 4.1.3.1 设置JWT_SECRET（使用随机生成）
- [ ] 4.1.3.2 设置GLM_API_KEY（真实Key）
- [ ] 4.1.3.3 设置GLM_API_URL
- [ ] 4.1.3.4 设置FRONTEND_URL和ADMIN_URL
- [ ] 4.1.3.5 设置NODE_ENV=production
- [ ] 4.1.3.6 验证所有变量

**预计时间**: 30分钟

#### Task 4.1.4: 部署后端
- [ ] 4.1.4.1 推送代码到GitHub
- [ ] 4.1.4.2 触发Railway自动部署
- [ ] 4.1.4.3 查看构建日志
- [ ] 4.1.4.4 等待部署完成

**预计时间**: 30分钟

#### Task 4.1.5: 数据库迁移和种子
- [ ] 4.1.5.1 在Railway执行 `npx prisma migrate deploy`
- [ ] 4.1.5.2 执行 `npm run db:seed`
- [ ] 4.1.5.3 使用Prisma Studio验证数据

**预计时间**: 30分钟

#### Task 4.1.6: 测试生产API
- [ ] 4.1.6.1 测试健康检查：`curl https://your-app.up.railway.app/health`
- [ ] 4.1.6.2 测试用户注册
- [ ] 4.1.6.3 测试用户登录
- [ ] 4.1.6.4 测试获取词汇列表
- [ ] 4.1.6.5 记录API Base URL

**预计时间**: 30分钟

**Task 4.1总计**: 3小时

---

### Task 4.2: 用户端部署（Vercel）

#### Task 4.2.1: 准备Vercel项目
- [ ] 4.2.1.1 注册Vercel账号
- [ ] 4.2.1.2 连接GitHub仓库
- [ ] 4.2.1.3 选择frontend目录

**预计时间**: 15分钟

#### Task 4.2.2: 配置环境变量
- [ ] 4.2.2.1 设置NEXT_PUBLIC_API_URL（Railway后端URL）
- [ ] 4.2.2.2 设置NEXT_PUBLIC_APP_NAME
- [ ] 4.2.2.3 验证变量

**预计时间**: 15分钟

#### Task 4.2.3: 配置构建设置
- [ ] 4.2.3.1 Framework Preset: Next.js
- [ ] 4.2.3.2 Build Command: `npm run build`
- [ ] 4.2.3.3 Output Directory: `.next`
- [ ] 4.2.3.4 Node Version: 20.x

**预计时间**: 15分钟

#### Task 4.2.4: 部署前端
- [ ] 4.2.4.1 推送代码到GitHub
- [ ] 4.2.4.2 触发Vercel自动部署
- [ ] 4.2.4.3 查看构建日志
- [ ] 4.2.4.4 等待部署完成（5-10分钟）

**预计时间**: 30分钟

#### Task 4.2.5: 配置自定义域名（可选）
- [ ] 4.2.5.1 在Vercel添加自定义域名
- [ ] 4.2.5.2 配置DNS A记录或CNAME
- [ ] 4.2.5.3 等待SSL证书生成
- [ ] 4.2.5.4 验证HTTPS访问

**预计时间**: 30分钟

#### Task 4.2.6: 测试生产前端
- [ ] 4.2.6.1 访问Vercel部署URL
- [ ] 4.2.6.2 测试所有页面加载
- [ ] 4.2.6.3 测试用户注册登录
- [ ] 4.2.6.4 测试学习功能
- [ ] 4.2.6.5 测试文章阅读
- [ ] 4.2.6.6 测试API连接

**预计时间**: 30分钟

**Task 4.2总计**: 2.5小时

---

### Task 4.3: 管理端部署（Vercel）

#### Task 4.3.1: 部署管理端
- [ ] 4.3.1.1 在Vercel创建新项目
- [ ] 4.3.1.2 选择admin目录
- [ ] 4.3.1.3 配置VITE_API_URL环境变量
- [ ] 4.3.1.4 Framework Preset: Vite
- [ ] 4.3.1.5 部署并测试

**预计时间**: 1小时

**Task 4.3总计**: 1小时

---

### Task 4.4: 监控与优化

#### Task 4.4.1: 配置错误监控（可选）
- [ ] 4.4.1.1 注册Sentry账号
- [ ] 4.4.1.2 在后端集成@sentry/node
- [ ] 4.4.1.3 在前端集成@sentry/nextjs
- [ ] 4.4.1.4 在管理端集成@sentry/react
- [ ] 4.4.1.5 测试错误上报
- [ ] 4.4.1.6 配置告警规则

**预计时间**: 1.5小时

#### Task 4.4.2: 配置分析工具
- [ ] 4.4.2.1 创建Google Analytics账号
- [ ] 4.4.2.2 在用户端集成GA4
- [ ] 4.4.2.3 配置事件跟踪（页面浏览、学习会话、词汇添加）
- [ ] 4.4.2.4 验证数据收集

**预计时间**: 1小时

#### Task 4.4.3: SEO提交
- [ ] 4.4.3.1 生成sitemap.xml
- [ ] 4.4.3.2 创建Google Search Console账号
- [ ] 4.4.3.3 验证网站所有权
- [ ] 4.4.3.4 提交Sitemap
- [ ] 4.4.3.5 验证robots.txt
- [ ] 4.4.3.6 提交关键词汇页面到Google索引

**预计时间**: 1.5小时

#### Task 4.4.4: 性能优化验证
- [ ] 4.4.4.1 运行Lighthouse测试（Desktop + Mobile）
- [ ] 4.4.4.2 验证Performance Score > 90
- [ ] 4.4.4.3 验证Accessibility Score > 90
- [ ] 4.4.4.4 验证Best Practices Score > 90
- [ ] 4.4.4.5 验证SEO Score > 90
- [ ] 4.4.4.6 优化Core Web Vitals（LCP、FID、CLS）
- [ ] 4.4.4.7 配置CDN缓存策略

**预计时间**: 2小时

**Task 4.4总计**: 6小时

---

**🎉 阶段4总计: 约12.5小时**

---

## 📊 最终统计

| 阶段 | 模块数 | 任务数 | 预计时间 |
|------|--------|--------|----------|
| 阶段0: 后端完善 | 3 | 11 | 9h |
| 阶段1: 用户端 | 9 | 200+ | 68h |
| 阶段2: 管理端 | 8 | 80+ | 31h |
| 阶段3: 集成测试 | 5 | 50+ | 30h |
| 阶段4: 部署上线 | 4 | 30+ | 12.5h |
| **总计** | **29** | **370+** | **150.5h** |

**建议加20%缓冲**: **180-190小时** (约22-24个工作日)

---

## ✅ 任务清单已完成！

**关键成果**:
- ✅ 370+个详细任务
- ✅ 29个模块完整展开
- ✅ 精确到文件、组件、函数级别
- ✅ 包含完整代码框架
- ✅ 每个任务都有预计时间

**核心功能模块**:
- ⭐⭐⭐ Module 1.5: 学习中心SRS（10h）
- ⭐⭐⭐ Module 1.7: HSK词库SSG+SEO（8h）
- ⭐⭐⭐ Module 2.3: AI文章生成器（6h）
- ⭐⭐⭐ Module 2.4: HSK词汇生成器（6h）

**下一步**:
1. 选择执行方案（MVP/完整/模块化）
2. 配置开发环境（Docker、GLM API Key）
3. 从Task 0.1.1开始执行！

🚀 **准备好开始了吗？**
