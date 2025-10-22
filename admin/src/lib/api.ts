import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 seconds - AI生成需要更长时间
  withCredentials: false, // 不发送cookie
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const landingPageApi = {
  generate: (payload: {
    word: string;
    pinyin?: string;
    hskLevel?: number;
    coreMeaning?: string;
    audience?: string;
    tone?: string;
    keywords?: Record<string, string[]>;
  }) => api.post('/api/admin/landing-pages/generate', payload),
  save: (payload: {
    word: string;
    slug: string;
    jsonContent: any;
    metrics: any;
    status: 'DRAFT' | 'READY' | 'PUBLISHED';
    hskLevel: number;
    aiPrompt: string;
    aiResponseRaw?: string;
  }) => api.post('/api/admin/landing-pages', payload),
  list: () => api.get('/api/admin/landing-pages'),
  get: (slug: string) => api.get(`/api/admin/landing-pages/${slug}`)
};
