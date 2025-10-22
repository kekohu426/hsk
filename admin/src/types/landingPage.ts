export type LandingPageStatus = 'DRAFT' | 'READY' | 'PUBLISHED' | 'FAILED';

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
    supportingPoints: Array<{ title: string; description: string }>;
    cta: { text: string; href: string };
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
    sections: Array<{
      title: string;
      body: string;
      bulletPoints: string[];
    }>;
    summaryEn: string;
  };
  usageScenarios: Array<{ title: string; narrative: string; callToAction: string }>;
  cultureNotes: Array<{ title: string; insight: string; reference: string }>;
  grammarAndCollocations: {
    patterns: Array<{ pattern: string; explanation: string; example: string }>;
    commonMistakes: Array<{ mistake: string; correction: string; tip: string }>;
  };
  exampleSentences: Array<{
    cn: string;
    pinyin: string;
    en: string;
    usageNote: string;
    image: { alt: string; caption: string; prompt: string; url: string; placement: string };
  }>;
  relatedWords: {
    synonyms: Array<{ word: string; pinyin: string; meaning: string; note: string; slug: string }>;
    antonyms: Array<{ word: string; pinyin: string; meaning: string; slug: string }>;
    collocations: Array<{ phrase: string; pinyin: string; meaning: string; example: string }>;
  };
  featureHighlights: Array<{
    title: string;
    subtitle: string;
    valueProof: string;
    emotionHook: string;
  }>;
  faq: Array<{ question: string; answer: string }>;
  ctaBlock: {
    headline: string;
    subhead: string;
    primary: { text: string; href: string };
    secondary: { text: string; href: string };
  };
  internalLinks: Array<{ title: string; slug: string; anchorText: string }>;
  externalLinks: Array<{ title: string; url: string; description: string }>;
  media: {
    mainImages: Array<{ alt: string; caption: string; prompt: string; url: string; placement: string }>;
    ogImagePrompt: string;
  };
  schema: Record<string, unknown>;
}

export interface LandingPageMetrics {
  longFormChars: number;
  exampleCount: number;
  faqCount: number;
  keywordCount: number;
  mainImageCount: number;
  score: number;
}
