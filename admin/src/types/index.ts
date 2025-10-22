export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  totalWords?: number;
  streakDays?: number;
  lastActive?: string;
}

export interface ExampleSentence {
  cn: string;
  pinyin: string;
  en: string;
  usageNote?: string;
  image?: {
    alt: string;
    caption: string;
    prompt?: string;
    url?: string | null;
    source?: string | null;
    placement?: string | null;
  };
}

export interface LongFormSection {
  title: string;
  body: string;
  bulletPoints?: string[];
}

export interface WordMeta {
  longFormSections: number;
  longFormChineseChars: number;
  hasEnglishSummary: boolean;
  keywordCount: number;
  mainImageCount: number;
  exampleSentenceCount: number;
  exampleImageCoverage: number;
  faqCount: number;
}

// ========== 词条落地页类型定义 ==========

export interface LandingPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
  };
  hero: {
    h1: string;
    tagline: string;
    supportingPoints: Array<{
      title: string;
      description: string;
    }>;
    cta: {
      text: string;
      href: string;
    };
  };
  vocabCard: {
    word: string;
    pinyin: string;
    audioHint: string;
    coreMeaning: string;
    memoryHook: string;
    usageTip: string;
  };
  longForm: {
    sections: LongFormSection[];
    summaryEn: string;
  };
  usageScenarios: Array<{
    title: string;
    narrative: string;
    callToAction: string;
  }>;
  cultureNotes: Array<{
    title: string;
    insight: string;
    reference: string;
  }>;
  grammarAndCollocations: {
    patterns: Array<{
      pattern: string;
      explanation: string;
      example: string;
    }>;
    commonMistakes: Array<{
      mistake: string;
      correction: string;
      tip: string;
    }>;
  };
  exampleSentences: ExampleSentence[];
  relatedWords: {
    synonyms: Array<{
      word: string;
      pinyin: string;
      meaning: string;
      note: string;
      slug: string;
    }>;
    antonyms: Array<{
      word: string;
      pinyin: string;
      meaning: string;
      slug: string;
    }>;
    collocations: Array<{
      phrase: string;
      pinyin: string;
      meaning: string;
      example: string;
    }>;
  };
  featureHighlights: Array<{
    title: string;
    subtitle: string;
    valueProof: string;
    emotionHook: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  ctaBlock: {
    headline: string;
    subhead: string;
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  internalLinks: Array<{
    title: string;
    slug: string;
    anchorText: string;
  }>;
  externalLinks: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  media: {
    mainImages: Array<{
      alt: string;
      caption: string;
      prompt: string;
      url: string;
      placement: string;
    }>;
    ogImagePrompt: string;
  };
  schema: {
    definedTerm: Record<string, any>;
    article: Record<string, any>;
    breadcrumb: Record<string, any>;
  };
}

export interface LandingPageMetrics {
  longFormChars: number;
  exampleCount: number;
  faqCount: number;
  keywordCount: number;
  mainImageCount: number;
  issues: string[];
  score: number;
  isValid: boolean;
}

export interface WordLandingPage {
  id: string;
  word: string;
  slug: string;
  hskLevel: number;
  jsonContent: LandingPageContent;
  seoScore: number | null;
  status: 'DRAFT' | 'READY' | 'PUBLISHED' | 'FAILED';
  wordCount: number;
  exampleCount: number;
  faqCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminWord {
  id: string;
  chinese: string;
  pinyin: string;
  englishDefinition: string;
  hskLevel: number;
  slug: string;
  pinyinNumeric?: string;
  characterBreakdown?: Record<
    string,
    {
      pinyin: string;
      meaning: string;
      radical?: string | null;
      strokes?: number | null;
      mnemonic?: string | null;
    }
  >;
  exampleSentences?: ExampleSentence[];
  relatedWords?: {
    synonyms?: Array<{ word: string; pinyin: string; meaning: string; note?: string; slug?: string }>;
    antonyms?: Array<{ word: string; pinyin: string; meaning: string; slug?: string }>;
    collocations?: Array<{ word: string; pinyin: string; meaning: string; example?: string }>;
  };
  faqs?: Array<{ question: string; answer: string }>;
  longForm?: { sections: LongFormSection[] };
  englishSummary?: string;
  keywords?: string[];
  relatedLinks?: Array<{ title: string; slug: string; anchorText?: string }>;
  mainImages?: Array<{ alt: string; caption: string; prompt?: string; url?: string | null; placement?: string }>;
  qualityIssues?: string[];
  meta?: WordMeta;
  studyData?: any;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  chineseContent: string;
  pinyinContent?: string;
  englishTranslation?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  newWords?: any[];
  quiz?: any[];
  views: number;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface AIConfig {
  id: string;
  provider: 'glm' | 'openai' | 'claude';
  model: string;
  apiKey: string;
  isActive: boolean;
}

export interface Stats {
  totalUsers: number;
  totalArticles: number;
  totalWords: number;
  todayActive: number;
  weeklyArticles: any[];
  userGrowth: any[];
  recentActivity: any[];
}
