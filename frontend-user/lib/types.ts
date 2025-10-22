// User types
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  preferredLang: 'en' | 'ja' | 'ko';
  isPremium: boolean;
  premiumUntil?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Word types
export interface Word {
  id: string;
  chinese: string;
  pinyin: string;
  pinyinNumeric?: string;
  englishDefinition: string;
  hskLevel: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  exampleSentences: ExampleSentence[];
  characterBreakdown?: CharacterBreakdown;
  relatedWords?: RelatedWords;
  faqs?: FAQ[];
  audioUrl?: string;
  frequency: number;
  difficulty: number;
  source: string;
  isPublished: boolean;
  publishedAt?: string;
}

export interface ExampleSentence {
  cn: string;
  pinyin: string;
  en: string;
}

export interface CharacterBreakdown {
  [key: string]: {
    pinyin: string;
    meaning: string;
    radical: string;
    strokes: number;
  };
}

export interface RelatedWords {
  synonyms?: { word: string; pinyin: string; meaning: string }[];
  antonyms?: { word: string; pinyin: string; meaning: string }[];
  collocations?: { word: string; pinyin: string; meaning: string }[];
}

export interface FAQ {
  question: string;
  answer: string;
}

// UserWord types
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

// Article types
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
  quiz?: Quiz[];
  coverImage?: string;
  audioUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
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

export interface Quiz {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

// Learning types
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

export interface LearningStats {
  totalWords: number;
  newWords: number;
  learningWords: number;
  masteredWords: number;
  todayReviewed: number;
  streakDays: number;
  nextReviewCount: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}





