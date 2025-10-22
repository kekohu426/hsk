import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 创建axios实例
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除并跳转到登录页
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Words API
export const wordsApi = {
  getWords: (params?: { page?: number; limit?: number; hskLevel?: number; search?: string }) =>
    api.get('/words', { params }),
  
  getWordBySlug: (slug: string) =>
    api.get(`/words/slug/${slug}`),

  getWordSlugs: (params?: { page?: number; limit?: number }) =>
    api.get('/words/slugs', { params }),
};

// Articles API
export const articlesApi = {
  getArticles: (params?: { page?: number; limit?: number; level?: string }) =>
    api.get('/articles', { params }),
  
  getArticleBySlug: (slug: string) =>
    api.get(`/articles/${slug}`),
};

// User API
export const userApi = {
  getProfile: () =>
    api.get('/user/profile'),
  
  updateProfile: (data: any) =>
    api.put('/user/profile', data),
  
  getUserWords: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/user/words', { params }),
  
  addWordToBank: (wordId: string, source?: string, status?: 'NEW' | 'LEARNING' | 'MASTERED') =>
    api.post('/user/words', { wordId, source, status }),
  
  updateWordStatus: (wordId: string, data: any) =>
    api.put(`/user/words/${wordId}`, data),
  
  deleteWord: (wordId: string) =>
    api.delete(`/user/words/${wordId}`),
};

// Learn API
export const learnApi = {
  getReviewWords: (limit?: number) =>
    api.get('/learn/review', { params: { limit } }),
  
  submitReview: (data: any) =>
    api.post('/learn/review', data),
  
  getStats: () =>
    api.get('/learn/stats'),
};

// Text API
export const textApi = {
  analyzeText: (text: string) =>
    api.post('/text/analyze', { text }),
};

export default api;

export const landingPageApi = {
  get: (slug: string) => api.get(`/landing-pages/${slug}`),
  listPublished: () => api.get('/landing-pages')
};



